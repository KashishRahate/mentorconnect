from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required

users_bp = Blueprint('users', __name__)
supabase = get_supabase_client()

@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    user_id = request.user_id
    
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not result.data:
        return jsonify({'error': 'User not found'}), 404
    
    user = result.data[0]
    del user['password_hash']
    
    return jsonify(user), 200

@users_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user_id = request.user_id
    data = request.get_json()
    
    allowed_fields = ['name', 'bio', 'profile_pic_url', 'linkedin_url']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400
    
    try:
        supabase.table('users').update(update_data).eq('id', user_id).execute()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    result = supabase.table('users').select('*').eq('id', user_id).execute()
    
    if not result.data:
        return jsonify({'error': 'User not found'}), 404
    
    user = result.data[0]
    del user['password_hash']
    
    return jsonify(user), 200
