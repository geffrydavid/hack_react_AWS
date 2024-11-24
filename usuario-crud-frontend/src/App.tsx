import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  age: number;
}

const API_BASE_URL = 'http://127.0.0.1:5000';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ email: '', name: '', age: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_BASE_URL}/users/${editingUser.id}`, editingUser);
        setEditingUser(null);
      } else {
        await axios.post(`${API_BASE_URL}/users`, newUser);
        setNewUser({ email: '', name: '', age: '' });
      }
      fetchUsers();
    } catch (error) {
      console.error('Error adding/updating user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/search?q=${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="email"
          name="email"
          value={editingUser ? editingUser.email : newUser.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mr-2 p-2 border"
          required
        />
        <input
          type="text"
          name="name"
          value={editingUser ? editingUser.name : newUser.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="mr-2 p-2 border"
          required
        />
        <input
          type="number"
          name="age"
          value={editingUser ? editingUser.age : newUser.age}
          onChange={handleInputChange}
          placeholder="Age"
          className="mr-2 p-2 border"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          {editingUser ? 'Update User' : 'Add User'}
        </button>
        {editingUser && (
          <button type="button" onClick={cancelEdit} className="p-2 ml-2 bg-gray-500 text-white">
            Cancel
          </button>
        )}
      </form>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users"
          className="mr-2 p-2 border"
        />
        <button onClick={handleSearch} className="p-2 bg-green-500 text-white">Search</button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name.length > 10 ? `${user.name.substring(0, 10)}...` : user.name}</td>
              <td>{user.age}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="p-2 mr-2 bg-yellow-500 text-white">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="p-2 bg-red-500 text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4">Total users: {users.length}</p>
    </div>
  );
};

export default App;