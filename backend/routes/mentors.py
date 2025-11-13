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

# from flask import Blueprint, request, jsonify
# from utils.supabase_client import get_supabase_client
# from utils.jwt_utils import token_required

# mentors_bp = Blueprint('mentors', __name__)
# supabase = get_supabase_client()


# @mentors_bp.route('/search', methods=['GET', 'OPTIONS'])
# def search_mentors():
#     try:
#         expertise = request.args.get('expertise', '').strip()

#         # ✅ Step 1: Fetch mentors (join with users table)
#         if expertise:
#             # Try ilike first (for text field)
#             try:
#                 response = (
#                     supabase.table('mentor_profile')
#                     .select('id, user_id, expertise, hourly_rate, users:user_id(name, bio, profile_pic_url)')
#                     .ilike('expertise', f'%{expertise}%')
#                     .execute()
#                 )
#                 mentors = response.data or []
#             except Exception:
#                 # Handle text[] expertise type
#                 response = (
#                     supabase.table('mentor_profile')
#                     .select('id, user_id, expertise, hourly_rate, users:user_id(name, bio, profile_pic_url)')
#                     .execute()
#                 )
#                 mentors = [
#                     m for m in response.data
#                     if any(expertise.lower() in e.lower() for e in (m.get('expertise') or []))
#                 ]
#         else:
#             # No expertise filter → return all mentors
#             response = (
#                 supabase.table('mentor_profile')
#                 .select('id, user_id, expertise, hourly_rate, users:user_id(name, bio, profile_pic_url)')
#                 .execute()
#             )
#             mentors = response.data or []

#         if not mentors:
#             return jsonify({'message': f'No mentors found matching "{expertise or "any"}"'}), 200

#         # ✅ Step 2: Compute average ratings from reviews
#         mentor_ids = [m['user_id'] for m in mentors]
#         ratings_res = supabase.table('reviews').select('mentor_id, rating').in_('mentor_id', mentor_ids).execute()

#         rating_map = {}
#         for r in ratings_res.data or []:
#             rating_map.setdefault(r['mentor_id'], []).append(r['rating'])

#         for m in mentors:
#             ratings = rating_map.get(m['user_id'], [])
#             m['average_rating'] = round(sum(ratings) / len(ratings), 2) if ratings else 0.0

#         # ✅ Step 3: Return mentors (with profile image + rating)
#         return jsonify(mentors), 200

#     except Exception as e:
#         print("Error in /search:", e)
#         return jsonify({'error': str(e)}), 500





# # ✅ 2. Get current logged-in mentor profile
# @mentors_bp.route('/profile', methods=['GET', 'OPTIONS'])
# @token_required
# def get_mentor_profile():
#     user_id = request.user_id
#     result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()

#     if not result.data:
#         return jsonify({'error': 'Mentor profile not found'}), 404

#     return jsonify(result.data[0]), 200


# # ✅ 3. Update own mentor profile
# @mentors_bp.route('/profile', methods=['PUT', 'OPTIONS'])
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


# # ✅ 4. Update a mentor by ID (for admin or system)
# @mentors_bp.route('/<mentor_id>', methods=['PUT', 'OPTIONS'])
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


# # ✅ 5. Get mentor by ID (for profile view)
# @mentors_bp.route('/<mentor_id>', methods=['GET', 'OPTIONS'])
# def get_mentor(mentor_id):
#     try:
#         # Try matching by user_id first
#         result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('user_id', mentor_id).execute()

#         # If no result, fallback to matching by mentor_profile.id
#         if not result.data:
#             result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('id', mentor_id).execute()

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


# from flask import Blueprint, request, jsonify
# from utils.supabase_client import get_supabase_client
# from utils.jwt_utils import token_required

# mentors_bp = Blueprint('mentors', __name__)
# supabase = get_supabase_client()


# # ✅ Handle CORS preflight requests
# @mentors_bp.before_request
# def handle_preflight():
#     if request.method == "OPTIONS":
#         response = jsonify({'message': 'CORS preflight OK'})
#         response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
#         response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
#         response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
#         return response


