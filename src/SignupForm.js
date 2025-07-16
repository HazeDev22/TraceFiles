import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaLock, FaKey, FaEnvelope } from 'react-icons/fa';
import loadingGif from './asssets/loading1.gif';
import { APIService } from './hooks/fetchApi';

const steps = [
  { label: 'Info', key: 'info' },
  { label: 'Verify', key: 'verify' },
  { label: 'Submit', key: 'submit' },
];

const CORRECT_OTP = 'AB12'; // For demo, in real app this would be dynamic

export default function SignupForm({ onClose, onLogin }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [otpMessageColor, setOtpMessageColor] = useState('black');
  const [otpStatus, setOtpStatus] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);


  // Handle countdown and redirect
  useEffect(() => {
    let timer;
    if (showLoading && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (showLoading && countdown === 0) {
      setShowLoading(false);
      setCountdown(5);
      if (onLogin) onLogin();
    }
    return () => clearTimeout(timer);
  }, [showLoading, countdown, onLogin]);

  // Calculate progress for step lines
  const step1Fields = [form.username, form.fullname, form.email, form.password, form.confirmPassword];
  const step1Progress = step1Fields.filter(Boolean).length / step1Fields.length;
  const step2Fields = [form.otp];
  const step2Progress = step2Fields.filter(Boolean).length / step2Fields.length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validateStep1 = () => {
    return (
      form.username &&
      form.fullname &&
      form.email &&
      form.password &&
      form.confirmPassword &&
      form.password === form.confirmPassword
    );
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (currentStep === 0 && !validateStep1()) return;

    if (currentStep === 0) {
      setCurrentStep(1);
      await sendOtp();
    } else if (currentStep === 1 && otpStatus !== 'success') {
      return;
    } else {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const sendOtp = async () => {
    setSendingOtp(true);
    setOtpStatus(null);
    setOtpMessage('');

    try {
      const response = await APIService.post({
        url: 'send-otp',
        payload: {
          username: form.username,
          name: form.fullname,
          email: form.email,
          password: form.password,
        }
      });

      if (response.data && response.data.success) {
        setOtpSent(true);
        setOtpMessage('OTP sent successfully! Please check your email.');
        setOtpStatus('sent');
        setResendTimer(60);
        setOtpMessageColor('green'); 
      }
    } catch (error) {

    }
  };



  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    setOtpStatus(null);
    setOtpMessage('');
  };

  const handleOtpCheck = async () => {
    try {
      const response = await APIService.post({
        url: 'verify-otp',
        payload: {
          otpcode: form.otp,
          email: form.email,
        }
      });

      if (response.data && response.data.success) {
        setOtpSent(true);
        setOtpMessage('OTP VERIFIED');
        setOtpStatus('sent');
        setResendTimer(60);
        setOtpMessageColor('green'); // Success color
      } else {
        setOtpSent(false);
        setOtpMessage('OTP VERIFICATION FAILED');
        setOtpStatus('error');
        setOtpMessageColor('red'); // Error color - red as requested
      }
    } catch (error) {

    }
  };

  const handleSubmit = async () => {
    setShowLoading(true);

    try {
      const payload = {
        username: form.username,
        name: form.fullname,
        email: form.email,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      };

      const response = await APIService.post({
        payload: payload
      });

      if (response.data && response.data.success) {
        console.log('Registration successful:', response.data);

        if (response.data.data && response.data.data.token) {
          localStorage.setItem('access_token', response.data.data.token);
        }

        alert('Registration successful!');

      } else {
        console.error('Registration failed:', response.data);
        alert('Registration failed: ' + (response.data?.message || 'Unknown error'));
      }

    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + (error.message || 'Network error'));
    } finally {
      setShowLoading(false);
    }
  };


  return (
    <div className="relative max-w-md w-full mx-auto bg-[#18122B] rounded-xl shadow-lg p-8 border border-[#2a213a] text-[#f3f3f7]">
      {onClose && (
        <button
          className="absolute top-4 right-4 text-[#bdbdd7] hover:text-purple-400 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close signup form"
        >
          &times;
        </button>
      )}
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        Signup Form
      </h2>
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Label */}
              <span
                className={`text-sm font-semibold mb-2 ${idx === currentStep ? "text-purple-400" : "text-[#bdbdd7]"
                  }`}
              >
                {step.label}
              </span>
              <div className="relative flex items-center w-full">
                {/* Step circle */}
                <div
                  className={`rounded-full w-7 h-7 flex items-center justify-center border-2 z-20 mx-auto ${idx <= currentStep
                    ? "bg-purple-400 border-purple-400 text-white"
                    : "bg-[#22203a] border-[#bdbdd7] text-[#bdbdd7]"
                    }`}
                  style={{ position: "relative" }}
                >
                  {idx + 1}
                </div>
                {/* Connecting line to next step */}
                {idx < steps.length - 1 && (
                  <div className="absolute left-1/2 top-1/2" style={{ width: "100%", height: "4px", zIndex: 10, transform: "translateY(-50%)" }}>
                    {/* Background line */}
                    <div className="w-full h-full bg-[#393053] rounded" />
                    {/* Progress line */}
                    {idx === 0 && (
                      <div
                        className="h-full bg-purple-400 rounded transition-all duration-300 absolute top-0 left-0"
                        style={{ width: `${step1Progress * 100}%` }}
                      />
                    )}
                    {idx === 1 && (
                      <div
                        className="h-full bg-purple-400 rounded transition-all duration-300 absolute top-0 left-0"
                        style={{ width: `${step2Progress * 100}%` }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Step Content */}
      <form onSubmit={handleNext}>
        {currentStep === 0 && (
          <div className="mb-6 space-y-4">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Username"
                className="w-full px-4 py-2 pl-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            {/* Full Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Full Name"
                className="w-full px-4 py-2 pl-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            {/* Email Address */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email Address"
                className="w-full px-4 py-2 pl-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                className="w-full px-4 py-2 pr-10 pl-10 rounded-md bg-[#22203a] text-white border border-[#393053] focus:border-purple-400 focus:outline-none"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#bdbdd7] hover:text-purple-400 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Confirm Password with show/hide icon */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                className={`w-full px-4 py-2 pr-10 pl-10 rounded-md bg-[#22203a] text-white border ${form.confirmPassword &&
                  form.password !== form.confirmPassword
                  ? "border-red-500"
                  : "border-[#393053]"
                  } focus:border-purple-400 focus:outline-none`}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[#bdbdd7] hover:text-purple-400 focus:outline-none"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {form.confirmPassword &&
              form.password !== form.confirmPassword && (
                <div className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </div>
              )}
          </div>
        )}
        {currentStep === 1 && (
          <div className="mb-6 space-y-4">
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bdbdd7] text-lg" />
              <input
                type="number"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                maxLength={6}
                placeholder="Enter 6-digit OTP sent to your email"
                className={`w-full px-4 py-2 pl-10 rounded-md bg-[#22203a] text-white border focus:outline-none ${otpStatus === "success"
                  ? "border-green-500"
                  : otpStatus === "error"
                    ? "border-green-500"
                    : "border-[#393053]"
                  } focus:border-purple-400`}
                required
              />
            </div>
            {/* Only show Verify OTP button if not yet verified */}
            {otpStatus !== 'success' && (
              <button
                type="button"
                className="w-full px-4 py-2 rounded-md font-bold bg-purple-400 text-[#ffffff] hover:bg-purple-600 hover:text-white transition-colors"
                onClick={handleOtpCheck}
                disabled={form.otp.length !== 6}
              >
                Verify OTP
              </button>
            )}
            {otpStatus && (
              <div style={{ color: otpMessageColor }}>
                {otpMessage}
              </div>
            )}
          </div>
        )}
        {currentStep === 2 && (
          <div className="mb-6 text-center">
            <div className="text-lg mb-4">Review your information:</div>
            <div className="mb-2">
              Username:{" "}
              <span className="font-semibold text-purple-400">
                {form.username}
              </span>
            </div>
            <div className="mb-2">
              Full Name:{" "}
              <span className="font-semibold text-purple-400">
                {form.fullname}
              </span>
            </div>
            <div className="mb-2">
              Email:{" "}
              <span className="font-semibold text-purple-400">
                {form.email}
              </span>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-md font-bold ${currentStep === 0
              ? "bg-[#393053] text-[#bdbdd7] cursor-not-allowed"
              : "bg-purple-400 text-white hover:bg-purple-500"
              } transition-colors`}
          >
            Previous
          </button>
          {currentStep === 0 && (
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-bold bg-purple-400 text-white hover:bg-purple-600 transition-colors ${!validateStep1() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={!validateStep1()}
            >
              Next
            </button>
          )}
          {/* Show Next button on the right only after OTP is verified in step 2 */}
          {currentStep === 1 && otpStatus === 'success' && (
            <button
              type="button"
              className="px-6 py-2 rounded-md font-bold bg-purple-400 text-white hover:bg-purple-600 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {/* Show Submit button on the right in step 2 */}
          {currentStep === 2 && (
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-purple-400 text-white font-bold hover:bg-purple-600 transition-colors shadow-md"
              onClick={handleSubmit}
              disabled={showLoading}
            >
              {showLoading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
      {/* Loading Overlay */}
      {showLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <img src={loadingGif} alt="Loading..." className="mb-6" style={{ width: 500, height: 500, maxWidth: '80vw', maxHeight: '60vh' }} />
          <div className="text-white text-xl font-bold mb-2">Signing up...</div>
          <div className="text-purple-300 text-lg">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</div>
        </div>
      )}
    </div>
  );
} 