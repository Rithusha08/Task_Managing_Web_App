# # # 
# # from flask import Blueprint, request, jsonify
# # from models import db, Project
# # from utils.auth_middleware import admin_required

# # project_bp = Blueprint("project", __name__)

# # # CREATE PROJECT
# # @project_bp.route("/projects", methods=["POST"])
# # @admin_required
# # # @project_bp.route("/projects", methods=["POST"])
# # def create_project():
# #     try:
# #         data = request.json
# #         print("DATA RECEIVED:", data)

# #         project = Project(
# #             name=data.get("name"),
# #             description=data.get("description", ""),
# #             created_by=data.get("created_by", 1)
# #         )

# #         db.session.add(project)
# #         db.session.commit()

# #         return jsonify({"message": "Project created"})
    
# #     except Exception as e:
# #         print("ERROR:", str(e))
# #         return jsonify({"error": str(e)}), 500

# # # GET ALL PROJECTS
# # @project_bp.route("/projects", methods=["GET"])
# # def get_projects():
# #     projects = Project.query.all()

# #     result = []
# #     for p in projects:
# #         result.append({
# #             "id": p.id,
# #             "name": p.name,
# #             "description": p.description,
# #             "created_by": p.created_by
# #         })

# #     return jsonify(result)
# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from models import db, Project

# project_bp = Blueprint('project', __name__)

# # @project_bp.route('/projects', methods=['GET'])  # Exact match for frontend
# # @jwt_required()
# # def get_projects():
# #     try:
# #         current_user_id = get_jwt_identity()
# #         projects = Project.query.filter_by(created_by=current_user_id).all()
# #         return jsonify([project.to_dict() for project in projects]), 200
# #     except Exception as e:
# #         print(f"Error: {str(e)}")
# #         return jsonify({"error": str(e)}), 500
# @project_bp.route('/', methods=['GET'])
# @jwt_required()
# def get_projects():
#     try:
#         current_user_id = get_jwt_identity()
#         user = user.query.get(int(current_user_id))
        
#         if not user:
#             return jsonify({"message": "User not found"}), 404
        
#         # EVERYONE can see all projects (admin and member)
#         projects = Project.query.all()
        
#         return jsonify([project.to_dict() for project in projects]), 200
        
#     except Exception as e:
#         print(f"Error fetching projects: {str(e)}")
#         return jsonify({"error": str(e)}), 500
# @project_bp.route('/projects', methods=['POST'])
# @jwt_required()
# def create_project():
#     try:
#         data = request.get_json()
#         current_user_id = get_jwt_identity()
        
#         if not data or not data.get('name'):
#             return jsonify({"error": "Project name is required"}), 400
        
#         project = Project(
#             name=data['name'],
#             description=data.get('description', ''),
#             created_by=current_user_id
#         )
        
#         db.session.add(project)
#         db.session.commit()
        
#         return jsonify(project.to_dict()), 201
#     except Exception as e:
#         db.session.rollback()
#         print(f"Error: {str(e)}")
#         return jsonify({"error": str(e)}), 500
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User

project_bp = Blueprint('project', __name__)

@project_bp.route('/projects', methods=['GET'])
# @project_bp.route('', methods=['GET'])
@jwt_required()
def get_projects():
    try:
        projects = Project.query.all()
        return jsonify([project.to_dict() for project in projects]), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@project_bp.route('/projects', methods=['POST'])
# @project_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user or user.role != 'admin':
            return jsonify({"error": "Only admins can create projects"}), 403
        
        if not data or not data.get('name'):
            return jsonify({"error": "Project name is required"}), 400
        
        project = Project(
            name=data['name'],
            description=data.get('description', ''),
            created_by=current_user_id
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user or user.role != 'admin':
            return jsonify({"error": "Only admins can delete projects"}), 403
        
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({"message": "Project deleted"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500