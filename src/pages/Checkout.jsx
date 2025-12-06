import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { CreditCard, Wallet, Truck, MapPin } from "lucide-react";

const Checkout = () => {
  const { refreshUserData } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Form State
  const [address, setAddress] = useState({ fullName: "", city: "", phone: "", addressLine: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default COD

  useEffect(() => {
    // Cart total fetch kar lo display ke liye
    api.get("/cart").then(res => {
      setCartTotal(res.data.cart?.totalAmount || 0);
    });
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.city || !address.phone) {
      return toast.error("Please fill address details");
    }

    setLoading(true);
    try {
      if (paymentMethod === "COD" || paymentMethod === "WALLET") {
        // Direct Order Place
        await api.post("/orders/place", {
          paymentMethod,
          shippingAddress: address
        });
        toast.success("Order Placed Successfully! 🎉");
        refreshUserData();
        navigate("/orders");
      } 
      else if (paymentMethod === "ONLINE") {
        // 🚀 Razorpay Logic Yahan Aayega (Abhi ke liye alert)
        toast("UPI/Online Payment integration pending backend setup");
        // Steps: 1. Create Order API -> 2. Open Razorpay -> 3. Verify Payment API
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EAEDED] min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT SIDE: FORMS */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Address Section */}
          <div className="bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-[#C7511F] flex items-center gap-2">
              <MapPin size={20}/> Delivery Address
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <input placeholder="Full Name" className="border p-2 rounded" value={address.fullName} onChange={e=>setAddress({...address, fullName: e.target.value})} />
              <input placeholder="Phone Number" className="border p-2 rounded" value={address.phone} onChange={e=>setAddress({...address, phone: e.target.value})} />
              <input placeholder="Address Line (House No, Street)" className="border p-2 rounded" value={address.addressLine} onChange={e=>setAddress({...address, addressLine: e.target.value})} />
              <input placeholder="City" className="border p-2 rounded" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} />
            </div>
          </div>

          {/* 2. Payment Method Section */}
          <div className="bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-[#C7511F] flex items-center gap-2">
              <CreditCard size={20}/> Payment Method
            </h2>
            
            <div className="space-y-3">
              {/* Wallet Option */}
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="WALLET" 
                  checked={paymentMethod === "WALLET"} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <Wallet className="text-green-600" />
                  <span className="font-bold">FruitStore Wallet</span>
                  <span className="text-xs text-gray-500">(Fastest)</span>
                </div>
              </label>

              {/* COD Option */}
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === "COD"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <Truck className="text-gray-600" />
                  <span className="font-bold">Cash on Delivery</span>
                </div>
              </label>

              {/* UPI / Online Option */}
              <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="ONLINE" 
                  checked={paymentMethod === "ONLINE"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                  <CreditCard className="text-blue-600" />
                  <span className="font-bold">UPI / Cards / Netbanking</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="bg-white p-6 rounded shadow-sm h-fit sticky top-4">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2 text-sm">
            <span>Items Total:</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Delivery:</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="border-t pt-4 mt-2 flex justify-between font-bold text-xl text-[#B12704]">
            <span>Order Total:</span>
            <span>₹{cartTotal}</span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] py-2 rounded-full shadow-sm text-sm font-medium"
          >
            {loading ? "Placing Order..." : "Place Your Order"}
          </button>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            By placing your order, you agree to FruitStore's privacy notice and conditions of use.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Checkout;