export const toggleMic = (localStreamRef) => {
  const audioTrack =
    localStreamRef.current?.getAudioTracks()[0];

  if (audioTrack) {
    audioTrack.enabled = !audioTrack.enabled;

    console.log(
      audioTrack.enabled
        ? "Microphone ON"
        : "Microphone OFF"
    );
  }
};

export const toggleCamera = (localStreamRef) => {
  const videoTrack =
    localStreamRef.current?.getVideoTracks()[0];

  if (videoTrack) {
    videoTrack.enabled = !videoTrack.enabled;

    console.log(
      videoTrack.enabled
        ? "Camera ON"
        : "Camera OFF"
    );
  }
};

export const endCall = (
  peerRef,
  localStreamRef
) => {
  peerRef.current?.close();

  localStreamRef.current
    ?.getTracks()
    .forEach((track) => track.stop());

  window.location.href = "/";
};