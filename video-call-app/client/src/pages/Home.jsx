import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const createMeeting = () => {
    const roomId = Math.random()
      .toString(36)
      .substring(2, 10);

    navigate(`/room/${roomId}`);
  };

  const joinMeeting = () => {
    if (!meetingId.trim()) return;

    navigate(`/room/${meetingId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">

      <div className="w-105 bg-slate-800 rounded-2xl shadow-2xl p-10">

        <h1 className="text-4xl font-bold text-center text-white">
          Video Call
        </h1>

        <p className="text-slate-400 text-center mt-3 mb-8">
          Fast and Secure Meetings
        </p>

        <button
          onClick={createMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Create Meeting
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-slate-600"></div>
          <span className="px-4 text-slate-400">
            OR
          </span>
          <div className="flex-1 h-px bg-slate-600"></div>
        </div>

        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={meetingId}
          onChange={(e) =>
            setMeetingId(e.target.value)
          }
          className="w-full bg-slate-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={joinMeeting}
          className="w-full mt-5 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Join Meeting
        </button>

      </div>

    </div>
  );
}