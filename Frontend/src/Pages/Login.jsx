import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import mainbg from '../assets/mainbg.png';

const Login = () => {
  const [netID, setNetID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const Backend =
      import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${Backend}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: netID,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Use AuthContext to manage login
      authLogin(data.token, data.user);

      if (import.meta.env.MODE === 'development') {
        console.log('Login successful');
      }

      navigate('/discover');
    } catch (err) {
      if (import.meta.env.MODE === 'development') {
        console.error('Login error:', err);
      }
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-3 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-10 text-[#395EAA] font-['Lexend_Exa'] font-normal">
          Login
        </h1>

        {error && (
          <div className="w-full mb-3 sm:mb-4 p-2.5 sm:p-3 md:p-4 bg-red-50/90 backdrop-blur-sm border border-red-300 text-red-700 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <span className="text-red-500 flex-shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form
          className="w-full flex flex-col gap-3 sm:gap-4 text-sm sm:text-base"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="SRM NetID (Email)"
            value={netID}
            onChange={(e) => setNetID(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gray-100/90 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-blue-300/60 focus:border-blue-400 focus:bg-white shadow-inner text-sm sm:text-base transition-all duration-200 border border-transparent"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gray-100/90 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-blue-300/60 focus:border-blue-400 focus:bg-white shadow-inner text-sm sm:text-base transition-all duration-200 border border-transparent"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm sm:text-base font-medium shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#395EAA] hover:underline font-semibold cursor-pointer transition-colors duration-200 hover:text-blue-700"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;