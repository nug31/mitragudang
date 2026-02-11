import React, { useEffect, useState } from 'react';
import { Warehouse, Package, Box, Boxes } from 'lucide-react';
import { APP_NAME } from '../../config';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDuration = 4000 // Increased from 2500 to 4000ms (4 seconds)
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress - slower animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1; // Changed from +2 to +1 for slower progress
      });
    }, 50); // Changed from 30ms to 50ms for slower animation

    // Hide splash screen after minimum duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade-out animation
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete, minDuration]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 z-[9999] animate-fade-out pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Warehouse Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Pattern - Warehouse Shelves */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Floating Warehouse Icons */}
        <div className="absolute top-10 left-10 opacity-20 animate-float">
          <Package className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-20 right-20 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
          <Box className="w-20 h-20 text-white" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Boxes className="w-24 h-24 text-white" />
        </div>
        <div className="absolute bottom-32 right-32 opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>
          <Package className="w-18 h-18 text-white" />
        </div>

        {/* Animated background particles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
        {/* Logo with Netflix-style animation */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-2xl opacity-50">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full animate-pulse" />
          </div>

          {/* Logo icon */}
          <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl animate-scale-in">
            <Warehouse className="w-24 h-24 text-white drop-shadow-2xl" strokeWidth={1.5} />
          </div>
        </div>

        {/* App name with typing effect */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {APP_NAME}
          </h1>
          <p className="text-xl text-white/80 font-medium animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Inventory Management System
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-64 md:w-80 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 rounded-full transition-all duration-300 ease-out shadow-lg shadow-primary-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-white/60 text-sm mt-3 font-medium">
            Loading... {progress}%
          </p>
        </div>

        {/* Tagline */}
        <p className="text-white/50 text-sm animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          Powered by JS Nugroho
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 animate-shimmer" />
    </div>
  );
};

export default SplashScreen;

