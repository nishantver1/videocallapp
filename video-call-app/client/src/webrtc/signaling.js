export const setupPeerEvents = (
  peerRef,
  socket,
  roomId,
  remoteVideoRef
) => {
  peerRef.current.onicecandidate = (
    event
  ) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        roomId,
      });
    }
  };

  peerRef.current.ontrack = (event) => {
    if (
      remoteVideoRef.current &&
      event.streams.length > 0
    ) {
      remoteVideoRef.current.srcObject =
        event.streams[0];
    }
  };
};