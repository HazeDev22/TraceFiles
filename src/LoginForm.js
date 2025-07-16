import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './asssets/logo.png';

export default function LoginForm({ onSignup, onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo: accept any non-empty username/password
    if (form.username && form.password) {
      setError('');
      onLogin && onLogin();
    } else {
      setError('Please enter username and password.');
    }
  };

  return (
    <div className="relative max-w-md w-full mx-auto bg-[#18122B] rounded-xl shadow-lg p-8 border border-[#2a213a] text-[#f3f3f7]">
      <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="Doctracer Logo" className="w-20 h-20 mb-2" />
        <h2 className="text-2xl font-bold text-white">Login to Doctracer</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 pl-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
            autoComplete="username"
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 pl-10 pr-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#bdbdd7] hover:text-purple-400 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md font-bold bg-purple-400 text-white hover:bg-purple-600 transition-colors shadow-md"
        >
          Login
        </button>
      </form>
      <div className="mt-6 text-center">
        <span className="text-[#bdbdd7]">Don't have an account?</span>
        <button
          className="ml-2 text-purple-400 font-bold hover:underline focus:outline-none"
          onClick={onSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
} 