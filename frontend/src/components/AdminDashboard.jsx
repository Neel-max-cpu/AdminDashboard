import { useState, useEffect } from 'react';

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalSignups: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchDashboardStats();
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

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setDashboardStats(data);
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

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus}),
      });
      if (response.ok) {
        alert('User status updated successfully');
        fetchUsers();
        fetchDashboardStats();
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          alert('User deleted successfully');
          fetchUsers();
          fetchDashboardStats();
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-3xl font-bold">{dashboardStats.totalUsers}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Active Users</h3>
                <p className="text-3xl font-bold">{dashboardStats.activeUsers}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Inactive Users</h3>
                <p className="text-3xl font-bold">{dashboardStats.inactiveUsers}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Total Signups</h3>
                <p className="text-3xl font-bold">{dashboardStats.totalSignups}</p>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="px-4 py-2">{user.username}</td>
                          <td className="px-4 py-2">{user.gmail}</td>
                          <td className="px-4 py-2">
                            {user.username === 'admin' ? (
                              <span>Admin</span>
                            ) : (
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="ml-4 px-2 py-1 border rounded"
                              >
                                <option value="user">User</option>
                                <option value="intern">Intern</option>
                                <option value="sde">SDE</option>                                
                              </select>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={user.status ? 'active' : 'inactive'}
                              onChange={(e) => handleStatusChange(user._id, e.target.value === 'active')}
                              className="ml-4 px-2 py-1 border rounded"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            {user.username !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={onLogout}
          className="mt-8 bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;