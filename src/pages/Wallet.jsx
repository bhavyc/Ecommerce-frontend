import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const fetchWallet = () => {
    api.get("/wallet").then(res => setWallet(res.data));
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleAdd = async () => {
    try {
      await api.post("/wallet/add", { amount: Number(amount) });
      toast.success("Money Added!");
      setAmount("");
      fetchWallet();
    } catch(err) { toast.error("Error"); }
  };

  if(!wallet) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <h1 className="text-3xl font-bold mb-6">Your Wallet</h1>
      
      <div className="bg-amazon_blue text-white p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Current Balance</p>
          <p className="text-4xl font-bold">₹{wallet.walletBalance}</p>
        </div>
        <div className="bg-white text-black p-4 rounded shadow-lg">
           <input type="number" className="border p-2 w-32 mr-2" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
           <button onClick={handleAdd} className="bg-amazon_yellow px-4 py-2 rounded font-bold">Add Money</button>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4">Transaction History</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b"><th className="p-2">Date</th><th className="p-2">Description</th><th className="p-2">Amount</th></tr>
        </thead>
        <tbody>
          {wallet.transactions.map(t => (
            <tr key={t._id} className="border-b text-sm">
              <td className="p-2">{new Date(t.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{t.description}</td>
              <td className={`p-2 font-bold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'CREDIT' ? '+' : '-'} ₹{t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Wallet;