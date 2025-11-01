from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import create_access_token
import bcrypt
import uuid
import traceback

auth_bp = Blueprint('auth', __name__)
supabase = get_supabase_client()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name') or not data.get('role'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    email = data['email']
    password = data['password']
    name = data['name']
    role = data['role']
    
    if role not in ['mentor', 'mentee']:
        return jsonify({'error': 'Invalid role'}), 400
    
    # Check if user exists
    existing = supabase.table('users').select('id').eq('email', email).execute()
    if existing.data:
        return jsonify({'error': 'User already exists'}), 409
    
    # Hash password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create user
    user_id = str(uuid.uuid4())
    user_data = {
        'id': user_id,
        'name': name,
        'email': email,
        'password_hash': password_hash,
        'role': role
    }
    
    # try:
    #     supabase.table('users').insert(user_data).execute()
        
    #     # Create role-specific profile
    #     if role == 'mentor':
    #         supabase.table('mentor_profile').insert({
    #             'user_id': user_id,
    #             'expertise': [],
    #             'hourly_rate': 0
    #         }).execute()
    #     else:
    #         supabase.table('mentee_profile').insert({
    #             'user_id': user_id,
    #             'learning_goals': [],
    #             'interests': []
    #         }).execute()
        
    #     access_token = create_access_token(user_id, role)
    #     return jsonify({
    #         'message': 'User created successfully',
    #         'access_token': access_token,
    #         'user': {'id': user_id, 'email': email, 'role': role}
    #     }), 201
    # except Exception as e:
    #     print("🔥 SIGNUP ERROR:", e)
    #     traceback.print_exc()
    #     return jsonify({'error': str(e)}), 500
    try:
        print("📩 Incoming signup data:", data)
        supabase.table('users').insert(user_data).execute()
        print("✅ User inserted successfully")
        
        if role == 'mentor':
            supabase.table('mentor_profile').insert({
                'user_id': user_id,
                'expertise': '{}',
                'hourly_rate': 0
            }).execute()
        else:
            supabase.table('mentee_profile').insert({
                'user_id': user_id,
                'learning_goals': '{}',
                'interests': '{}'
            }).execute()

        access_token = create_access_token(user_id, role)
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': {'id': user_id, 'email': email, 'role': role}
        }), 201

    except Exception as e:
        import traceback
        print("🔥 ERROR during signup:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    email = data['email']
    password = data['password']
    
    # Get user
    result = supabase.table('users').select('*').eq('email', email).execute()
    
    if not result.data:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    user = result.data[0]
    
    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(user['id'], user['role'])
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 200
