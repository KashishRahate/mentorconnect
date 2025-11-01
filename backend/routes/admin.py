from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required

admin_bp = Blueprint('admin', __name__)
supabase = get_supabase_client()

def check_admin(user_id):
    """Check if user is admin"""
    result = supabase.table('users').select('role').eq('id', user_id).execute()
    if result.data and result.data[0]['role'] == 'admin':
        return True
    return False

@admin_bp.route('/stats', methods=['GET'])
@token_required
def get_stats():
    user_id = request.user_id
    
    if not check_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        # Get all stats
        users = supabase.table('users').select('id, role').execute()
        bookings = supabase.table('bookings').select('id, status').execute()
        sessions = supabase.table('sessions').select('id, status').execute()
        reviews = supabase.table('reviews').select('rating').execute()
        
        total_users = len(users.data) if users.data else 0
        total_mentors = len([u for u in users.data if u['role'] == 'mentor']) if users.data else 0
        total_mentees = len([u for u in users.data if u['role'] == 'mentee']) if users.data else 0
        total_bookings = len(bookings.data) if bookings.data else 0
        completed_sessions = len([s for s in sessions.data if s['status'] == 'completed']) if sessions.data else 0
        total_reviews = len(reviews.data) if reviews.data else 0
        
        avg_rating = 0
        if reviews.data:
            avg_rating = sum(r['rating'] for r in reviews.data) / len(reviews.data)
        
        return jsonify({
            'totalUsers': total_users,
            'totalMentors': total_mentors,
            'totalMentees': total_mentees,
            'totalBookings': total_bookings,
            'completedSessions': completed_sessions,
            'totalReviews': total_reviews,
            'averageRating': round(avg_rating, 2)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@token_required
def get_all_users():
    user_id = request.user_id
    
    if not check_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        result = supabase.table('users').select('id, name, email, role, created_at').order('created_at', desc=True).execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/bookings', methods=['GET'])
@token_required
def get_all_bookings():
    user_id = request.user_id
    
    if not check_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        result = supabase.table('bookings').select('id, mentor_id, mentee_id, booking_date, booking_time, status').order('booking_date', desc=True).execute()
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@token_required
def delete_user(user_id):
    admin_id = request.user_id
    
    if not check_admin(admin_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    if admin_id == user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    try:
        supabase.table('users').delete().eq('id', user_id).execute()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/bookings/<booking_id>', methods=['DELETE'])
@token_required
def delete_booking(booking_id):
    user_id = request.user_id
    
    if not check_admin(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        supabase.table('bookings').delete().eq('id', booking_id).execute()
        return jsonify({'message': 'Booking deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
