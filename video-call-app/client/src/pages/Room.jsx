import { useEffect, useRef , useState} from "react";
import socket from "../socket";
import { useParams,useNavigate  } from "react-router-dom";

import { createPeer } from "../webrtc/peer";

import { startCamera } from "../webrtc/media";

import { setupPeerEvents } from "../webrtc/signaling";

import { toggleMic, toggleCamera, endCall } from "../webrtc/controls";
import {
  startScreenShare,
} from "../webrtc/screenShare";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,Monitor,
} from "lucide-react";


export default function Room() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const peerRef = useRef(null);

  const localStreamRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      peerRef.current = createPeer();




      setupPeerEvents(peerRef, socket, roomId, remoteVideoRef);

      await startCamera(localVideoRef, localStreamRef, peerRef);




      socket.on("create-offer", async () => {
        console.log("Creating offer");

        const offer = await peerRef.current.createOffer();

        await peerRef.current.setLocalDescription(offer);

        socket.emit("offer", {
          offer,
          roomId,
        });
      });

      socket.on("offer", async (offer) => {
        console.log("Offer received");

        await peerRef.current.setRemoteDescription(offer);

        const answer = await peerRef.current.createAnswer();

        await peerRef.current.setLocalDescription(answer);

        socket.emit("answer", {
          answer,
          roomId,
        });
      });

      socket.on("answer", async (answer) => {
        console.log("Answer received");

        await peerRef.current.setRemoteDescription(answer);
      });

      socket.on("ice-candidate", async (candidate) => {
        console.log("ICE received");

        try {
          await peerRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error(err);
        }
      });
      if (socket.connected) {
        console.log("Joining room:", roomId);
        socket.emit("join-room", roomId);
      } else {
        socket.on("connect", () => {
          console.log("Connected:", socket.id);
          console.log("Joining room:", roomId);

          socket.emit("join-room", roomId);
        });
      }
    };
socket.on("user-left", () => {
  console.log("User left");

  alert("Other participant left the call");

  navigate("/");
});


    init();




    return () => {
      peerRef.current?.close();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      socket.off("connect");
      socket.off("create-offer");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
    };
  }, [roomId]);


const [isMuted, setIsMuted] = useState(false);
const [isCameraOff, setIsCameraOff] = useState(false);
const [isSharing, setIsSharing] = useState(false);
return (
  
  <div className="h-screen bg-slate-900 relative overflow-hidden">

    {/* Remote Video */}
   <div className="w-full h-full bg-black flex items-center justify-center">
  <video
    ref={remoteVideoRef}
    autoPlay
    playsInline
    className="max-w-full max-h-full object-contain"
  />
</div>

    {/* Local Video */}
    <video
      ref={localVideoRef}
      autoPlay
      playsInline
      muted
      className="
          
  absolute
bottom-28
right-5
w-72
aspect-video
rounded-2xl
border-2
border-white
shadow-2xl
object-cover
bg-black
scale-x-[-1]
      "
    />

    {/* Room ID */}
    <div
      className="
        absolute
        top-5
        left-5
        bg-black/50
        text-white
        px-4
        py-2
        rounded-xl
      "
    >
      Room: {roomId}
    </div>

    {/* Controls */}
    <div
  className="
    absolute
    bottom-5
    left-1/2
    -translate-x-1/2
    flex
    gap-5
  "
><button
  onClick={() => {
    toggleMic(localStreamRef);
    setIsMuted((prev) => !prev);
  }}
  className={`
    w-14 h-14 rounded-full
    flex items-center justify-center
    text-white transition
    ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-slate-700 hover:bg-slate-600"}
  `}
>
  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
</button>

<button
  onClick={() => {
    toggleCamera(localStreamRef);
    setIsCameraOff((prev) => !prev);
  }}
  className={`
    w-14 h-14 rounded-full
    flex items-center justify-center
    text-white transition
    ${isCameraOff ? "bg-red-600 hover:bg-red-700" : "bg-slate-700 hover:bg-slate-600"}
  `}
>
  {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
</button>

  <button
  onClick={() => endCall(peerRef, localStreamRef)}
  className="
    w-14 h-14 rounded-full
    bg-red-600 hover:bg-red-700
    flex items-center justify-center
    text-white transition
  "
>
  <PhoneOff size={24} />
</button>
  <button
  onClick={() => {
    startScreenShare(
      peerRef,
      localVideoRef,
      localStreamRef,
      setIsSharing
    );

   
  }}
  className={`
    w-14 h-14 rounded-full
    flex items-center justify-center
    text-white transition

    ${
      isSharing
        ? "bg-red-600 hover:bg-red-700"
        : "bg-slate-700 hover:bg-slate-600"
    }
  `}
>
  <Monitor size={24} />
</button>
</div>
 </div>
  
);
}
