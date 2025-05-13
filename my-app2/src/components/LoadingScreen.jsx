import React from "react";
import Lottie from 'lottie-react';
import animationData from '../assets/loading-animation.json';

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-animation">
      <Lottie animationData={animationData} loop={true} />
    </div>
  </div>
);

export default LoadingScreen;
