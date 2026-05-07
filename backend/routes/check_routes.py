import sys
sys.path.insert(0, '.')

from flask import Flask
from models import db, User, Task
from app import create_app

app = create_app()

with app.app_context():
    users = User.query.all()
    tasks = Task.query.all()
    
    print("\n=== USERS ===")
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Role: {u.role}, Email: {u.email}")
    
    print("\n=== TASKS ===")
    for t in tasks:
        assigned_user = User.query.get(t.assigned_to) if t.assigned_to else None
        print(f"ID: {t.id}, Title: {t.title}, assigned_to: {t.assigned_to} ({assigned_user.name if assigned_user else 'Unassigned'}), Status: {t.status}")
    
    print("\n=== TASKS BY USER ===")
    for u in users:
        user_tasks = Task.query.filter_by(assigned_to=u.id).all()
        print(f"{u.name} ({u.role}): {len(user_tasks)} tasks - IDs: {[t.id for t in user_tasks]}")