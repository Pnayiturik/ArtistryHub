import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Forget = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Password reset request sent');
      // Add your actual reset logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-purple-100 px-4 py-8 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        <div className="w-full md:w-1/2 p-8 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/login')}
            className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-red-600 transition"
          >
            <FaArrowLeft className="mr-2" /> Back
          </motion.button>

          <h2 className="text-3xl font-bold text-center mt-20 mb-6 text-gray-800">
            Forgot your password?
          </h2>

          <p className="text-lg text-center mb-8 text-gray-600">
            Don't worry, we'll help you reset it. Enter your email below to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 p-3 border rounded-lg focus:ring-2 transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-transform transform"
            >
              Send Reset Link
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Remember your password? <a href='/login' className='text-red-500'>Back to Login</a></p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 p-8 flex-col justify-center items-center text-white bg-red-600">
          <motion.img
            src="https://media.giphy.com/media/l41lFZ9vH2orH5n4I/giphy.gif"
            alt="Password Reset Gif"
            className="w-full h-auto rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          />
          <h1 className="text-4xl font-bold mb-4 text-center">Need Help?</h1>
          <p className="text-lg text-center mb-6">
            If you are having trouble resetting your password, feel free to contact our support team.
          </p>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-100 to-purple-100 z-0"></div>
    </div>
  );
};

export default Forget;
