import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import Timer from "../components/Timer";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { CheckCircle, ShoppingBag } from "lucide-react";

const Drops = () => {
  const [drops, setDrops] = useState([]);
  const [cartItems, setCartItems] = useState([]); // 🆕 Cart items track karne ke liye
  const [loading, setLoading] = useState(true);
  const { user, refreshUserData } = useContext(GlobalContext);

  // 1. Fetch Drops AND Cart Data
  const fetchData = async () => {
    try {
      const [dropsRes, cartRes] = await Promise.all([
        api.get("/drops"),
        api.get("/cart")
      ]);
      
      setDrops(dropsRes.data.drops || []);
      setCartItems(cartRes.data.cart?.items || []); // Cart items store kar lo
    } catch (err) {
      console.error(err);
      toast.error("Error loading drops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async (drop) => {
    try {
      await api.post("/cart/add", { 
        itemId: drop._id, 
        itemType: "Drop", // Ensure ye spelling backend switch case se match kare
        quantity: 1 
      });
      
      toast.success("Drop Claimed! Added to Cart 🛒");
      
      // 🆕 Turant State Update karo (Refresh ki zaroorat nahi)
      refreshUserData(); // Navbar update
      fetchData(); // Button update (Claimed dikhane ke liye)
      
    } catch (err) {
      const msg = err.response?.data?.message || "Error claiming drop";
      toast.error(msg);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">Loading Fresh Drops...</div>;

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-6 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-[#1a3c28]">🚀 Fresh Drops</h1>
          <p className="text-gray-600">Exclusive 15-minute deals. Once they're gone, they're gone!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {drops.map(drop => {
            // 🆕 Check karo ki ye drop cart mein hai ya nahi
            const isClaimed = cartItems.some(item => item.itemId === drop._id);

            return (
              <div key={drop._id} className={`bg-white rounded-2xl p-4 shadow-lg border-2 relative overflow-hidden transition-all hover:shadow-2xl ${drop.isOfferActive ? 'border-purple-500' : 'border-gray-200 opacity-80'}`}>
                
                {/* LIVE Badge */}
                {drop.isOfferActive && (
                   <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-10">
                     LIVE
                   </span>
                )}

                <div className="h-48 w-full bg-gray-50 rounded-xl flex items-center justify-center mb-4 relative">
                   <img src={drop.image} className="h-40 object-contain drop-shadow-md hover:scale-110 transition duration-500" />
                   {isClaimed && (
                     <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                          <CheckCircle size={20} /> Claimed
                        </span>
                     </div>
                   )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-1">{drop.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{drop.description}</p>
                
                <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                  <span className="text-3xl font-extrabold text-purple-700">₹{drop.finalPrice}</span>
                  {drop.isOfferActive ? (
                    <div className="text-xs font-bold text-red-500 flex flex-col items-end">
                       <span>Time Left:</span>
                       <Timer targetDate={drop.expiryTime} />
                    </div>
                  ) : (
                    <span className="text-gray-400 font-bold text-sm">EXPIRED</span>
                  )}
                </div>

                {/* Claim Button Logic */}
                {user?.isMember ? (
                   <button 
                     disabled={!drop.isOfferActive || isClaimed}
                     onClick={() => handleClaim(drop)}
                     className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition transform active:scale-95 ${
                        isClaimed 
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : drop.isOfferActive 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                     }`}
                   >
                     {isClaimed ? (
                       <>Already In Cart <ShoppingBag size={18}/></>
                     ) : drop.isOfferActive ? (
                       "Claim Drop Now"
                     ) : (
                       "Missed Out"
                     )}
                   </button>
                ) : (
                   <div className="bg-gray-100 text-gray-600 text-sm p-3 rounded-xl text-center border border-gray-200">
                      <span className="font-bold">Prime Member Only.</span> <br/>
                      Join to claim this drop.
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Drops;