import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const Deals = () => {
  const [deals, setDeals] = useState([]);

  // Page load hote hi data lao
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get("/deals");
        // API controller ne data: dealsWithDiscount return kiya tha
        setDeals(data.data); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchDeals();
  }, []);

  const handleAddToCart = async (dealId) => {
    try {
      await api.post("/cart/add", { 
        itemId: dealId, 
        itemType: "24HrDeal", 
        quantity: 1 
      });
      toast.success("Added to Cart!");
    } catch (err) {
      toast.error("Login required to add to cart");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔥 24Hr Flash Deals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div key={deal._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <img src={deal.image} alt={deal.title} className="w-full h-48 object-cover" />
            
            <div className="p-4">
              <h2 className="text-xl font-semibold">{deal.title}</h2>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-600 font-bold text-lg">₹{deal.discountedPrice}</span>
                {deal.discount > 0 && (
                  <span className="text-gray-400 line-through text-sm">₹{deal.price}</span>
                )}
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                  {deal.discount}% OFF
                </span>
              </div>

              <button 
                onClick={() => handleAddToCart(deal._id)}
                className="w-full mt-4 bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400"
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;