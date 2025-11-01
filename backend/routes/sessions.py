from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required
from datetime import datetime
import uuid

sessions_bp = Blueprint('sessions', __name__)
supabase = get_supabase_client()

@sessions_bp.route('/', methods=['POST'])
@token_required
def create_session():
    user_id = request.user_id
    data = request.get_json()
    
    if not data or not data.get('booking_id'):
        return jsonify({'error': 'Missing booking_id'}), 400
    
    booking_id = data['booking_id']
    
    # Get booking
    booking = supabase.table('bookings').select('*').eq('id', booking_id).execute()
    if not booking.data:
        return jsonify({'error': 'Booking not found'}), 404
    
    booking = booking.data[0]
    
    # Check authorization
    if booking['mentor_id'] != user_id and booking['mentee_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    existing_session = supabase.table('sessions').select('*').eq('booking_id', booking_id).execute()
    if existing_session.data:
        return jsonify({'message': 'Session already exists', 'session': existing_session.data[0]}), 200
    
    session_data = {
        'id': str(uuid.uuid4()),
        'booking_id': booking_id,
        'mentor_id': booking['mentor_id'],
        'mentee_id': booking['mentee_id'],
        'start_time': datetime.utcnow().isoformat(),
        'jitsi_room_id': booking['jitsi_room_id'],
        'status': 'in_progress'
    }
    
    try:
        result = supabase.table('sessions').insert(session_data).execute()
        return jsonify({'message': 'Session started', 'session': result.data[0]}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/<session_id>', methods=['GET'])
@token_required
def get_session(session_id):
    user_id = request.user_id
    
    # Get session
    session = supabase.table('sessions').select('*').eq('id', session_id).execute()
    if not session.data:
        return jsonify({'error': 'Session not found'}), 404
    
    session = session.data[0]
    
    # Check authorization
    if session['mentor_id'] != user_id and session['mentee_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(session), 200

@sessions_bp.route('/<session_id>/end', methods=['PUT'])
@token_required
def end_session(session_id):
    user_id = request.user_id
    data = request.get_json()
    
    # Get session
    session = supabase.table('sessions').select('*').eq('id', session_id).execute()
    if not session.data:
        return jsonify({'error': 'Session not found'}), 404
    
    session = session.data[0]
    
    # Check authorization
    if session['mentor_id'] != user_id and session['mentee_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    update_data = {
        'end_time': datetime.utcnow().isoformat(),
        'status': 'completed',
        'recording_url': data.get('recording_url')
    }
    
    try:
        supabase.table('sessions').update(update_data).eq('id', session_id).execute()
        return jsonify({'message': 'Session ended'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sessions_bp.route('/mentor/<mentor_id>', methods=['GET'])
@token_required
def get_mentor_sessions(mentor_id):
    user_id = request.user_id
    
    if user_id != mentor_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = supabase.table('sessions').select('*').eq('mentor_id', mentor_id).order('start_time', desc=True).execute()
    return jsonify(result.data), 200

@sessions_bp.route('/mentee/<mentee_id>', methods=['GET'])
@token_required
def get_mentee_sessions(mentee_id):
    user_id = request.user_id
    
    if user_id != mentee_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    result = supabase.table('sessions').select('*').eq('mentee_id', mentee_id).order('start_time', desc=True).execute()
    return jsonify(result.data), 200
