import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, Heart } from "lucide-react";
import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

const Navbar = () => {
  const { user, logout, cartCount } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-[80px] flex items-center justify-between gap-6">
        
        {/* 1. LOGO (Modern) */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-1">
          🍏 Fruit<span className="text-brand-green">Store</span>
        </Link>

        {/* 2. SEARCH BAR (Rounded & Clean) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
          <input 
            type="text"
            className="w-full pl-5 pr-12 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm"
            placeholder="Search for apples, mangoes, deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1.5 bg-brand-green text-white p-1.5 rounded-full hover:bg-brand-dark transition">
            <Search size={20} />
          </button>
        </form>

        {/* 3. NAVIGATION LINKS (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 font-medium text-gray-600 text-sm">
          <Link to="/deals" className="hover:text-brand-green transition">Flash Deals</Link>
          <Link to="/drops" className="hover:text-brand-green transition">Fresh Drops</Link>
          <Link to="/group-buy-home" className="hover:text-brand-green transition">Group Buy</Link>
        </div>

        {/* 4. ACTIONS (Icons) */}
        <div className="flex items-center gap-4">
          
          {/* Compare / Wishlist */}
          <Link to="/compare" className="relative p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
            <Heart size={24} />
          </Link>

          {/* User Profile */}
          <div className="relative group">
            <Link to={user ? "/profile" : "/login"} className="flex items-center gap-2 hover:bg-gray-50 py-1 px-2 rounded-full border border-transparent hover:border-gray-200 transition cursor-pointer">
              <div className="w-8 h-8 bg-brand-light text-brand-dark flex items-center justify-center rounded-full">
                <User size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                {user ? user.name.split(' ')[0] : "Login"}
              </span>
            </Link>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden hidden group-hover:block p-1">
               {user ? (
                 <>
                   <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-dark rounded-lg">My Orders</Link>
                   <Link to="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-dark rounded-lg">Wallet</Link>
                   <Link to="/membership" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-dark rounded-lg">Prime Membership</Link>
                   <Link to="/invite" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-light">Invite & Earn ₹50</Link>
                   <div className="h-px bg-gray-100 my-1"></div>
                   <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                 </>
               ) : (
                 <Link to="/login" className="block px-4 py-2 text-sm font-bold text-center bg-brand-green text-white rounded-lg">Login / Signup</Link>
                 
               )}
            </div>
          </div>

          {/* Cart (Modern Badge) */}
          <Link to="/cart" className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition">
            <ShoppingBag size={20} />
            <span className="font-bold text-sm">{cartCount}</span>
          </Link>
        <Link to="/game" className="flex items-center gap-1 text-green-700 font-bold hover:bg-green-50 px-2 py-1 rounded-lg">
  🌳 Grow & Win
</Link>
        </div>
      </div>
      
      {/* Mobile Search Bar (Visible only on mobile) */}
      <div className="md:hidden px-4 pb-3">
         <form onSubmit={handleSearch} className="relative">
            <input type="text" className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-lg outline-none text-sm" placeholder="Search..." value={query} onChange={e=>setQuery(e.target.value)}/>
            <Search size={16} className="absolute right-3 top-2.5 text-gray-500" />
         </form>
      </div>
    </nav>
  );
};
export default Navbar;