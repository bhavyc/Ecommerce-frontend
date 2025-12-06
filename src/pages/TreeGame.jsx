import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { Droplet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Simple Images for Stages (Tu acche wale replace kar lena)
const STAGE_IMAGES = [
  "https://cdn-icons-png.flaticon.com/512/10697/10697717.png", // 0: Seed
  "https://cdn-icons-png.flaticon.com/512/4147/4147953.png",  // 1: Sapling
  "https://cdn-icons-png.flaticon.com/512/2560/2560327.png",  // 2: Tree
  "https://cdn-icons-png.flaticon.com/512/3094/3094863.png"   // 3: Fruit
];

const STAGE_NAMES = ["Plant a Seed", "Sapling", "Growing Tree", "Ready to Harvest"];

const TreeGame = () => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GlobalContext);

  const loadGame = async () => {
    try {
      const { data } = await api.get("/game/status");
      setGame(data.game);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGame(); }, []);

  const waterTree = async () => {
    try {
      const { data } = await api.post("/game/water");
      setGame(data.game);
      toast.success(data.message);
      if(data.message.includes("Harvest")) {
        toast("🎉 Reward Added to Wallet!", { icon: "🎁" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Farm...</div>;

  // Progress Bar Width
  const progressPercent = game.progress;

  return (
    <div className="min-h-screen bg-[#e3fdf5] p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#0f5132] mb-2">Grow Your Fruit 🌳</h1>
        <p className="text-gray-600">Water your tree to earn free rewards!</p>
      </div>

      {/* Game Card */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md relative overflow-hidden border-4 border-[#a7f3d0]">
        
        {/* Sky Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-blue-100 rounded-b-[50%] -z-0"></div>

        {/* Tree Image */}
        <div className="relative z-10 h-64 flex items-end justify-center mb-6">
           <img 
             src={STAGE_IMAGES[game.treeStage]} 
             alt="Tree" 
             className="h-48 object-contain transition-all duration-700 animate-bounce-slow" 
           />
        </div>

        {/* Stage Name */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {STAGE_NAMES[game.treeStage]}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden border border-gray-300">
           <div 
             className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-500 ease-out" 
             style={{ width: `${progressPercent}%` }}
           ></div>
        </div>
        <p className="text-center text-xs text-gray-500 mb-6">{progressPercent}% Grown</p>

        {/* Water Button */}
        <div className="flex flex-col items-center gap-4">
           <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-bold text-sm border border-blue-200 flex items-center gap-2">
              <Droplet size={16} fill="currentColor" /> {game.waterDrops} Drops Available
           </div>

           <button 
             onClick={waterTree}
             disabled={game.waterDrops < 10}
             className={`w-full py-4 rounded-2xl font-bold text-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${
               game.waterDrops >= 10 
                 ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300' 
                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
             }`}
           >
             Water Tree 💧 <span className="text-sm font-normal opacity-80">(-10 Drops)</span>
           </button>
        </div>
      </div>

      {/* How to get water */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm max-w-md w-full">
         <h3 className="font-bold text-gray-800 mb-2">How to get more water?</h3>
         <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">🛍️ Place an Order (+1 Drop per ₹10)</li>
            <li className="flex items-center gap-2">📅 Daily Login (+5 Drops)</li>
         </ul>
         <Link to="/" className="block mt-4 text-center text-brand-green font-bold hover:underline">
            Shop Now to Earn <ArrowRight size={16} className="inline"/>
         </Link>
      </div>

    </div>
  );
};

export default TreeGame;