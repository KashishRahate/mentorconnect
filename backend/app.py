# from flask import Flask, jsonify
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from config import config
# import os

# def create_app(config_name=None):
#     if config_name is None:
#         config_name = os.getenv('FLASK_ENV', 'development')
    
#     app = Flask(__name__)
#     app.config.from_object(config[config_name])
    
#     # Initialize extensions
#     CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

#     jwt = JWTManager(app)
    
#     # Register blueprints
#     from routes.auth import auth_bp
#     from routes.users import users_bp
#     from routes.mentors import mentors_bp
#     from routes.bookings import bookings_bp
#     from routes.sessions import sessions_bp
#     from routes.reviews import reviews_bp
#     from routes.admin import admin_bp
    
#     app.register_blueprint(auth_bp, url_prefix='/api/auth')
#     app.register_blueprint(users_bp, url_prefix='/api/users')
#     app.register_blueprint(mentors_bp, url_prefix='/api/mentors')
#     app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
#     app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
#     app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
#     app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
#     # Health check
#     @app.route('/api/health', methods=['GET'])
#     def health():
#         return jsonify({'status': 'healthy'}), 200
    
#     # Error handlers
#     @app.errorhandler(404)
#     def not_found(error):
#         return jsonify({'error': 'Not found'}), 404
    
#     @app.errorhandler(500)
#     def internal_error(error):
#         return jsonify({'error': 'Internal server error'}), 500
    
#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
import os

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # ✅ Enable CORS for all HTTP methods and headers
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    jwt = JWTManager(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.mentors import mentors_bp
    from routes.bookings import bookings_bp
    from routes.sessions import sessions_bp
    from routes.reviews import reviews_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(mentors_bp, url_prefix='/api/mentors')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Health check
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'healthy'}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
