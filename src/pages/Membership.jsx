import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { CheckCircle, Crown } from "lucide-react";
import toast from "react-hot-toast";
import { GlobalContext } from "../context/GlobalContext";

const Membership = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshUserData } = useContext(GlobalContext);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data } = await api.get("/membership/status");
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buyMembership = async () => {
    try {
      await api.post("/membership/buy");
      toast.success("Welcome to Prime Membership! 👑");
      await checkStatus();
      refreshUserData(); // Update global user state
    } catch (err) {
      toast.error(err.response?.data?.message || "Error buying membership");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-gradient-to-r from-blue-900 to-gray-900 text-white rounded-lg p-10 text-center shadow-xl">
        <Crown size={64} className="mx-auto text-yellow-400 mb-4" />
        <h1 className="text-4xl font-bold mb-4">FruitStore <span className="text-blue-300">Prime</span></h1>
        
        {status?.isMember ? (
          <div className="bg-green-600/20 border border-green-500 p-4 rounded-lg inline-block mt-4">
            <h2 className="text-2xl font-bold text-green-400">Membership Active ✅</h2>
            <p className="mt-2">Valid until: {new Date(status.expiryDate).toDateString()}</p>
            <p className="text-sm opacity-80">{status.daysLeft} days remaining</p>
          </div>
        ) : (
          <>
            <p className="text-xl mb-8">Get exclusive access to Fresh Drops, Free Delivery, and Special Deals.</p>
            <button 
              onClick={buyMembership}
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded hover:bg-yellow-500 transition transform hover:scale-105"
            >
              Join Prime for ₹499/month
            </button>
          </>
        )}
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          "Early Access to Fresh Drops 🍓",
          "Exclusive Member-only Discounts 💰",
          "Priority Customer Support 🎧"
        ].map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded shadow flex items-center gap-4">
            <CheckCircle className="text-green-600" />
            <span className="font-semibold">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;