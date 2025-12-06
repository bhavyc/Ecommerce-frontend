import { useEffect, useState, useContext, useRef } from "react";
import api from "../services/api";
import Timer from "../components/Timer";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { 
  ArrowRight, ShoppingCart, BarChart2, CheckCircle, 
  Lock, Clock, ChevronLeft, ChevronRight 
} from "lucide-react";

const Home = () => {
  const [deals24, setDeals24] = useState([]);
  const [normalDeals, setNormalDeals] = useState([]);
  const [drops, setDrops] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const { user, refreshUserData } = useContext(GlobalContext);

  const flashDealsRef = useRef(null);
  const bestSellersRef = useRef(null);

  // Scroll Function
  const scroll = (ref, direction) => {
    const { current } = ref;
    if (current) {
      const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [d24, nd, dropRes, cartRes, comp] = await Promise.all([
          api.get("/deals"),
          api.get("/normal-deals"),
          api.get("/drops"),
          api.get("/cart"),
          api.get("/compare")
        ]);

        setDeals24(d24.data.data);
        setNormalDeals(nd.data.data);
        setDrops(dropRes.data.drops || []);
        setCartItems(cartRes.data.cart?.items || []);
        setCompareList(comp.data.items ? comp.data.items.map(i => i.deal._id || i.deal) : []);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  const addToCart = async (id, type) => {
    try {
      await api.post("/cart/add", { itemId: id, itemType: type });
      toast.success("Added to Basket 🧺");
      refreshUserData();
      setCartItems([...cartItems, { itemId: id }]);
    } catch(err) { toast.error("Please Login first"); }
  };

  const handleClaimDrop = async (drop) => {
    try {
      await api.post("/cart/add", { itemId: drop._id, itemType: "Drop", quantity: 1 });
      toast.success("Drop Claimed Successfully! 🚀");
      refreshUserData();
      setCartItems([...cartItems, { itemId: drop._id }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error claiming drop");
    }
  };

  const toggleCompare = async (dealId) => {
    const isAdded = compareList.includes(dealId);
    let newList = isAdded ? compareList.filter(id => id !== dealId) : [...compareList, dealId];
    setCompareList(newList);
    try {
      isAdded ? await api.delete(`/compare/remove/${dealId}`) : await api.post("/compare/add", { dealId });
    } catch(e) { toast.error("Login required"); }
  };

  return (
    <div className="bg-brand-gray min-h-screen font-sans pb-24">
      
      {/* 🌟 HERO SECTION */}
      <div className="relative bg-[#f0fdf4] pt-12 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-[1500px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">100% ORGANIC & FRESH</span>
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a3c28] leading-[1.1]">
                  Fresh Fruits <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-800">
                    Delivered Daily.
                  </span>
                </h1>
                <p className="text-gray-600 text-lg max-w-lg">
                  Order fresh fruits from local farms directly to your doorstep. Join Prime for exclusive 15-minute drops!
                </p>
                <div className="flex gap-4">
                  <Link to="/normal-deals" className="bg-brand-green text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-1 transition flex items-center gap-2">
                      Shop Now <ArrowRight size={20}/>
                  </Link>
                </div>
            </div>
            <div className="relative hidden lg:block">
                <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop" className="w-full h-[400px] object-cover rounded-[2rem] shadow-2xl" alt="Hero" />
            </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 -mt-16 relative z-20 space-y-12">
        
        {/* 🚀 FRESH DROPS (RESTORED PREMIUM DESIGN) */}
        {drops.length > 0 && (
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl mb-12">
            
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#052e16] to-[#14532d]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-[80px]"></div>
            
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 p-8 md:p-10">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1 shadow-lg shadow-red-900/20">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> LIVE NOW
                      </span>
                      <span className="text-emerald-200 text-sm font-medium tracking-wide">PRIME EXCLUSIVE</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      Fresh Drops <span className="text-brand-yellow">Radar</span> 📡
                    </h2>
                    <p className="text-emerald-100/80 mt-2 max-w-lg text-sm md:text-base">
                      Limited-time harvest deals directly from farms. Claims expire in 15 minutes!
                    </p>
                  </div>
                  
                  <Link to="/drops" className="group flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full font-bold transition-all border border-white/10">
                    View All Drops <ArrowRight size={18} className="group-hover:translate-x-1 transition"/>
                  </Link>
              </div>
              
              {/* Cards Container */}
              <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x">
                  {drops.map(drop => {
                    const isClaimed = cartItems.some(item => item.itemId === drop._id);
                    return (
                      <div key={drop._id} className="min-w-[280px] md:min-w-[300px] snap-center bg-white p-5 rounded-3xl shadow-xl relative group hover:-translate-y-2 transition duration-300">
                          
                          {/* Timer Badge */}
                          {drop.isOfferActive && (
                            <div className="absolute top-4 right-4 bg-red-50 text-red-600 text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-red-100">
                              <Clock size={12} className="animate-spin-slow"/> 
                              <Timer targetDate={drop.expiryTime} />
                            </div>
                          )}

                          {/* Image */}
                          <div className="h-44 flex items-center justify-center bg-[#f8fafc] rounded-2xl mb-4 group-hover:bg-green-50 transition-colors">
                              <img src={drop.image} className="h-32 object-contain drop-shadow-md group-hover:scale-110 transition duration-500" />
                          </div>
                          
                          {/* Content */}
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg truncate mb-1">{drop.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Organic</span>
                              <span>1kg Pack</span>
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                  <p className="text-xs text-gray-400 line-through">₹{drop.price}</p>
                                  <p className="text-2xl font-extrabold text-brand-dark">₹{drop.finalPrice}</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            {user?.isMember ? (
                                <button 
                                  disabled={!drop.isOfferActive || isClaimed}
                                  onClick={() => handleClaimDrop(drop)}
                                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                                    isClaimed 
                                      ? 'bg-emerald-100 text-emerald-800 cursor-default shadow-none'
                                      : drop.isOfferActive 
                                        ? 'bg-brand-dark text-white hover:bg-brand-green hover:shadow-green-200' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                  }`}
                                >
                                  {isClaimed ? <>Claimed <CheckCircle size={18}/></> : drop.isOfferActive ? "Claim Drop" : "Expired"}
                                </button>
                            ) : (
                                <Link to="/membership" className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                                  <Lock size={16}/> Unlock with Prime
                                </Link>
                            )}
                          </div>
                      </div>
                    )
                  })}
              </div>

            </div>
          </div>
        )}

        {/* ⚡ FLASH DEALS (CAROUSEL - 3 Items Logic) */}
        <div className="relative group">
           <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-gray-800">⚡ Flash Deals</h2>
              <Link to="/deals" className="text-brand-green font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={18}/></Link>
           </div>
           
           <button onClick={() => scroll(flashDealsRef, "left")} className="absolute left-[-20px] top-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:scale-110 transition hidden md:group-hover:block border border-gray-100">
              <ChevronLeft size={24} />
           </button>
           <button onClick={() => scroll(flashDealsRef, "right")} className="absolute right-[-20px] top-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:scale-110 transition hidden md:group-hover:block border border-gray-100">
              <ChevronRight size={24} />
           </button>

           <div ref={flashDealsRef} className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-2 scroll-smooth">
              {deals24.map(deal => (
                 <div key={deal._id} 
                      className="shrink-0 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition border border-gray-100 relative group/card
                                 min-w-[85%] md:min-w-[45%] lg:min-w-[calc(33.333%-14px)]"
                 >
                    <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md">
                       -{deal.discount}%
                    </div>
                    <div className="h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-xl">
                       <img src={deal.image} className="h-40 object-contain group-hover/card:scale-110 transition duration-300" />
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><Clock size={10}/> Ends in: <Timer targetDate={new Date().setHours(24,0,0,0)} /></div>
                    <h3 className="font-bold text-gray-800 truncate text-lg">{deal.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                       <div>
                          <span className="text-xl font-bold text-brand-green">₹{deal.discountedPrice}</span>
                          <span className="text-xs text-gray-400 line-through ml-2">₹{deal.price}</span>
                       </div>
                       <button onClick={() => addToCart(deal._id, "24HrDeal")} className="bg-brand-light text-brand-dark p-3 rounded-full hover:bg-brand-green hover:text-white transition">
                          <ShoppingCart size={20} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* 🛍️ BEST SELLERS (CAROUSEL - 3 Items Logic) */}
        <div className="relative group pb-10">
           <h2 className="text-3xl font-bold text-gray-800 mb-6">Best Sellers</h2>
           
           <button onClick={() => scroll(bestSellersRef, "left")} className="absolute left-[-20px] top-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:scale-110 transition hidden md:group-hover:block border border-gray-100">
              <ChevronLeft size={24} />
           </button>
           <button onClick={() => scroll(bestSellersRef, "right")} className="absolute right-[-20px] top-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-800 hover:scale-110 transition hidden md:group-hover:block border border-gray-100">
              <ChevronRight size={24} />
           </button>

           <div ref={bestSellersRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2 scroll-smooth">
              {normalDeals.map(deal => (
                 <div key={deal._id} 
                      className="shrink-0 bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition duration-300 border border-transparent hover:border-brand-green/20 relative
                                 min-w-[85%] md:min-w-[45%] lg:min-w-[calc(33.333%-16px)]"
                 >
                    <button 
                      onClick={() => toggleCompare(deal._id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition ${compareList.includes(deal._id) ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400 hover:text-brand-green'}`}
                    >
                       <BarChart2 size={18} />
                    </button>

                    <Link to={`/product/${deal._id}`} className="block">
                       <div className="h-60 w-full bg-gray-50 rounded-2xl flex items-center justify-center mb-4 hover:bg-brand-light/30 transition">
                          <img src={deal.image} className="h-48 object-contain drop-shadow-md hover:scale-110 transition duration-500" />
                       </div>
                       <h3 className="font-extrabold text-xl text-gray-900 mb-1 line-clamp-1">{deal.title}</h3>
                       <p className="text-sm text-gray-500 mb-3 line-clamp-2">{deal.description}</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">₹{deal.finalPrice}</span>
                          <span className="text-sm text-gray-400 line-through">₹{deal.price}</span>
                       </div>
                    </Link>

                    <button 
                       onClick={() => addToCart(deal._id, "NormalDeal")} 
                       className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-brand-green transition-colors flex items-center justify-center gap-2"
                    >
                       Add to Basket <ShoppingCart size={18}/>
                    </button>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Floating Compare Bar */}
      {compareList.length > 0 && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-bounce-in">
            <span className="font-bold">{compareList.length} items selected</span>
            <Link to="/compare" className="bg-brand-green px-4 py-1.5 rounded-full font-bold hover:bg-white hover:text-brand-green transition">Compare Now</Link>
         </div>
      )}
    </div>
  );
};
export default Home;