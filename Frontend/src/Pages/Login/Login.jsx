import React, { useState, useContext } from 'react';
import bgimage from '../../Images/Image1.jpeg';
import Gicon from '../../Images/Google-icon.png';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import AuthContext from '../../Context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); 
    try {
      const response = await axios.post('/users/get', { username, password });
      
      const { token, user } = response.data;

      // Call login function to save user and token
      login(token, user);

      // Show success notification
      toast.success('Login successful!');

      // Check if the user is admin and navigate accordingly
      if (user.isAdmin) {
        navigate('/ADashboard');  // Admin Dashboard
      } else {
        navigate('/Mdashboard');  // Member Dashboard
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      toast.error(error.response?.data?.message || 'Login failed');  // Show error notification
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-200 py-20">
      <div className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-1 bg-red-400 items-center justify-center relative">
          <div className="absolute px-6">
            <h1 className="text-4xl text-white font-bold drop-shadow-lg stroke-white">Turn Your ideas <br/> into reality</h1>
            <p className="text-white mt-2 text-lg font-medium">Start for free and get attractive offers from the community</p>
          </div>
          <img src={bgimage} alt="background" className="w-full h-full object-cover opacity-70" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center bg-white p-8">
          <div className="w-full max-w-md space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Login</h3>
            <p className="text-gray-600">Welcome Back! Please Enter Your Details.</p>

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="User_Name"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-black transition-all"
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-b border-gray-500 focus:outline-none focus:border-black transition-all"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  Remember Me for 30 days
                </label>
                <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">Forgot Password?</Link>
              </div>

              {error && <span className="text-red-500 text-sm">{error}</span>} 

              <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-all">
                Log in
              </button>
              
              <div className="text-center mt-4">or</div>
              
              <button className="w-full flex items-center justify-center border border-black py-2 rounded-lg hover:bg-gray-100 transition-all">
                <img src={Gicon} alt="Google Icon" className="w-6 h-6 mr-2" />
                Sign In with Google
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-black">Don't have an account? <Link to="/Register" className="text-blue-500 hover:underline">Signup</Link></p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
