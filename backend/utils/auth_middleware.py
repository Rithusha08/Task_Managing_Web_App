# import jwt
# import os
# from functools import wraps
# from flask import request, jsonify

# SECRET = os.getenv("SECRET_KEY", "secretkey-change-in-production")


# def get_current_user():
#     """Decode JWT from Authorization header. Returns payload dict or None."""
#     token = request.headers.get("Authorization", "").strip()
#     if not token:
#         return None
#     try:
#         # Support "Bearer <token>" and raw token
#         if token.lower().startswith("bearer "):
#             token = token[7:]
#         return jwt.decode(token, SECRET, algorithms=["HS256"])
#     except jwt.ExpiredSignatureError:
#         return None
#     except jwt.InvalidTokenError:
#         return None


# def login_required(f):
#     """Require any authenticated user."""
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         payload = get_current_user()
#         if not payload:
#             return jsonify({"message": "Authentication required"}), 401
#         request.current_user = payload
#         return f(*args, **kwargs)
#     return decorated


# def admin_required(f):
#     """Require admin role."""
# @wraps(f)
# def decorated(*args, **kwargs):
#         payload = get_current_user()
#         if not payload:
#             return jsonify({"message": "Authentication required"}), 401
#         if payload.get("role") != "admin":
#             return jsonify({"message": "Admin access required"}), 403
#         request.current_user = payload
#         return f(*args, **kwargs)
#     return decorated
import jwt
import os
from functools import wraps
from flask import request, jsonify

SECRET = os.getenv("SECRET_KEY", "secretkey-change-in-production")


def get_current_user():
    """Decode JWT from Authorization header. Returns payload dict or None."""
    auth_header = request.headers.get("Authorization", "").strip()

    if not auth_header:
        return None

    try:
        # Support "Bearer <token>" and raw token
        if auth_header.lower().startswith("bearer "):
            token = auth_header[7:]
        else:
            token = auth_header

        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload

    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None


def login_required(f):
    """Require any authenticated user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload = get_current_user()

        if not payload:
            return jsonify({"message": "Authentication required"}), 401

        request.current_user = payload
        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    """Require admin role."""
    @wraps(f)
    def decorated(*args, **kwargs):
        payload = get_current_user()

        if not payload:
            return jsonify({"message": "Authentication required"}), 401

        if payload.get("role") != "admin":
            return jsonify({"message": "Admin access required"}), 403

        request.current_user = payload
        return f(*args, **kwargs)

    return decorated