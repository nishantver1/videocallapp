export const startScreenShare = async (
  peerRef,
  localVideoRef,
  localStreamRef,
   setIsSharing
) => {
  const screenStream =
    await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
setIsSharing(true);
  const screenTrack =
    screenStream.getVideoTracks()[0];

  const sender =
    peerRef.current
      .getSenders()
      .find(
        (sender) =>
          sender.track &&
          sender.track.kind === "video"
      );

  if (sender) {
    sender.replaceTrack(screenTrack);
  }

  localVideoRef.current.srcObject =
    screenStream;

  screenTrack.onended = () => {
    console.log(
      "Screen sharing stopped"
      
    );

    const cameraTrack =
      localStreamRef.current.getVideoTracks()[0];

    if (sender) {
      sender.replaceTrack(cameraTrack);
    }

    localVideoRef.current.srcObject =
      localStreamRef.current;
      setIsSharing(false);
  };
};