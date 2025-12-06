import { useEffect, useState } from "react";
import api from "../services/api";
import { Package } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data.orders || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Orders...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center shadow rounded">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex justify-between text-sm text-gray-600 border-b">
                <div className="flex gap-8">
                  <div>
                    <span className="block text-xs uppercase">Order Placed</span>
                    <span className="font-bold text-gray-800">{new Date(order.createdAt).toDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase">Total</span>
                    <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase">Ship To</span>
                    <span className="font-bold text-blue-600 cursor-pointer hover:underline">
                      {order.shippingAddress?.fullName || "User"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs uppercase">Order # {order._id.slice(-6)}</span>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-green-700">{order.orderStatus}</h3>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-4 items-center">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain border p-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-600 hover:underline cursor-pointer">{item.title}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-red-700">₹{item.price}</p>
                    </div>
                    <button className="bg-yellow-400 px-4 py-1 text-sm rounded hover:bg-yellow-500 shadow">
                      Buy it again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;