# # ✅ 1. Search mentors (now includes email + profile_pic_url)
# @mentors_bp.route('/search', methods=['GET', 'OPTIONS'])
# def search_mentors():
#     try:
#         expertise = request.args.get('expertise', '').strip()

#         base_select = (
#             "id, user_id, expertise, hourly_rate, "
#             "users:user_id(name, bio, email, profile_pic_url)"
#         )

#         # Case-insensitive search
#         try:
#             if expertise:
#                 response = (
#                     supabase.table('mentor_profile')
#                     .select(base_select)
#                     .ilike('expertise', f'%{expertise}%')
#                     .execute()
#                 )
#                 mentors = response.data or []
#             else:
#                 response = supabase.table('mentor_profile').select(base_select).execute()
#                 mentors = response.data or []
#         except Exception:
#             # Handle TEXT[] column case
#             response = supabase.table('mentor_profile').select(base_select).execute()
#             mentors = [
#                 m for m in response.data
#                 if expertise.lower() in [e.lower() for e in (m.get('expertise') or [])]
#             ] if expertise else response.data

#         # Compute average ratings
#         mentor_ids = [m['user_id'] for m in mentors]
#         if mentor_ids:
#             ratings_res = (
#                 supabase.table('reviews')
#                 .select('mentor_id, rating')
#                 .in_('mentor_id', mentor_ids)
#                 .execute()
#             )
#             rating_map = {}
#             for r in ratings_res.data or []:
#                 rating_map.setdefault(r['mentor_id'], []).append(r['rating'])

#             for m in mentors:
#                 ratings = rating_map.get(m['user_id'], [])
#                 m['average_rating'] = round(sum(ratings) / len(ratings), 2) if ratings else 0.0
#         else:
#             for m in mentors:
#                 m['average_rating'] = 0.0

#         return jsonify(mentors), 200

#     except Exception as e:
#         print("Error in /search:", e)
#         return jsonify({'error': str(e)}), 500


# # ✅ 2. Get logged-in mentor profile
# @mentors_bp.route('/profile', methods=['GET', 'OPTIONS'])
# @token_required
# def get_mentor_profile():
#     user_id = request.user_id
#     result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()

#     if not result.data:
#         return jsonify({'error': 'Mentor profile not found'}), 404

#     return jsonify(result.data[0]), 200


# # ✅ 3. Update mentor profile
# @mentors_bp.route('/profile', methods=['PUT', 'OPTIONS'])
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


# # ✅ 4. Get mentor by ID (used in MentorProfile)
# @mentors_bp.route('/<mentor_id>', methods=['GET', 'OPTIONS'])
# def get_mentor(mentor_id):
#     try:
#         result = supabase.table('mentor_profile').select(
#             "*, users:user_id(name, bio, email, profile_pic_url, linkedin_url)"
#         ).eq('user_id', mentor_id).execute()

#         if not result.data:
#             return jsonify({'error': 'Mentor not found'}), 404

#         mentor = result.data[0]

#         # Average rating
#         reviews = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
#         if reviews.data:
#             avg_rating = sum(r['rating'] for r in reviews.data) / len(reviews.data)
#             mentor['average_rating'] = round(avg_rating, 2)
#         else:
#             mentor['average_rating'] = 0.0

#         return jsonify(mentor), 200
#     except Exception as e:
#         print("Error in get_mentor:", e)
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


