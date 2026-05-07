from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, User

task_bp = Blueprint('task', __name__)


# @task_bp.route('/tasks/all', methods=['GET'])
# @jwt_required()
# def get_all_tasks():
#     try:
#         current_user_id = get_jwt_identity()
#         user = User.query.get(int(current_user_id))
        
#         if not user:
#             return jsonify({"message": "User not found"}), 404
        
#         if user.role == 'admin':
#             tasks = Task.query.all()
#         else:
#             tasks = Task.query.filter_by(assigned_to=user.id).all()
        
#         return jsonify([task.to_dict() for task in tasks]), 200
        
#     except Exception as e:
#         print(f"Error fetching tasks: {str(e)}")
#         return jsonify({"error": str(e)}), 500
@task_bp.route('/tasks/all', methods=['GET'])
@jwt_required()
def get_all_tasks():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        print(f"🔍 User {user.name} (role: {user.role}, id: {user.id}) requesting tasks")
        
        # Admins see ALL tasks
        if user.role == 'admin':
            tasks = Task.query.all()
            print(f"✅ Admin - returning {len(tasks)} tasks")
        else:
            # Members see ONLY tasks assigned to them
            tasks = Task.query.filter_by(assigned_to=user.id).all()
            print(f"✅ Member - returning {len(tasks)} assigned tasks")
            
            # If no tasks assigned, also check if any exist at all
            if len(tasks) == 0:
                all_tasks_count = Task.query.count()
                print(f"⚠️ Member has 0 tasks, but there are {all_tasks_count} total tasks in database")
        
        result = [task.to_dict() for task in tasks]
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Error fetching tasks: {str(e)}")
        return jsonify({"error": str(e)}), 500

@task_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({"message": "Task title is required"}), 400
        
        task = Task(
            title=data['title'],
            description=data.get('description', ''),
            project_id=data.get('project_id'),
            assigned_to=data.get('assigned_to'),
            status=data.get('status', 'todo')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating task: {str(e)}")
        return jsonify({"error": str(e)}), 500


@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({"message": "Task not found"}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'status' in data:
            task.status = data['status']
        if 'assigned_to' in data:
            task.assigned_to = data['assigned_to']
        if 'project_id' in data:
            task.project_id = data['project_id']
        
        db.session.commit()
        
        return jsonify(task.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating task: {str(e)}")
        return jsonify({"error": str(e)}), 500


@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({"message": "Task not found"}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({"message": "Task deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting task: {str(e)}")
        return jsonify({"error": str(e)}), 500