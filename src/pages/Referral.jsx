import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Copy, Share2, Gift } from "lucide-react";
import toast from "react-hot-toast";

const Referral = () => {
  const { user } = useContext(GlobalContext);

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referralCode);
    toast.success("Code Copied!");
  };

  const shareCode = () => {
    const text = `Hey! Buy fresh fruits on FruitStore. Use my code ${user?.referralCode} to join!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#e3fdf5] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1a3c28] p-8 text-center text-white">
           <Gift size={48} className="mx-auto mb-4 text-yellow-400 animate-bounce" />
           <h1 className="text-3xl font-bold mb-2">Refer & Earn ₹50</h1>
           <p className="text-green-100 opacity-90">Invite your friends to FruitStore. When they place their first order, you get ₹50 cash!</p>
        </div>

        {/* Code Section */}
        <div className="p-8 text-center space-y-6">
           <div>
             <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-wider">Your Referral Code</p>
             <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 flex justify-between items-center">
                <span className="text-2xl font-mono font-bold text-gray-800 tracking-widest">
                  {user?.referralCode || "LOADING..."}
                </span>
                <button onClick={copyCode} className="text-brand-green hover:text-brand-dark p-2">
                  <Copy size={20}/>
                </button>
             </div>
           </div>

           <button 
             onClick={shareCode}
             className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg"
           >
             <Share2 size={20} /> Share via WhatsApp
           </button>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t">
           Terms: Reward credited after friend's first successful order.
        </div>
      </div>
    </div>
  );
};

export default Referral;