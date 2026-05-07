import os
import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required, 
    get_jwt_identity
)
from models import db, User
from extensions import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user."""
    try:
        data = request.get_json()

        # Validate fields
        if not data or not all(k in data for k in ["name", "email", "password"]):
            return jsonify({"message": "name, email, and password are required"}), 400

        name = data["name"].strip()
        email = data["email"].strip().lower()
        password = data["password"]
        role = data.get("role", "member")

        if len(name) < 2:
            return jsonify({"message": "Name must be at least 2 characters"}), 400
        if "@" not in email or "." not in email:
            return jsonify({"message": "Invalid email address"}), 400
        if len(password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400
        if role not in ("admin", "member"):
            role = "member"

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "An account with this email already exists"}), 409

        hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
        user = User(name=name, email=email, password=hashed_pw, role=role)

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "Account created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate and return JWT tokens."""
    try:
        data = request.get_json()

        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"message": "Email and password are required"}), 400

        email = data["email"].strip().lower()
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"message": "Invalid email or password"}), 401

        if not bcrypt.check_password_hash(user.password, data["password"]):
            return jsonify({"message": "Invalid email or password"}), 401

        # Use Flask-JWT-Extended to create tokens
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role,
                "name": user.name,
                "email": user.email
            }
        )
        
        refresh_token = create_refresh_token(
            identity=str(user.id)
        )

        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "role": user.role,
            "user_id": user.id,
            "name": user.name,
            "email": user.email
        }), 200

    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Requires refresh token
def refresh():
    """Refresh access token."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({"message": "User not found"}), 404
            
        new_access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role,
                "name": user.name,
                "email": user.email
            }
        )
        
        return jsonify({
            "access_token": new_access_token,
            "token_type": "bearer"
        }), 200
        
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@auth_bp.route("/me", methods=["GET"])
@jwt_required()  # Requires valid access token
def me():
    """Get current user info."""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({"message": "User not found"}), 404
            
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500


@auth_bp.route("/users", methods=["GET"])
@jwt_required()  # Requires valid access token
def get_users():
    """List all users (for task assignment dropdowns)."""
    try:
        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200
        
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500