import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgimage from '../../Images/registerimage.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    address: '',
    email: '',
    phoneNo: '',
    gender: 'male',  // default selected gender
    age: '',
    weight: '',
    height: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
  
    const { confirmPassword, ...dataToSend } = formData;
  
    try {
      setLoading(true);
      await axios.post('/users/add', dataToSend);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 409) {
        // Username already exists
        toast.error('Username is already taken. Please choose a different username.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 py-12">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="w-1/2 hidden md:flex">
          <img src={bgimage} alt='' className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h3 className="text-2xl font-semibold mb-4">Register</h3>
          <p className="mb-6 text-gray-600">Welcome Back! Please Enter Your Details.</p>
          <form onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label>First Name</label>
                <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
              <div className="flex flex-col">
                <label>Last Name</label>
                <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <label>Username</label>
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} className="border-b py-2 outline-none" />
            </div>
            <div className="flex flex-col mt-4">
              <label>Address</label>
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="border-b py-2 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label>Email</label>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
              <div className="flex flex-col">
                <label>Phone No</label>
                <input type="tel" name="phoneNo" placeholder="Phone No" value={formData.phoneNo} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label>Gender</label>
                <div className="flex items-center mt-2">
                  <input type="radio" id="male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} className="mr-2" />
                  <label htmlFor="male" className="mr-4">Male</label>
                  <input type="radio" id="female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} className="mr-2" />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
              <div className="flex flex-col">
                <label>Age</label>
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label>Weight</label>
                <input type="number" name="weight" placeholder="Weight" value={formData.weight} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
              <div className="flex flex-col">
                <label>Height</label>
                <input type="number" name="height" placeholder="Height" value={formData.height} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label>Password</label>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
              <div className="flex flex-col">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className="border-b py-2 outline-none" />
              </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 mt-6 rounded-lg w-full">{loading ? 'Registering...' : 'Register'}</button>
          </form>
          <p className="text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-blue-500">Sign In</Link></p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
