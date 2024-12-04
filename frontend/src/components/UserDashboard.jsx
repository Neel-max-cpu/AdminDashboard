import { useState, useEffect } from 'react';
import { CardWithForm } from './CardWithForm';
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

function UserDashboard({ onLogout }) {

    // update gmail, phone number, address, country, status(active/inactive)
    const [info, setInfo] = useState('');
    const [gmail, setGmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');
    const [username, setUsername] = useState('');


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
            setGmail(data.gmail);
            setPhone(data.phone);
            setAddress(data.address);
            setCountry(data.country);
            setStatus(data.status);
            setRole(data.role);
            setUsername(data.username);
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
                body: JSON.stringify({
                    info,
                    gmail,
                    phone,
                    address,
                    country,
                    status,
                }),
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
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center items-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl md:w-1/2 sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">{username}'s Dashboard</h1>
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
                                <div className="flex flex-col">
                                    <label className="leading-loose">Gmail</label>
                                    {role === 'sde' ? (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                            placeholder="Enter your new Gmail"
                                            value={gmail}
                                            onChange={(e) => setGmail(e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 bg-gray-100 cursor-not-allowed"
                                            placeholder={`Updating Gmail is restricted for ${role}`}
                                            value={gmail}
                                            disabled
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Phone Number</label>
                                    <input
                                        type="text"
                                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                        placeholder="Enter your new Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Address</label>
                                    {role === 'user' ? (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600  bg-gray-100 cursor-not-allowed"
                                            placeholder={`Updating Address is restricted for ${role}`}
                                            value={address}
                                            disabled                                            
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                            placeholder="Enter your new Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    )}

                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Country</label>
                                    {role === 'user' ? (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600  bg-gray-100 cursor-not-allowed"
                                            placeholder={`Updating Country is restricted for ${role}`}
                                            value={country}
                                            disabled
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                                            placeholder="Enter your Country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    )}

                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Current Role:</label>
                                    <span><strong>{role.toUpperCase()}</strong></span>
                                </div>
                                <div className="flex flex-col">
                                    <label className="leading-loose">Status</label>
                                    <RadioGroup value={status ? 'active' : 'inactive'} onValueChange={value => setStatus(value === 'active')}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="active" id="active" />
                                            <Label htmlFor="active">Active</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="inactive" id="inactive" />
                                            <Label htmlFor="inactive">Inactive</Label>
                                        </div>
                                    </RadioGroup>

                                </div>
                                <div className="pt-4 flex items-center space-x-4">
                                    <button
                                        className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                                        onClick={handleUpdateInfo}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='mx-4 my-5 justify-center flex'>
                <CardWithForm/>
            </div> */}

            <div className='flex justify-center '>
                <button
                    onClick={onLogout}
                    className="mt-8 bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500  focus:ring-opacity-50"
                >Logout
                </button>
            </div>


        </div>
    );
}

export default UserDashboard;

