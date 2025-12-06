import { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { login } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Handle Login
        await login(formData.email, formData.password);
        toast.success("Login Successful");
      } else {
        // Handle Register
        await api.post("/auth/register", formData);
        toast.success("Registration Successful! Please Login.");
        setIsLogin(true); // Switch to login view
        return;
      }
      navigate("/"); // Redirect to Home
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="w-96 p-8 bg-white border rounded shadow-sm">
        <h1 className="text-3xl font-normal mb-6 text-center">
          {isLogin ? "Sign-In" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-1">Your name</label>
              <input 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
                placeholder="First and last name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              type="email"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input 
              type="password"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" 
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded shadow text-sm font-normal border border-yellow-600 mt-4">
            {isLogin ? "Sign In" : "Create your Amazon account"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs relative">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
           <div className="relative bg-white px-2 text-gray-500">New to FruitStore?</div>
        </div>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded shadow text-sm border mt-4 text-gray-800"
        >
          {isLogin ? "Create your FruitStore account" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Login;