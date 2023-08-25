
import "./homepage.css"


import React, { useState, useRef } from 'react';

function Homepage({updateUser}) {
  const [webcamStream, setWebcamStream] = useState(null);
  const [webcamRecorder, setWebcamRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);



  const webcamVideoRef = useRef();

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{width:640, height:360}, audio: true });
    setWebcamStream(stream);
    webcamVideoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    setWebcamRecorder(recorder);
    
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        // video: { mediaSource: 'screen' },
        video: true,

        audio: true,
       
      });
     
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.start();
      setRecording(true);
      
    } 
    catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording1 = (recorder, stream) => {
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }; 

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setMediaStream(null);

    const recorder = recordedChunks.length > 0 ? new MediaRecorder() : null;
    if (recorder) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded-video.webm';
      a.click();
    }

    setRecordedChunks([]);
    setRecording(false);
  };


  const handleWebcamStart = () => {
    startWebcam();
  };

  const handleWebcamStop = () => {
    stopRecording1(webcamRecorder, webcamStream);
  };

  
  return (
    
    <div className="homepage">
      <h1 align="center">Screen Recording App</h1>  
      <button class="button" onClick={handleWebcamStart}>Start Webcam</button>
      <button class="button" onClick={handleWebcamStop}>Stop Webcam</button>
      <video ref={webcamVideoRef} autoPlay playsInline muted />
      {recording ? (
        <button class="button" onClick={stopRecording}>Stop recording</button>
      ) : (
        <button class="button" onClick={startRecording}>Start Recording</button>
      )}
      {recordedChunks.length > 0 && (
        <video controls width= "640px" >
          <source src={URL.createObjectURL(recordedChunks[0])} type="video/webm" />
        </video>
      )}
      <div className="button" onClick={() => updateUser({})} >Logout</div>
    </div>
    
    
  );
}


export default Homepage;