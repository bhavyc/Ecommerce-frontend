import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Trash2 } from "lucide-react";
 
const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);
const proceedToCheckout = () => {
  navigate("/checkout"); // Seedha checkout page par bhejo
};
  const removeItem = async (itemId, itemType) => {
    try {
      await api.delete("/cart/remove", { data: { itemId, itemType } });
      toast.success("Item removed");
      loadCart(); // Refresh list
      refreshUserData(); // Update Navbar count
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  const placeOrder = async () => {
    // Filhal Wallet method hardcoded hai, baad mein Payment Page banayenge
    try {
      await api.post("/orders/place", { 
        paymentMethod: "WALLET", 
        shippingAddress: { fullName: "Bhavya", city: "Delhi" } 
      });
      toast.success("Order Placed Successfully!");
      refreshUserData();
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order Failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white p-8 max-w-4xl mx-auto mt-6 shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Your Amazon Cart is empty.</h2>
        <p className="mb-6">Check your Saved for later items below or continue shopping.</p>
        <Link to="/" className="bg-[#febd69] text-black px-6 py-2 rounded shadow-sm hover:bg-[#f3a847]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen p-4 font-sans">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row gap-6">
        
        {/* LEFT: CART ITEMS */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-normal border-b pb-4 mb-4 flex justify-between">
            Shopping Cart 
            <span className="text-sm text-gray-500 self-end">Price</span>
          </h1>

          {cart.items.map((item, index) => (
            <div key={index} className="flex gap-4 border-b pb-4 mb-4 last:border-0">
              {/* Image */}
              <div className="w-40 h-40 flex-shrink-0">
                 <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-medium text-[#007185] hover:underline cursor-pointer line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xl font-bold">₹{item.price}</p>
                </div>

                <p className="text-sm text-green-700 mt-1">In stock</p>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span className="bg-amazon-yellow text-white px-1 rounded text-[10px]">Prime</span>
                  <span>Eligible for FREE Shipping</span>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                   <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px._CB485936079_.png" className="h-4" />
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-md px-2 py-1 shadow-sm">
                    Qty: <span className="font-bold">{item.quantity}</span>
                  </div>
                  <div className="h-4 border-l border-gray-300"></div>
                  <button 
                    onClick={() => removeItem(item.itemId, item.itemType)}
                    className="text-[#007185] hover:underline hover:text-[#C7511F]"
                  >
                    Delete
                  </button>
                  <div className="h-4 border-l border-gray-300"></div>
                  <button className="text-[#007185] hover:underline">Save for later</button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-right text-lg">
             Subtotal ({cart.items.length} items): <span className="font-bold">₹{cart.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: CHECKOUT BOX */}
        <div className="w-full md:w-80 h-fit bg-white p-4 shadow-sm sticky top-20">
          <div className="flex items-center gap-2 mb-4 text-green-700 text-sm">
            <CheckCircle size={18} />
            <span>Your order is eligible for FREE Delivery.</span>
          </div>
          
          <h2 className="text-lg mb-4">
            Subtotal ({cart.items.length} items): <br/>
            <span className="font-bold text-xl">₹{cart.totalAmount.toFixed(2)}</span>
          </h2>

          <button 
            onClick={proceedToCheckout} 
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] py-2 rounded-full shadow-sm text-sm"
          >
            Proceed to Buy
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;