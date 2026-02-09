import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainbg from '../assets/mainbg.png';

const Login = () => {
  const [netID, setNetID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      // ✅ CRITICAL FIX
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('✅ Login successful:', data);

      navigate('/welcome');
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${mainbg})` }}
    >
      <div className="flex flex-col items-center -mt-10 w-full max-w-md px-6">
        <h1 className="text-5xl mb-10 text-[#395EAA] font-['Lexend_Exa'] font-normal">
          Login
        </h1>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <form
          className="w-full flex flex-col gap-4 text-md"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="SRM NetID (Email)"
            value={netID}
            onChange={(e) => setNetID(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A6CB3] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#395EAA] hover:underline font-semibold cursor-pointer"
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