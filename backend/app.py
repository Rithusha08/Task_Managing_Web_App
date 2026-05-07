import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from models import db
from extensions import bcrypt
from routes.auth_routes import auth_bp
from routes.project_routes import project_bp
from routes.task_routes import task_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # ── Configuration ────────────────────────────────────────────
    db_url = os.getenv("DATABASE_URL", "sqlite:///taskflow.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-me")
    
    # ── JWT Configuration ──────────────────────────────────────
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-me")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 hours
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 2592000  # 30 days

    # Enable SSL only for MySQL/PostgreSQL (not SQLite)
    if "mysql" in db_url or "postgresql" in db_url:
        app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
            "connect_args": {"ssl": {"ssl": {}}},
            "pool_pre_ping": True,
            "pool_recycle": 300,
        }

    # ── CORS Configuration ──────────────────────────────────────
    # CORS(app, 
    #      origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    #      supports_credentials=True,
    #      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    #      allow_headers=["Content-Type", "Authorization"])
    # In create_app(), change CORS to:
    # CORS(app, 
    #     origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    #     supports_credentials=True,
    #     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    #     allow_headers=["Content-Type", "Authorization"])
    CORS(app, 
     origins=["https://task-managing-web-4647tx837-rithusha08s-projects.vercel.app", "http://localhost:3000"],
     supports_credentials=True)

    # ── Handle OPTIONS preflight requests ───────────────────────
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS,PATCH'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response

    # ── Extensions ───────────────────────────────────────────────
    db.init_app(app)
    bcrypt.init_app(app)
    
    # Initialize JWT
    jwt = JWTManager(app)

    # ── Blueprints ───────────────────────────────────────────────
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(project_bp)
    app.register_blueprint(task_bp)

    # ── Debug: List all routes ──────────────────────────────────
    @app.route('/routes', methods=['GET'])
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(str(rule))
        return jsonify({"routes": routes})
    
    # ── Health check ─────────────────────────────────────────────
    @app.route("/health")
    def health():
        return {"status": "ok", "db": db_url.split("://")[0]}

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("✅ Database tables ready")
    app.run(debug=True, port=5000)