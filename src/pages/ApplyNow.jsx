import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplyNow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    cnic: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'Male',
    program: 'ICS',
    address: '',
    sscMarks: '',
    sscTotal: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="bg-teal-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold">GDC Tank - Admission Portal</span>
          </div>
          <div className="space-x-3">
            <button 
              onClick={() => navigate('/')} 
              className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-white text-teal-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Content / Form Section */}
      <main className="max-w-3xl mx-auto w-full px-4 py-10 my-auto">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-teal-800 mb-6 text-center">Online Admission Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                <input 
                  type="text" 
                  name="fatherName" 
                  value={formData.fatherName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNIC / B-Form</label>
                <input 
                  type="text" 
                  name="cnic" 
                  value={formData.cnic} 
                  onChange={handleChange} 
                  required 
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  placeholder="03XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Program</label>
                <select 
                  name="program" 
                  value={formData.program} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="F.Sc Pre-Medical">F.Sc Pre-Medical</option>
                  <option value="F.Sc Pre-Engineering">F.Sc Pre-Engineering</option>
                  <option value="ICS">ICS</option>
                  <option value="FA">FA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea 
                name="address" 
                rows="3" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              ></textarea>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium transition"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-2 rounded-md font-medium transition shadow-md"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Government Degree College Tank. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ApplyNow;
