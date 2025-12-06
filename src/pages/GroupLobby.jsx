import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const GroupLobby = () => {
  const { groupId } = useParams();
  const [lobby, setLobby] = useState(null);

  useEffect(() => {
    const poll = setInterval(() => {
      api.get(`/group/lobby/${groupId}`).then(res => setLobby(res.data.data));
    }, 3000); // Polling every 3s
    return () => clearInterval(poll);
  }, [groupId]);

  if(!lobby) return <div>Loading Lobby...</div>;
  
  const { group, slotsLeft, shareLink, isFull } = lobby;
  const progress = ((group.requiredSize - slotsLeft) / group.requiredSize) * 100;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 shadow-lg text-center rounded">
      <h1 className="text-2xl font-bold mb-4">{isFull ? "Group Complete! 🎉" : "Waiting for Members..."}</h1>
      <img src={group.deal.image} className="w-32 h-32 mx-auto mb-4" />
      <h3 className="font-bold">{group.deal.title}</h3>
      <p className="text-green-600 font-bold mb-4">Group Price: ₹{group.deal.groupPrice}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
      </div>
      <p>{slotsLeft} slots remaining</p>

      {!isFull && (
        <div className="mt-6 bg-yellow-50 p-4 border border-yellow-200 rounded">
          <p className="text-sm">Share this link to friends:</p>
          <code className="block bg-white p-2 mt-1 select-all border">{shareLink}</code>
        </div>
      )}
    </div>
  );
};
export default GroupLobby;