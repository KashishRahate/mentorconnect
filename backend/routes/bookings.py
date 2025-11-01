from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required
from datetime import datetime
import uuid
import traceback


bookings_bp = Blueprint('bookings', __name__)
supabase = get_supabase_client()

@bookings_bp.route('/', methods=['POST'])
@token_required
def create_booking():
    user_id = request.user_id
    data = request.get_json()
    
    if not data or not data.get('mentor_id') or not data.get('booking_date') or not data.get('booking_time'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    mentor_id = data['mentor_id']
    booking_date = data['booking_date']
    booking_time = data['booking_time']
    
    # Generate Jitsi room ID
    jitsi_room_id = f"mentorconnect-{uuid.uuid4().hex[:8]}"
    
    booking_data = {
        'mentor_id': mentor_id,
        'mentee_id': user_id,
        'booking_date': booking_date,
        'booking_time': booking_time,
        'jitsi_room_id': jitsi_room_id,
        'status': 'pending',
        'notes': data.get('notes', '')
    }
    
    try:
        result = supabase.table('bookings').insert(booking_data).execute()
        return jsonify({'message': 'Booking created successfully', 'booking': result.data[0]}), 201
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/<booking_id>', methods=['GET'])
@token_required
def get_booking(booking_id):
    result = supabase.table('bookings').select('*').eq('id', booking_id).execute()
    
    if not result.data:
        return jsonify({'error': 'Booking not found'}), 404
    
    return jsonify(result.data[0]), 200

@bookings_bp.route('/<booking_id>', methods=['PUT'])
@token_required
def update_booking(booking_id):
    user_id = request.user_id
    data = request.get_json()
    
    # Get booking
    booking = supabase.table('bookings').select('*').eq('id', booking_id).execute()
    if not booking.data:
        return jsonify({'error': 'Booking not found'}), 404
    
    booking = booking.data[0]
    
    # Check authorization
    if booking['mentor_id'] != user_id and booking['mentee_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    allowed_fields = ['status', 'notes']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    try:
        supabase.table('bookings').update(update_data).eq('id', booking_id).execute()
        return jsonify({'message': 'Booking updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bookings_bp.route('/mentee/<mentee_id>', methods=['GET'])
@token_required
def get_mentee_bookings(mentee_id):
    if request.user_id != mentee_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = supabase.table('bookings').select('*').eq('mentee_id', mentee_id).order('booking_date', desc=False).execute()
    return jsonify(result.data), 200

@bookings_bp.route('/mentor/<mentor_id>', methods=['GET'])
@token_required
def get_mentor_bookings(mentor_id):
    if request.user_id != mentor_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = supabase.table('bookings').select('*').eq('mentor_id', mentor_id).order('booking_date', desc=False).execute()
    return jsonify(result.data), 200
