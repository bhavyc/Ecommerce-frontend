// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GlobalProvider } from "./context/GlobalContext";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Drops from "./pages/Drops";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";     // Ensure ye file bani ho
import Membership from "./pages/Membership"; // Ensure ye file bani ho
import Wallet from "./pages/Wallet";     // Ensure ye file bani ho
import Compare from "./pages/Compare";
import Checkout from "./pages/Checkout";
import TreeGame from "./pages/TreeGame";
import Referral from "./pages/Referral";
// 👇 Placeholder Components (Agar file nahi banayi toh error nahi aayega)
const GroupBuyPlaceholder = () => <div className="p-10 text-center text-2xl font-bold">👥 Group Buy Page (Coming Soon)</div>;
const ComparePlaceholder = () => <div className="p-10 text-center text-2xl font-bold">⚖️ Compare Products (Coming Soon)</div>;
const SearchResults = () => <div className="p-10 text-center text-2xl font-bold">🔍 Search Results Page</div>;
const NormalDeals = () => <div className="p-10 text-center text-2xl font-bold">🛍️ Best Sellers Page</div>;
const Deals24 = () => <div className="p-10 text-center text-2xl font-bold">⚡ 24Hr Deals Page</div>;

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <div className="bg-[#EAEDED] min-h-screen font-sans text-[#131921]">
          {/* Navbar har page par dikhega */}
          <Navbar />
          
          <Toaster position="top-center" />
          
          <div className="flex-1">
            <Routes>
              {/* ✅ MAIN ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* ✅ FEATURE ROUTES */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/drops" element={<Drops />} />
              
              {/* ✅ DASHBOARD ROUTES */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/membership" element={<Membership />} />
                <Route path="/compare" element={<Compare />} />       
                
                {/* ✅ PLACEHOLDER ROUTES (Inke liye alag files baad mein banana) */}
              <Route path="/deals" element={<Deals24 />} />
              <Route path="/normal-deals" element={<NormalDeals />} />
              <Route path="/group-buy-home" element={<GroupBuyPlaceholder />} />
              <Route path="/group/lobby/:groupId" element={<GroupBuyPlaceholder />} />
              {/* <Route path="/compare" element={<ComparePlaceholder />} /> */}
              <Route path="/search" element={<SearchResults />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/game" element={<TreeGame />} />
              <Route path="/invite" element={<Referral />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;