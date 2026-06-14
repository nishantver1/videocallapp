export const startCamera = async (
  localVideoRef,
  localStreamRef,
  peerRef
) => {
  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

  localStreamRef.current = stream;

  localVideoRef.current.srcObject = stream;

  stream.getTracks().forEach((track) => {
    peerRef.current.addTrack(track, stream);
  });
};