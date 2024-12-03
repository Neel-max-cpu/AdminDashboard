import { useState, useEffect } from 'react';

function UserDashboard({ onLogout }) {
  const [info, setInfo] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/info', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setInfo(data.info);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ info }),
      });
      if (response.ok) {
        alert('Info updated successfully');
      } else {
        alert('Failed to update info');
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
              <h1 className="text-2xl font-semibold">User Dashboard</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Your Info</label>
                  <input
                    type="text"
                    className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                    placeholder="Enter your info"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                  />
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    onClick={handleUpdateInfo}
                  >
                    Update Info
                  </button>
                </div>
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

export default UserDashboard;