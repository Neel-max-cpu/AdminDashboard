import { useState, useEffect } from 'react';

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        alert('User role updated successfully');
        fetchUsers();
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between py-2">
                    <span>{user.username}</span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="ml-4 px-2 py-1 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;