@mentors_bp.route('/search', methods=['GET', 'OPTIONS'])
def search_mentors():
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    try:
        expertise = request.args.get('expertise')

        # ✅ 1. If no expertise provided, return ALL mentors
        if not expertise or expertise.strip() == "":
            response = supabase.table('mentor_profile').select('*, users:user_id(*)').execute()
            mentors = response.data or []
        else:
            # ✅ 2. Otherwise, filter mentors by expertise (text or array)
            try:
                response = (
                    supabase.table('mentor_profile')
                    .select('*, users:user_id(*)')
                    .ilike('expertise', f'%{expertise}%')
                    .execute()
                )
                mentors = response.data or []
            except Exception:
                response = supabase.table('mentor_profile').select('*, users:user_id(*)').execute()
                mentors = [
                    m
                    for m in response.data
                    if any(expertise.lower() in e.lower() for e in m.get('expertise', []))
                ]

        # ✅ 3. Compute average rating for each mentor
        for m in mentors:
            reviews = supabase.table('reviews').select('rating').eq('mentor_id', m['user_id']).execute()
            if reviews.data:
                m['average_rating'] = round(
                    sum(r['rating'] for r in reviews.data) / len(reviews.data), 2
                )
            else:
                m['average_rating'] = 0

        if not mentors:
            return jsonify({'message': 'No mentors found'}), 404

        return jsonify(mentors), 200

    except Exception as e:
        print("Error in search_mentors:", e)
        return jsonify({'error': str(e)}), 500



# ✅ 2. Get current mentor profile
@mentors_bp.route('/profile', methods=['GET', 'OPTIONS'])
@token_required
def get_mentor_profile():
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    user_id = request.user_id
    result = supabase.table('mentor_profile').select('*').eq('user_id', user_id).execute()

    if not result.data:
        return jsonify({'error': 'Mentor profile not found'}), 404

    return jsonify(result.data[0]), 200


# ✅ 3. Update mentor profile (authenticated PUT)
@mentors_bp.route('/profile', methods=['PUT', 'OPTIONS'])
@token_required
def update_own_mentor_profile():
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    user_id = request.user_id
    data = request.get_json()
    allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    # Convert string expertise → array
    if isinstance(update_data.get('expertise'), str):
        update_data['expertise'] = [e.strip() for e in update_data['expertise'].split(',') if e.strip()]

    try:
        supabase.table('mentor_profile').update(update_data).eq('user_id', user_id).execute()
        return jsonify({'message': 'Mentor profile updated successfully'}), 200
    except Exception as e:
        print("Error updating mentor profile:", e)
        return jsonify({'error': str(e)}), 500


# ✅ 4. Admin or system update (used in ProfilePage.tsx)
@mentors_bp.route('/<mentor_id>', methods=['PUT', 'OPTIONS'])
@token_required
def update_mentor_by_id(mentor_id):
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    data = request.get_json()
    allowed_fields = ['expertise', 'hourly_rate', 'availability', 'years_of_experience', 'company']
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    if isinstance(update_data.get('expertise'), str):
        update_data['expertise'] = [e.strip() for e in update_data['expertise'].split(',') if e.strip()]

    try:
        result = supabase.table('mentor_profile').update(update_data).eq('user_id', mentor_id).execute()

        if result.data == []:
            # If no profile exists yet → create new one
            update_data['user_id'] = mentor_id
            supabase.table('mentor_profile').insert(update_data).execute()

        return jsonify({'message': 'Mentor profile updated successfully'}), 200
    except Exception as e:
        print("Error updating mentor by ID:", e)
        return jsonify({'error': str(e)}), 500


# ✅ 5. Get mentor by ID (for MentorProfile page)
@mentors_bp.route('/<mentor_id>', methods=['GET', 'OPTIONS'])
def get_mentor(mentor_id):
    if request.method == "OPTIONS":
        return jsonify({'message': 'CORS preflight OK'}), 200

    try:
        result = supabase.table('mentor_profile').select('*, users:user_id(*)').eq('user_id', mentor_id).execute()

        if not result.data:
            return jsonify({'error': 'Mentor not found'}), 404

        mentor = result.data[0]

        # Compute average rating
        reviews = supabase.table('reviews').select('rating').eq('mentor_id', mentor_id).execute()
        if reviews.data:
            mentor['average_rating'] = round(sum(r['rating'] for r in reviews.data) / len(reviews.data), 2)
        else:
            mentor['average_rating'] = 0

        return jsonify(mentor), 200
    except Exception as e:
        print("Error getting mentor:", e)
        return jsonify({'error': str(e)}), 500
