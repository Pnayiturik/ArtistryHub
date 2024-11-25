import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaGithub,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

// Move LoginBackground outside of the Login component
const LoginBackground = ({ isLogin, setIsLogin }) => (
  <motion.div
    className="hidden md:flex w-1/2 p-8 flex-col justify-center items-center text-white bg-red-600"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    <img
      src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-125.jpg?semt=ais_hybrid"
      alt="Login Illustration"
      className="rounded-full"
    />
    <h1 className="text-4xl font-bold mb-4 text-center">
      {isLogin ? "Welcome Back!" : "Join Us!"}
    </h1>
    <p className="text-lg text-center mb-6">
      {isLogin
        ? "Login to access your account and explore more!"
        : "Sign up to create a new account and start your journey!"}
    </p>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsLogin(!isLogin)}
      className="mt-6 px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-red-500 transition"
    >
      {isLogin ? "Go to Signup" : "Go to Login"}
    </motion.button>
  </motion.div>
);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          const response = await api.post('/api/token/', {
            username: formData.email,
            password: formData.password
          });
          
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          
          try {
            const userResponse = await api.get('/api/users/me/');
            if (userResponse.data.is_artist) {
              navigate('/artist/dashboard');
            } else {
              navigate('/admin/events');
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
            setErrors(prev => ({
              ...prev,
              submit: 'Error fetching user data'
            }));
          }
        } else {
          await api.post('/api/users/', {
            username: formData.email,
            email: formData.email,
            password: formData.password,
            name: formData.fullName
          });
          
          alert('Registration successful! Please login.');
          setIsLogin(true);
        }
      } catch (error) {
        console.error('Auth error:', error.response?.data);
        const errorMessage = error.response?.data?.detail || 
                           'Incorrect username or password.';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const socialLoginButtons = [
    {
      icon: FaGoogle,
      color: "text-red-600",
      name: "Google",
    },
    {
      icon: FaFacebook,
      color: "text-red-700",
      name: "Facebook",
    },
    {
      icon: FaGithub,
      color: "text-gray-800",
      name: "GitHub",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-purple-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {!isMobile && <LoginBackground isLogin={isLogin} setIsLogin={setIsLogin} />}

        <div className="w-full md:w-1/2 p-8 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-red-600 transition"
          >
            <FaArrowLeft className="mr-2" /> Back
          </motion.button>

          <h2 className="text-3xl font-bold text-center mt-20 mb-6 text-gray-800">
            {isLogin ? "Login to your account !" : "Create an account !"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 p-3 border rounded-lg focus:ring-2 transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 p-3 border rounded-lg focus:ring-2 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-red-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 p-3 border rounded-lg focus:ring-2 transition ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`w-full py-3 rounded-lg text-white transition-transform transform ${
                isLogin
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLogin ? "Login" : "Signup"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              If you forget your password click{" "}
              <a href="/forget" className="text-red-500">
                here !{" "}
              </a>
            </p>
          </div>

          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLogin(!isLogin)}
              className="mt-6 w-full px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
            >
              {isLogin ? "Go to Signup" : "Go to Login"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
