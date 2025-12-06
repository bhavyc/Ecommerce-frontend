import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "" // 🆕 Referral Code field added
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validations
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);
    
    try {
      // 2. API Call (Referral code optional hai, agar khali hai toh backend handle karega)
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode // Backend logic will use this
      });

      toast.success("Account created successfully! Please Login.");
      navigate("/login"); // Redirect to Login
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-8 pb-8 font-sans">
      
      {/* Logo Section */}
      <Link to="/" className="mb-6 flex items-center gap-1 text-3xl font-bold tracking-tighter text-[#131921]">
        🍏 Fruit<span className="text-[#febd69]">Store</span>
      </Link>

      <div className="w-[350px] p-6 border border-gray-300 rounded shadow-sm bg-white">
        <h1 className="text-3xl font-normal mb-6">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Your Name */}
          <div>
            <label className="block text-sm font-bold mb-1 pl-0.5">Your name</label>
            <input 
              name="name"
              type="text"
              placeholder="First and last name"
              className="w-full border border-gray-400 p-2 rounded-[3px] focus:ring-[3px] focus:ring-[#e77600]/50 focus:border-[#e77600] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-1 pl-0.5">Mobile number or email</label>
            <input 
              name="email"
              type="email"
              className="w-full border border-gray-400 p-2 rounded-[3px] focus:ring-[3px] focus:ring-[#e77600]/50 focus:border-[#e77600] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold mb-1 pl-0.5">Password</label>
            <input 
              name="password"
              type="password"
              placeholder="At least 6 characters"
              className="w-full border border-gray-400 p-2 rounded-[3px] focus:ring-[3px] focus:ring-[#e77600]/50 focus:border-[#e77600] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-bold">i</span> Passwords must be at least 6 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold mb-1 pl-0.5">Re-enter password</label>
            <input 
              name="confirmPassword"
              type="password"
              className="w-full border border-gray-400 p-2 rounded-[3px] focus:ring-[3px] focus:ring-[#e77600]/50 focus:border-[#e77600] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🎁 Referral Code (Optional) */}
          <div>
            <label className="block text-sm font-bold mb-1 pl-0.5">Referral Code (Optional)</label>
            <input 
              name="referralCode"
              type="text"
              placeholder="e.g. FRUIT1234"
              className="w-full border border-gray-400 p-2 rounded-[3px] focus:ring-[3px] focus:ring-[#e77600]/50 focus:border-[#e77600] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all bg-gray-50"
              value={formData.referralCode}
              onChange={handleChange}
            />
            <p className="text-[11px] text-green-600 mt-1 font-medium">Use a friend's code to help them earn rewards!</p>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#F7CA00] hover:bg-[#F0B800] py-2 rounded-[3px] shadow-sm text-sm border border-[#FCD200] mt-4 font-normal"
          >
            {loading ? "Creating Account..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 text-[11px] text-gray-600 leading-4">
          By creating an account, you agree to FruitStore's <span className="text-[#0066c0] cursor-pointer hover:underline hover:text-[#C7511F]">Conditions of Use</span> and <span className="text-[#0066c0] cursor-pointer hover:underline hover:text-[#C7511F]">Privacy Notice</span>.
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm">
            Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#C7511F] hover:underline font-bold">Sign in &nbsp;▸</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;