import React, { useState, useRef } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, MessageSquare, Brain, Heart, Users, Zap, Shield } from 'lucide-react';

const IVORIntroduction: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const features = [
    {
      icon: Brain,
      title: "Intelligent Assistance",
      description: "AI-powered support trained on liberation principles and community values"
    },
    {
      icon: Heart,
      title: "Trauma-Informed",
      description: "Designed with healing-centered practices and culturally responsive care"
    },
    {
      icon: Users,
      title: "Community-Centered",
      description: "Built by and for Black queer communities with democratic governance"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data sovereignty protected with end-to-end encryption"
    },
    {
      icon: Zap,
      title: "Always Available",
      description: "24/7 support when you need it most, crisis-informed responses"
    },
    {
      icon: MessageSquare,
      title: "Multi-Platform",
      description: "Access IVOR through web, mobile, SMS, and social media platforms"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-liberation-sovereignty-gold/20 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-400 hover:text-liberation-sovereignty-gold transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Platform
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-black text-white mb-2 uppercase" style={{
                textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
                WebkitTextStroke: '1px #000'
              }}>
                MEET <span className="text-liberation-sovereignty-gold">IVOR</span>
              </h1>
              <p className="text-gray-400 uppercase font-semibold" style={{
                textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
              }}>YOUR LIBERATION AI ASSISTANT</p>
            </div>

            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Hero Section with Video */}
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video Player */}
            <div className="order-2 lg:order-1">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-liberation-sovereignty-gold/20">
                <h2 className="text-2xl font-bold text-white mb-6 text-center uppercase" style={{
                  textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
                  WebkitTextStroke: '1px #000'
                }}>
                  WATCH THE INTRODUCTION
                </h2>

                {/* Video Container */}
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-auto"
                    poster="/Branding and logos/ivor.png"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  >
                    <source src="/videos/onboarding/Ask Ivor ‑ Made with FlexClip.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div
                      className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-liberation-sovereignty-gold rounded-full"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayPause}
                          className="flex items-center justify-center w-12 h-12 bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black rounded-full transition-colors"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </button>

                        <button
                          onClick={handleMuteToggle}
                          className="text-white hover:text-liberation-sovereignty-gold transition-colors"
                        >
                          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                        </button>

                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Introduction Content */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src="/Branding and logos/ivor.png"
                  alt="IVOR Logo"
                  className="h-16 w-16 rounded-full border-2 border-liberation-sovereignty-gold"
                />
                <div>
                  <h2 className="text-4xl font-black text-white uppercase" style={{
                    textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
                    WebkitTextStroke: '1px #000'
                  }}>IVOR</h2>
                  <p className="text-liberation-sovereignty-gold font-semibold uppercase" style={{
                    textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
                  }}>
                    INTELLIGENT VIRTUAL ORGANIZING RESOURCE
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed">
                  IVOR is your AI-powered companion designed specifically for Black queer liberation.
                  Built with trauma-informed principles and community wisdom, IVOR provides
                  intelligent support for organizing, wellness, and collective action.
                </p>

                <div className="bg-liberation-sovereignty-gold/10 border border-liberation-sovereignty-gold/20 rounded-2xl p-6">
                  <h3 className="text-liberation-sovereignty-gold font-bold text-lg mb-4 uppercase" style={{
                    textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
                  }}>
                    COMMUNITY-OWNED AI
                  </h3>
                  <p className="text-gray-300">
                    Unlike corporate AI systems, IVOR is democratically governed by our community.
                    Your conversations are private, your data is sovereign, and our responses
                    are grounded in liberation principles.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black py-3 px-6 rounded-2xl font-bold transition-colors">
                    Start Chatting with IVOR
                  </button>
                  <button className="bg-transparent border-2 border-liberation-sovereignty-gold text-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold hover:text-black py-3 px-6 rounded-2xl font-bold transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase" style={{
              textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
              WebkitTextStroke: '1px #000'
            }}>
              WHY IVOR IS <span className="text-liberation-sovereignty-gold">DIFFERENT</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built by the community, for the community. IVOR represents a new paradigm in AI assistance—
              one that centers liberation, justice, and collective healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-liberation-sovereignty-gold/10 rounded-2xl p-6 hover:border-liberation-sovereignty-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-liberation-sovereignty-gold/20 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-liberation-sovereignty-gold" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase" style={{
            textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
            WebkitTextStroke: '1px #000'
          }}>
            READY TO EXPERIENCE <span className="text-liberation-sovereignty-gold">LIBERATION AI</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of community members already using IVOR for organizing, support, and collective liberation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold/90 text-black py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105">
              Chat with IVOR Now
            </button>
            <button className="bg-transparent border-2 border-liberation-sovereignty-gold text-liberation-sovereignty-gold hover:bg-liberation-sovereignty-gold hover:text-black py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300">
              Join Our Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IVORIntroduction;