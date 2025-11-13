from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required
from datetime import datetime
import uuid

reviews_bp = Blueprint('reviews', __name__)
supabase = get_supabase_client()

@reviews_bp.route('/', methods=['POST'])
@token_required
def create_review():
    user_id = request.user_id
    data = request.get_json()

    if not data or not data.get('mentor_id') or not data.get('booking_id') or not data.get('rating'):
        return jsonify({'error': 'Missing required fields'}), 400

    if data['rating'] < 1 or data['rating'] > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400

    # ✅ Verify booking exists and belongs to the mentee
    booking_res = supabase.table('bookings').select('*').eq('id', data['booking_id']).execute()
    if not booking_res.data:
        return jsonify({'error': 'Booking not found'}), 404

    booking = booking_res.data[0]

    # ✅ Ensure only mentee who booked can review
    if booking['mentee_id'] != user_id:
        return jsonify({'error': 'You are not authorized to review this booking'}), 403

    # ✅ Ensure the session is completed
    if booking['status'] != 'completed':
        return jsonify({'error': 'You can only leave a review after the session is completed'}), 400

    # ✅ Prevent duplicate reviews
    existing = supabase.table('reviews').select('id').eq('booking_id', data['booking_id']).execute()
    if existing.data:
        return jsonify({'error': 'Review already exists for this booking'}), 409

    review_data = {
        'id': str(uuid.uuid4()),
        'mentee_id': user_id,
        'mentor_id': data['mentor_id'],
        'booking_id': data['booking_id'],
        'rating': data['rating'],
        'feedback': data.get('feedback', ''),
        'created_at': datetime.utcnow().isoformat()
    }

    try:
        result = supabase.table('reviews').insert(review_data).execute()
        return jsonify({'message': 'Review created successfully', 'review': result.data[0]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@reviews_bp.route('/mentor/<mentor_id>', methods=['GET'])
def get_reviews_by_mentor(mentor_id):
    try:
        # Fetch reviews and include mentee (user) details in one query
        result = supabase.table("reviews").select(
            "id, rating, feedback, created_at, mentee_id, users:mentee_id(id, name, email, profile_pic_url)"
        ).eq("mentor_id", mentor_id).execute()

        if not result.data:
            return jsonify([]), 200

        return jsonify(result.data), 200

    except Exception as e:
        print("Error fetching reviews:", e)
        return jsonify({"error": str(e)}), 500

@reviews_bp.route('/mentor/<mentor_id>/stats', methods=['GET'])
def get_mentor_review_stats(mentor_id):
    try:
        result = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
        
        reviews = result.data
        if not reviews:
            return jsonify({
                'average_rating': 0,
                'total_reviews': 0,
                'rating_distribution': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }), 200
        
        # Calculate stats
        ratings = [r['rating'] for r in reviews]
        avg_rating = sum(ratings) / len(ratings)
        
        # Distribution
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for rating in ratings:
            distribution[rating] += 1
        
        return jsonify({
            'average_rating': round(avg_rating, 1),
            'total_reviews': len(reviews),
            'rating_distribution': distribution
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<review_id>', methods=['GET'])
def get_review(review_id):
    try:
        result = supabase.table('reviews').select('*').eq('id', review_id).execute()
        
        if not result.data:
            return jsonify({'error': 'Review not found'}), 404
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reviews_bp.route('/<review_id>', methods=['DELETE'])
@token_required
def delete_review(review_id):
    user_id = request.user_id
    
    try:
        # Get review
        result = supabase.table('reviews').select('*').eq('id', review_id).execute()
        
        if not result.data:
            return jsonify({'error': 'Review not found'}), 404
        
        review = result.data[0]
        
        # Check authorization (only mentee who wrote the review can delete)
        if review['mentee_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        supabase.table('reviews').delete().eq('id', review_id).execute()
        return jsonify({'message': 'Review deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
