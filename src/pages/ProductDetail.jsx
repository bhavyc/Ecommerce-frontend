import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { GlobalContext } from "../context/GlobalContext";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, MessageCircle, User, MessageSquare } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams(); // Deal ID
  const [data, setData] = useState(null);
  const [qaList, setQaList] = useState([]);
  
  // States for inputs
  const [question, setQuestion] = useState("");
  const [answerInputs, setAnswerInputs] = useState({}); // Store answers for each question
  const [activeReplyId, setActiveReplyId] = useState(null); // Track which question is being answered

  const { refreshUserData, user } = useContext(GlobalContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dealRes = await api.get(`/normal-deals/${id}`);
        const dealData = dealRes.data.data;
        setData(dealData);

        if (dealData.product && dealData.product._id) {
          const productId = dealData.product._id;
          const qaRes = await api.get(`/qa/${productId}`);
          setQaList(qaRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [id]);

  // 1. Ask a Question
  const postQuestion = async () => {
    if(!question.trim()) return toast.error("Please type a question");
    try {
      await api.post(`/qa/${data.product._id}`, { question });
      toast.success("Question Posted ✅");
      setQuestion("");
      const res = await api.get(`/qa/${data.product._id}`);
      setQaList(res.data.data);
    } catch(err) { 
      toast.error("Login Required to ask questions"); 
    }
  };

  // 2. Submit an Answer
  const postAnswer = async (questionId) => {
    const answerText = answerInputs[questionId];
    if (!answerText || !answerText.trim()) return toast.error("Answer cannot be empty");

    try {
      // Backend API Call
      await api.post(`/qa/answer/${questionId}`, { answer: answerText });
      
      toast.success("Answer Submitted 🚀");
      
      // Clear Input & Close Box
      setAnswerInputs({ ...answerInputs, [questionId]: "" });
      setActiveReplyId(null);

      // Refresh List
      const res = await api.get(`/qa/${data.product._id}`);
      setQaList(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login Required to answer");
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/cart/add", { itemId: data._id, itemType: "NormalDeal" });
      toast.success("Added to Cart 🛒");
      refreshUserData();
    } catch(err) { toast.error("Please Login"); }
  };

  if(!data) return <div className="p-20 text-center font-bold">Loading Product...</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex justify-center bg-gray-50 p-8 rounded-2xl">
            <img src={data.image} className="max-h-[400px] object-contain drop-shadow-xl hover:scale-105 transition duration-500" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">{data.title}</h1>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
            
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-brand-green">₹{data.finalPrice}</span>
              <span className="text-xl text-gray-400 line-through">₹{data.price}</span>
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">-{data.discount}% OFF</span>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={addToCart} className="flex-1 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-full shadow-lg flex justify-center items-center gap-2 transition">
                <ShoppingCart size={20}/> Add to Cart
              </button>
              <button className="p-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 text-gray-500 transition">
                <Heart size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* ❓ Q&A SECTION */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="text-brand-green"/> Customer Questions & Answers
          </h2>

          {/* Ask Box */}
          <div className="flex gap-4 mb-8">
            <input 
              className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-green/50" 
              placeholder="Have a question? Ask here..." 
              value={question} 
              onChange={e => setQuestion(e.target.value)} 
            />
            <button 
              onClick={postQuestion} 
              className="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-green transition"
            >
              Ask
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {qaList.length > 0 ? (
              qaList.map(qa => (
                <div key={qa._id} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 mb-2">
                      <span className="font-bold text-gray-900">Q:</span>
                      <span className="font-medium text-gray-800">{qa.question}</span>
                    </div>
                    
                    {/* Reply Toggle Button */}
                    <button 
                      onClick={() => setActiveReplyId(activeReplyId === qa._id ? null : qa._id)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare size={14}/> {activeReplyId === qa._id ? "Cancel" : "Reply"}
                    </button>
                  </div>
                  
                  {/* Existing Answers */}
                  {qa.answers.length > 0 ? (
                    qa.answers.map(ans => (
                      <div key={ans._id} className="flex gap-3 ml-4 mt-2 text-gray-600 text-sm border-l-2 border-gray-200 pl-3">
                        <span className="font-bold text-gray-500">A:</span>
                        <div>
                          <p>{ans.answer}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <User size={10}/> {ans.user?.name || "User"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="ml-7 text-xs text-gray-400 italic mb-2">No answers yet. Be the first!</p>
                  )}

                  {/* 🆕 Answer Input Box (Visible only when 'Reply' is clicked) */}
                  {activeReplyId === qa._id && (
                    <div className="mt-3 ml-4 flex gap-2 animate-fade-in">
                      <input 
                        type="text"
                        className="flex-1 border border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
                        placeholder="Type your answer..."
                        value={answerInputs[qa._id] || ""}
                        onChange={(e) => setAnswerInputs({ ...answerInputs, [qa._id]: e.target.value })}
                      />
                      <button 
                        onClick={() => postAnswer(qa._id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No questions asked yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;