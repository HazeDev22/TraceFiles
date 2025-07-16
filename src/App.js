import { useState } from 'react';
import { FaBars, FaTimes, FaUpload } from "react-icons/fa";
import logo from './asssets/logo.png';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Folder from './Folder';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handler to close both forms
  const handleCloseForms = () => {
    setShowSignupForm(false);
    setShowLoginForm(false);
  };

  const handleLogin = () => {
    setLoggedIn(true);
    setShowLoginForm(false);
    setShowSignupForm(false);
    navigate('/folder');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
  };

  // Hide nav on folder route
  const hideNav = location.pathname === '/folder';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18122B] to-[#393053] text-[#f3f3f7] font-sans">
      {/* Sidebar overlay for mobile */}
      {!hideNav && (
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${sidebarOpen ? "block" : "hidden"
            }`}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar drawer */}
      {!hideNav && (
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#18122B] shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a213a]">
            <div className="flex items-center gap-2 text-2xl font-bold text-purple-400">
              <span className="text-[#f3f3f7]">Doctracer</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-[#bdbdd7] text-2xl focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-4 space-y-4">
            <a
              href="#features"
              className="text-[#bdbdd7] text-base hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </a>
            <a
              href="#features"
              className="text-[#bdbdd7] text-base hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Features
            </a>
            <a
              href="#blog"
              className="text-[#bdbdd7] text-base hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Blog
            </a>
            <a
              href="#faq"
              className="text-[#bdbdd7] text-base hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-[#bdbdd7] text-base hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              Contact Us
            </a>
            <button
              className="mt-4 px-4 py-2 rounded-md text-sm bg-[#22203a] text-[#f3f3f7] hover:bg-[#393053] hover:text-purple-400 transition-colors"
              onClick={() => {
                setSidebarOpen(false);
                setShowLoginForm(true);
                setShowSignupForm(false);
              }}
            >
              Sign In
            </button>
            <button
              className="mt-2 px-4 py-2 rounded-md text-sm font-bold bg-purple-400 text-[#18122B] hover:bg-purple-600 hover:text-white transition-colors"
              onClick={() => {
                setSidebarOpen(false);
                setShowSignupForm(true);
                setShowLoginForm(false);
              }}
            >
              Sign Up
            </button>
          </nav>
        </aside>
      )}
      {/* Top nav bar */}
      {!hideNav && (
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center py-4 md:py-6 px-4 md:px-12 bg-[#18122B]/95 border-b border-[#2a213a] relative">
          {/* Hamburger icon for mobile */}
          <button
            className="absolute left-4 top-5 md:hidden text-2xl text-[#bdbdd7] focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <div className="flex items-center gap-2 text-2xl font-bold text-purple-400 mx-auto md:mx-0">
            <span className="text-[#f3f3f7]">Doctracer</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:space-x-6">
            <a
              href="#"
              className="text-[#bdbdd7] text-base md:text-lg hover:text-purple-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-[#bdbdd7] text-base md:text-lg hover:text-purple-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#blog"
              className="text-[#bdbdd7] text-base md:text-lg hover:text-purple-400 transition-colors"
            >
              Blog
            </a>
            <a
              href="#faq"
              className="text-[#bdbdd7] text-base md:text-lg hover:text-purple-400 transition-colors"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-[#bdbdd7] text-base md:text-lg hover:text-purple-400 transition-colors"
            >
              Contact Us
            </a>
          </div>
          {/* Desktop nav actions */}
          <div className="hidden md:flex md:items-center">
            <button
              className="ml-4 px-4 md:px-5 py-2 rounded-md text-sm md:text-base bg-[#22203a] text-[#f3f3f7] hover:bg-[#393053] hover:text-purple-400 transition-colors"
              onClick={() => {
                setShowLoginForm(true);
                setShowSignupForm(false);
              }}
            >
              Sign In
            </button>
            <button
              className="ml-4 px-4 md:px-5 py-2 rounded-md text-sm md:text-base font-bold bg-purple-400 text-[#18122B] hover:bg-purple-600 hover:text-white transition-colors"
              onClick={() => {
                setShowSignupForm(true);
                setShowLoginForm(false);
              }}
            >
              Sign Up
            </button>
          </div>
        </nav>
      )}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <Routes>
          <Route path="/folder" element={<Folder onLogout={handleLogout} />} />
          <Route
            path="/"
            element={
              <>
                {!showSignupForm && !showLoginForm && (
                  <>
                    <div className="mb-8 flex justify-center">
                      <img
                        src={logo}
                        alt="Doctracer Logo Large"
                        className="w-72 h-72 md:w-[32rem] md:h-[32rem] object-contain mx-auto"
                      />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                      Upload and Share Your Files
                    </h1>
                    <p className="text-base sm:text-lg text-[#bdbdd7] mb-8 md:mb-10">
                      Enjoy saving file storage by uploading your images,
                      documents, music, and videos all in one place!
                    </p>
                    <label className="inline-block bg-purple-400 text-[#18122B] font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg cursor-pointer shadow-lg hover:bg-purple-600 hover:text-white transition-colors">
                      <input type="file" style={{ display: "none" }} />
                      <FaUpload className="inline-block mr-2 text-lg sm:text-xl align-middle" />
                      <span>Upload</span>
                    </label>
                  </>
                )}
                {showSignupForm && (
                  <SignupForm
                    onClose={handleCloseForms}
                    onLogin={() => {
                      setShowLoginForm(true);
                      setShowSignupForm(false);
                    }}
                  />
                )}
                {showLoginForm && (
                  <LoginForm
                    onSignup={() => {
                      setShowSignupForm(true);
                      setShowLoginForm(false);
                    }}
                    onLogin={handleLogin}
                  />
                )}
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
