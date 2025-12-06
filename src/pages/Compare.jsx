import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const Compare = () => {
  const [items, setItems] = useState([]);

  const load = () => api.get("/compare").then(res => setItems(res.data.items || []));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await api.delete(`/compare/remove/${id}`);
    toast.success("Removed");
    load();
  };

  if(items.length === 0) return <div className="p-10 text-center">Compare List Empty</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compare Products</h1>
      <div className="grid grid-cols-4 gap-4">
        {items.map(i => (
          <div key={i._id} className="bg-white p-4 shadow border">
             <img src={i.image} className="h-40 mx-auto" />
             <h3 className="font-bold my-2 h-12">{i.title}</h3>
             <p className="text-red-700 font-bold text-xl mb-2">₹{i.price}</p>
             <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">{i.description}</p>
             <button onClick={() => remove(i.deal._id)} className="text-red-500 text-sm underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Compare;