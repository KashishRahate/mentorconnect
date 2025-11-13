# from flask import Blueprint, request, jsonify
# from utils.supabase_client import get_supabase_client
# from utils.jwt_utils import token_required

# users_bp = Blueprint('users', __name__)
# supabase = get_supabase_client()

# @users_bp.before_request
# def handle_preflight():
#     if request.method == "OPTIONS":
#         response = jsonify({'message': 'CORS preflight OK'})
#         response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#         response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
#         response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
#         return response


# @users_bp.route('/profile', methods=['GET'])
# @token_required
# def get_profile():
#     user_id = request.user_id
    
#     result = supabase.table('users').select('*').eq('id', user_id).execute()
    
#     if not result.data:
#         return jsonify({'error': 'User not found'}), 404
    
#     user = result.data[0]
#     del user['password_hash']
    
#     return jsonify(user), 200

# @users_bp.route('/profile', methods=['PUT'])
# @token_required
# def update_profile():
#     user_id = request.user_id
#     data = request.get_json()
    
#     allowed_fields = ['name', 'bio', 'profile_pic_url', 'linkedin_url']
#     update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
#     if not update_data:
#         return jsonify({'error': 'No valid fields to update'}), 400
    
#     try:
#         supabase.table('users').update(update_data).eq('id', user_id).execute()
#         return jsonify({'message': 'Profile updated successfully'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @users_bp.route('/<user_id>', methods=['GET'])
# def get_user(user_id):
#     result = supabase.table('users').select('*').eq('id', user_id).execute()
    
#     if not result.data:
#         return jsonify({'error': 'User not found'}), 404
    
#     user = result.data[0]
#     del user['password_hash']
    
#     return jsonify(user), 200

from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required

users_bp = Blueprint('users', __name__)
supabase = get_supabase_client()

# ✅ Handle CORS preflight globally
@users_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'CORS preflight OK'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        return response


# ✅ Get logged-in user's profile
@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    user_id = request.user_id

    result = supabase.table('users').select('*').eq('id', user_id).execute()

    if not result.data:
        return jsonify({'error': 'User not found'}), 404

    user = result.data[0]
    if 'password_hash' in user:
        del user['password_hash']

    return jsonify(user), 200


# ✅ Update logged-in user's base profile (name, bio, pic, etc.)
@users_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@token_required
def update_profile():
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

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
        print("Error updating user profile:", e)
        return jsonify({'error': str(e)}), 500


# ✅ Get any user's public data (for viewing)
@users_bp.route('/<user_id>', methods=['GET', 'OPTIONS'])
def get_user(user_id):
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    result = supabase.table('users').select('*').eq('id', user_id).execute()

    if not result.data:
        return jsonify({'error': 'User not found'}), 404

    user = result.data[0]
    if 'password_hash' in user:
        del user['password_hash']

    return jsonify(user), 200


# ✅ Update mentee-specific profile
@users_bp.route('/<user_id>/mentee-profile', methods=['PUT', 'OPTIONS'])
@token_required
def update_mentee_profile(user_id):
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    data = request.get_json()

    allowed_fields = ['learning_goals', 'interests']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    # Convert strings to array format if needed
    if isinstance(update_data.get('learning_goals'), str):
        update_data['learning_goals'] = [g.strip() for g in update_data['learning_goals'].split(',') if g.strip()]
    if isinstance(update_data.get('interests'), str):
        update_data['interests'] = [i.strip() for i in update_data['interests'].split(',') if i.strip()]

    try:
        result = supabase.table('mentee_profile').update(update_data).eq('user_id', user_id).execute()

        if result.data == []:
            # If mentee profile doesn't exist, create a new one
            update_data['user_id'] = user_id
            supabase.table('mentee_profile').insert(update_data).execute()

        return jsonify({'message': 'Mentee profile updated successfully'}), 200

    except Exception as e:
        print("Error updating mentee profile:", e)
        return jsonify({'error': str(e)}), 500

