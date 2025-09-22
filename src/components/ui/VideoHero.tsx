// BLKOUT Liberation Platform - Video Hero Component
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Visual storytelling and narrative sovereignty
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance with video controls

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface VideoHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  videos: string[];
  textColor?: 'light' | 'dark';
  overlayOpacity?: number;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const VideoHero: React.FC<VideoHeroProps> = ({
  title,
  subtitle,
  description,
  videos,
  textColor = 'light',
  overlayOpacity = 0.6,
  height = 'lg',
  className,
  children
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRefs, setVideoRefs] = useState<(HTMLVideoElement | null)[]>([]);

  // Cycle through videos
  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  // Update video refs array when videos change
  useEffect(() => {
    setVideoRefs(new Array(videos.length).fill(null));
  }, [videos.length]);

  const setVideoRef = (index: number) => (ref: HTMLVideoElement | null) => {
    setVideoRefs(prev => {
      const newRefs = [...prev];
      newRefs[index] = ref;
      return newRefs;
    });
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs[currentVideoIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    videoRefs.forEach(video => {
      if (video) {
        video.muted = !isMuted;
      }
    });
    setIsMuted(!isMuted);
  };

  const heightClasses = {
    sm: 'h-64 md:h-80',
    md: 'h-80 md:h-96',
    lg: 'h-96 md:h-[32rem]',
    xl: 'h-[32rem] md:h-[40rem]'
  };

  const textColorClasses = {
    light: 'text-liberation-silver',
    dark: 'text-liberation-black-power'
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl',
      heightClasses[height],
      className
    )}>
      {/* Video Background */}
      <div className="absolute inset-0">
        {videos.map((video, index) => (
          <motion.video
            key={video}
            ref={setVideoRef(index)}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentVideoIndex ? 1 : 0,
              scale: index === currentVideoIndex ? 1 : 1.1
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
            onLoadedData={() => {
              const video = videoRefs[index];
              if (video && index === currentVideoIndex && isPlaying) {
                video.play();
              }
            }}
            aria-label={`Background video ${index + 1} of ${videos.length}`}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        ))}
      </div>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-liberation-black-power"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 md:px-8 z-10">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className={cn(
            'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6',
            'leading-tight tracking-tight',
            textColor === 'light' ? 'text-liberation-gold-divine' : 'text-liberation-black-power',
            'drop-shadow-2xl'
          )}>
            {title}
          </h1>

          {subtitle && (
            <motion.h2
              className={cn(
                'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4',
                'uppercase tracking-wider',
                textColorClasses[textColor],
                'drop-shadow-lg'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {subtitle}
            </motion.h2>
          )}

          {description && (
            <motion.p
              className={cn(
                'text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8',
                'leading-relaxed max-w-3xl mx-auto',
                textColorClasses[textColor],
                'drop-shadow-md'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-liberation-black-power bg-opacity-70 text-liberation-silver p-2 rounded-full hover:bg-opacity-90 transition-colors backdrop-blur-sm"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="bg-liberation-black-power bg-opacity-70 text-liberation-silver p-2 rounded-full hover:bg-opacity-90 transition-colors backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Video Indicators */}
      {videos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentVideoIndex
                  ? 'bg-liberation-gold-divine scale-125'
                  : 'bg-liberation-silver bg-opacity-50 hover:bg-opacity-80'
              )}
              aria-label={`Switch to video ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Accessibility: Screen reader description */}
      <div className="sr-only">
        Hero section with rotating background videos featuring {title}.
        {videos.length > 1 && `Currently showing video ${currentVideoIndex + 1} of ${videos.length}.`}
        Video controls available in bottom right corner.
      </div>
    </div>
  );
};

export default VideoHero;