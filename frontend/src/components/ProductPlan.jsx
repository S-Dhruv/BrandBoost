import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const ProductPlan = () => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  const [images, setImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null); // Ref to manage the camera stream

  // Camera Management with useEffect
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [cameraActive, cameraFacing]);

  // Start Camera Function
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraFacing
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream; // Store the stream in streamRef
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraActive(false);
    }
  };

  // Stop Camera Function
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop()); // Stop all tracks
      streamRef.current = null; // Clear the stream reference
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Clear the video source
    }
  };

  // Toggle Camera On/Off
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  // Switch Camera Facing (Front/Back)
  const switchCameraFacing = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Capture Image from Camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        
        setImages(prevImages => [...prevImages, { 
          blob: blob,
          preview: imageUrl,
          type: 'image/jpeg'
        }]);
      }, 'image/jpeg', 0.8);
    }
  };

  // Handle File Input for Image Uploads
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      const newImages = newFiles.map(file => ({
        blob: file,
        preview: URL.createObjectURL(file),
        type: file.type
      }));
      
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  // Remove Image from List
  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // Submit Form to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please provide a prompt text');
      return;
    }
    
    if (!GEMINI_API_KEY) {
      alert('API key is missing. Please check your environment variables.');
      return;
    }
    
    setLoading(true);
    
    try {
      const imagePromises = images.map(image => 
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
              mime_type: image.type,
              data: base64Data
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(image.blob);
        })
      );
      
      const imageDataArray = await Promise.all(imagePromises);
      
      const parts = [];
      
      imageDataArray.forEach(imgData => {
        parts.push({
          inline_data: imgData
        });
      });
      
      parts.push({
        text: prompt
      });
      
      const payload = {
        contents: [{
          parts: parts
        }]
      };
      
      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const responseText = result.data.candidates[0].content.parts[0].text;
      setResponse(responseText);
      
      saveToLocalStorage(prompt, responseText);
      
      setImages([]);
      setPrompt('');
    } catch (error) {
      console.error('Error processing request:', error);
      setResponse('Error: Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save Chat to Local Storage
  const saveToLocalStorage = (userPrompt, modelResponse) => {
    const existingChats = JSON.parse(localStorage.getItem('businesschats')) || [];
    
    const newChat = [
      {
        "role": "user",
        "parts": [{
          "text": userPrompt
        }]
      },
      {
        "role": "model",
        "parts": [{
          "text": modelResponse
        }]
      }
    ];
    
    existingChats.push(newChat);
    
    localStorage.setItem('businesschats', JSON.stringify(existingChats));
  };

  // JSX Rendering
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Product Planner</h1>
      
      <div className="mb-6 p-4 border border-gray-300 rounded-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Camera Controls</h2>
          <div className="flex space-x-2 mb-3">
            <button 
              onClick={toggleCamera}
              className={`px-4 py-2 rounded-md text-white ${cameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
            </button>
            
            {cameraActive && (
              <button 
                onClick={switchCameraFacing}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Switch Camera
              </button>
            )}
          </div>
          
          {cameraActive ? (
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-64 bg-black object-cover rounded-md"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="mt-2">
                <button 
                  onClick={captureImage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Capture Image
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
              <p className="text-gray-500">Camera is turned off</p>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Upload Images</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileInput}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        {images.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Selected Images ({images.length})</h2>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image.preview} 
                    alt={`Preview ${index}`} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            required
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Processing...' : 'Generate Product Plan'}
        </button>
      </div>
      
      {response && (
        <div className="p-4 border border-gray-300 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Generated Plan</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPlan;