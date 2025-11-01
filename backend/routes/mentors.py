# # from flask import Blueprint, request, jsonify
# # from utils.supabase_client import get_supabase_client
# # from utils.jwt_utils import token_required

# # mentors_bp = Blueprint('mentors', __name__)
# # supabase = get_supabase_client()

# # @mentors_bp.route('/profile', methods=['GET'])
# # @token_required
# # def get_mentor_profile():
# #     user_id = request.user_id
    
# #     result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()
    
# #     if not result.data:
# #         return jsonify({'error': 'Mentor profile not found'}), 404
    
# #     return jsonify(result.data[0]), 200

# # @mentors_bp.route('/profile', methods=['PUT'])
# # @token_required
# # def update_mentor_profile():
# #     user_id = request.user_id
# #     data = request.get_json()
    
# #     allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
# #     update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
# #     if not update_data:
# #         return jsonify({'error': 'No valid fields to update'}), 400
    
# #     try:
# #         supabase.table('mentor_profile').update(update_data).eq('user_id', user_id).execute()
# #         return jsonify({'message': 'Mentor profile updated successfully'}), 200
# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500
    
# # @mentors_bp.route('/<mentor_id>', methods=['PUT'])
# # @token_required
# # def update_mentor_by_id(mentor_id):
# #     data = request.get_json()
    
# #     allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
# #     update_data = {k: v for k, v in data.items() if k in allowed_fields}

# #     if not update_data:
# #         return jsonify({'error': 'No valid fields to update'}), 400

# #     try:
# #         supabase.table('mentor_profile').update(update_data).eq('user_id', mentor_id).execute()
# #         return jsonify({'message': 'Mentor profile updated successfully'}), 200
# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500


# # # @mentors_bp.route('/search', methods=['GET'])
# # # def search_mentors():
# # #     expertise = request.args.get('expertise')
# # #     min_rate = request.args.get('min_rate', type=float)
# # #     max_rate = request.args.get('max_rate', type=float)
    
# # #     query = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('verified', True)
    
# # #     if expertise:
# # #         query = query.contains('expertise', [expertise])
    
# # #     result = query.execute()
    
# # #     mentors = []
# # #     for mentor in result.data:
# # #         if min_rate and mentor['hourly_rate'] < min_rate:
# # #             continue
# # #         if max_rate and mentor['hourly_rate'] > max_rate:
# # #             continue
# # #         mentors.append(mentor)
    
# # #     return jsonify(mentors), 200

# # @mentors_bp.route('/api/mentors/search', methods=['GET'])
# # def search_mentors():
# #     try:
# #         expertise = request.args.get('expertise')

# #         if not expertise:
# #             return jsonify({'error': 'Expertise parameter is required'}), 400

# #         # Supabase 'ilike' is used for case-insensitive partial matching
# #         response = supabase.table('mentor_profile').select('*').ilike('expertise', f'%{expertise}%').execute()

# #         mentors = response.data or []

# #         if not mentors:
# #             return jsonify({'message': f'No mentors found with expertise "{expertise}"'}), 404

# #         return jsonify(mentors), 200

# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500



# # @mentors_bp.route('/<mentor_id>', methods=['GET'])
# # def get_mentor(mentor_id):
# #     result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('user_id', mentor_id).execute()
    
# #     if not result.data:
# #         return jsonify({'error': 'Mentor not found'}), 404
    
# #     mentor = result.data[0]
    
# #     # Get average rating
# #     reviews = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
# #     if reviews.data:
# #         avg_rating = sum(r['rating'] for r in reviews.data) / len(reviews.data)
# #         mentor['average_rating'] = round(avg_rating, 2)
# #     else:
# #         mentor['average_rating'] = 0
    
# #     return jsonify(mentor), 200

# from flask import Blueprint, request, jsonify
# from utils.supabase_client import get_supabase_client
# from utils.jwt_utils import token_required

# mentors_bp = Blueprint('mentors', __name__)
# supabase = get_supabase_client()


# @mentors_bp.route('/search', methods=['GET'])
# def search_mentors():
#     try:
#         expertise = request.args.get('expertise')
#         if not expertise:
#             return jsonify({'error': 'Expertise parameter is required'}), 400

#         # Attempt with ILIKE (for text column)
#         try:
#             response = supabase.table('mentor_profile').select('*').ilike('expertise', f'%{expertise}%').execute()
#             mentors = response.data
#         except Exception:
#             # Fallback for text[] columns
#             response = supabase.table('mentor_profile').select('*').execute()
#             mentors = [m for m in response.data if any(expertise.lower() in e.lower() for e in m.get('expertise', []))]

#         if not mentors:
#             return jsonify({'message': f'No mentors found with expertise "{expertise}"'}), 404

#         return jsonify(mentors), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500



# # ✅ 2. Get current logged-in mentor profile
# @mentors_bp.route('/profile', methods=['GET'])
# @token_required
# def get_mentor_profile():
#     user_id = request.user_id

