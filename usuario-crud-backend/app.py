from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Configurar CORS para permitir todas las rutas y métodos
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'age': self.age
        }

# Rutas CRUD

@app.route('/users', methods=['GET', 'POST', 'OPTIONS'])
def users():
    if request.method == 'OPTIONS':
        # Manejar la solicitud preflight OPTIONS
        return '', 204
    elif request.method == 'GET':
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    elif request.method == 'POST':
        data = request.json
        new_user = User(email=data['email'], name=data['name'], age=data['age'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201

@app.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
def user(user_id):
    if request.method == 'OPTIONS':
        # Manejar la solicitud preflight OPTIONS
        return '', 204
    
    user = User.query.get_or_404(user_id)
    
    if request.method == 'GET':
        return jsonify(user.to_dict())
    elif request.method == 'PUT':
        data = request.json
        user.email = data.get('email', user.email)
        user.name = data.get('name', user.name)
        user.age = data.get('age', user.age)
        db.session.commit()
        return jsonify(user.to_dict())
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return '', 204

@app.route('/users/search', methods=['GET', 'OPTIONS'])
def search_users():
    if request.method == 'OPTIONS':
        # Manejar la solicitud preflight OPTIONS
        return '', 204
    
    query = request.args.get('q')
    users = User.query.filter(User.name.ilike(f'%{query}%')).all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)