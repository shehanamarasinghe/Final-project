import React, { useState, useEffect } from 'react';

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    Firstname: '',
    Lastname: '',
    UserName: '',
    Address: '',
    Email: '',
    PhoneNo: '',
    Gender: '',
    Age: '',
    Weight: '',
    Height: '',
    ProfilePictureUrl: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the user's current data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/members/profile', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
        
        // If there's an existing profile picture URL, set the preview
        if (data.ProfilePictureUrl) {
          setPreviewImage(data.ProfilePictureUrl);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Could not load profile information');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    for (const key in profile) {
      // Exclude ProfilePictureUrl when sending data
      if (key !== 'ProfilePictureUrl') {
        formData.append(key, profile[key]);
      }
    }
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/members/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Profile Picture Upload Section */}
      <div className="flex flex-col items-center mb-6 space-y-4">
        {/* Profile Picture Preview with Gradient Border and Hover Effect */}
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden 
            bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 
            p-1 transition-all duration-300 
            group-hover:scale-105 group-hover:shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 
                  flex items-center justify-center text-gray-600 
                  group-hover:text-gray-800 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Camera Icon Overlay */}
          <label 
            htmlFor="profilePictureUpload" 
            className="absolute bottom-0 right-0 cursor-pointer 
            bg-white rounded-full p-2 shadow-lg 
            transform translate-x-1 translate-y-1 
            hover:bg-blue-50 transition-all duration-300 
            group-hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 hover:text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
        </div>

        {/* File Upload Input */}
        <input 
          id="profilePictureUpload"
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          className="hidden"
        />

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">
            Recommended: Square photo, max 5MB
          </p>
          <button 
            type="button" 
            onClick={() => document.getElementById('profilePictureUpload').click()}
            className="px-4 py-2 bg-gradient-to-r from-pink-700 to-red-600 
            text-white rounded-full text-sm 
            hover:from-red-600 hover:to-purple-700 
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Choose New Photo
          </button>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Firstname">
              First Name
            </label>
            <input
              id="Firstname"
              type="text"
              name="Firstname"
              value={profile.Firstname}
              onChange={handleInputChange}
              placeholder="Enter First Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Lastname">
              Last Name
            </label>
            <input
              id="Lastname"
              type="text"
              name="Lastname"
              value={profile.Lastname}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="UserName">
              Username
            </label>
            <input
              id="UserName"
              type="text"
              name="UserName"
              value={profile.UserName}
              onChange={handleInputChange}
              placeholder="Choose Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address">
              Address
            </label>
            <input
              id="Address"
              type="text"
              name="Address"
              value={profile.Address}
              onChange={handleInputChange}
              placeholder="Enter Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
              Email
            </label>
            <input
              id="Email"
              type="email"
              name="Email"
              value={profile.Email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="PhoneNo">
              Phone Number
            </label>
            <input
              id="PhoneNo"
              type="tel"
              name="PhoneNo"
              value={profile.PhoneNo}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Gender">
              Gender
            </label>
            <select
              id="Gender"
              name="Gender"
              value={profile.Gender}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Age">
              Age
            </label>
            <input
              id="Age"
              type="number"
              name="Age"
              value={profile.Age}
              onChange={handleInputChange}
              placeholder="Enter Age"
              min="0"
              max="120"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Weight">
              Weight (kg)
            </label>
            <input
              id="Weight"
              type="number"
              name="Weight"
              value={profile.Weight}
              onChange={handleInputChange}
              placeholder="Enter Weight"
              min="0"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Height">
              Height (cm)
            </label>
            <input
              id="Height"
              type="number"
              name="Height"
              value={profile.Height}
              onChange={handleInputChange}
              placeholder="Enter Height"
              min="0"
              step="0.1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-pink-700 to-red-600 text-white py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;