#     result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()

#     if not result.data:
#         return jsonify({'error': 'Mentor profile not found'}), 404

#     return jsonify(result.data[0]), 200


# # ✅ 3. Update own profile
# @mentors_bp.route('/profile', methods=['PUT'])
# @token_required
# def update_mentor_profile():
#     user_id = request.user_id
#     data = request.get_json()

#     allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
#     update_data = {k: v for k, v in data.items() if k in allowed_fields}

#     if not update_data:
#         return jsonify({'error': 'No valid fields to update'}), 400

#     try:
#         supabase.table('mentor_profile').update(update_data).eq('user_id', user_id).execute()
#         return jsonify({'message': 'Mentor profile updated successfully'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# # ✅ 4. Update a mentor by ID (for admin)
# @mentors_bp.route('/<mentor_id>', methods=['PUT'])
# @token_required
# def update_mentor_by_id(mentor_id):
#     data = request.get_json()

#     allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
#     update_data = {k: v for k, v in data.items() if k in allowed_fields}

#     if not update_data:
#         return jsonify({'error': 'No valid fields to update'}), 400

#     try:
#         supabase.table('mentor_profile').update(update_data).eq('user_id', mentor_id).execute()
#         return jsonify({'message': 'Mentor profile updated successfully'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# # ✅ 5. Get mentor by ID (after search)
# @mentors_bp.route('/<mentor_id>', methods=['GET'])
# def get_mentor(mentor_id):
#     try:
#         result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('user_id', mentor_id).execute()

#         if not result.data:
#             return jsonify({'error': 'Mentor not found'}), 404

#         mentor = result.data[0]

#         # Calculate average rating
#         reviews = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
#         if reviews.data:
#             avg_rating = sum(r['rating'] for r in reviews.data) / len(reviews.data)
#             mentor['average_rating'] = round(avg_rating, 2)
#         else:
#             mentor['average_rating'] = 0

#         return jsonify(mentor), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

from flask import Blueprint, request, jsonify
from utils.supabase_client import get_supabase_client
from utils.jwt_utils import token_required

mentors_bp = Blueprint('mentors', __name__)
supabase = get_supabase_client()


# ✅ Allow preflight OPTIONS requests globally for this blueprint
@mentors_bp.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'CORS preflight OK'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        return response


# ✅ 1. Search mentors by expertise
@mentors_bp.route('/search', methods=['GET', 'OPTIONS'])
def search_mentors():
    try:
        expertise = request.args.get('expertise')
        if not expertise:
            return jsonify({'error': 'Expertise parameter is required'}), 400

        # Try direct ilike for text field match
        try:
            response = supabase.table('mentor_profile').select('*').ilike('expertise', f'%{expertise}%').execute()
            mentors = response.data
        except Exception:
            # Handle expertise stored as text[]
            response = supabase.table('mentor_profile').select('*').execute()
            mentors = [m for m in response.data if any(expertise.lower() in e.lower() for e in m.get('expertise', []))]

        if not mentors:
            return jsonify({'message': f'No mentors found with expertise "{expertise}"'}), 404

        return jsonify(mentors), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ 2. Get current logged-in mentor profile
@mentors_bp.route('/profile', methods=['GET', 'OPTIONS'])
@token_required
def get_mentor_profile():
    user_id = request.user_id
    result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()

    if not result.data:
        return jsonify({'error': 'Mentor profile not found'}), 404

    return jsonify(result.data[0]), 200


# ✅ 3. Update own mentor profile
@mentors_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@token_required
def update_mentor_profile():
    user_id = request.user_id
    data = request.get_json()

    allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    try:
        supabase.table('mentor_profile').update(update_data).eq('user_id', user_id).execute()
        return jsonify({'message': 'Mentor profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ 4. Update a mentor by ID (for admin or system)
@mentors_bp.route('/<mentor_id>', methods=['PUT', 'OPTIONS'])
@token_required
def update_mentor_by_id(mentor_id):
    data = request.get_json()
    allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    try:
        supabase.table('mentor_profile').update(update_data).eq('user_id', mentor_id).execute()
        return jsonify({'message': 'Mentor profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ 5. Get mentor by ID (for profile view)
@mentors_bp.route('/<mentor_id>', methods=['GET', 'OPTIONS'])
def get_mentor(mentor_id):
    try:
        # Try matching by user_id first
        result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('user_id', mentor_id).execute()

        # If no result, fallback to matching by mentor_profile.id
        if not result.data:
            result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('id', mentor_id).execute()

        if not result.data:
            return jsonify({'error': 'Mentor not found'}), 404

        mentor = result.data[0]

        # Calculate average rating
        reviews = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
        if reviews.data:
            avg_rating = sum(r['rating'] for r in reviews.data) / len(reviews.data)
            mentor['average_rating'] = round(avg_rating, 2)
        else:
            mentor['average_rating'] = 0

        return jsonify(mentor), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
