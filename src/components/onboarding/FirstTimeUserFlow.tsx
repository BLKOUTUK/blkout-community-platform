// BLKOUT Liberation Platform - First Time User Onboarding Flow
// Layer 1: Community Frontend Presentation Layer
// LIBERATION VALUES: Narrative sovereignty with existing scrollytelling integration
// ACCESSIBILITY: Full WCAG 3.0 Bronze compliance with user choice

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Play, Users, BookOpen, Bot, Globe, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/liberation-utils';

interface FirstTimeUserFlowProps {
  onComplete: () => void;
  onSkip: () => void;
  onOpenIVOR?: () => void;
  className?: string;
}

const FirstTimeUserFlow: React.FC<FirstTimeUserFlowProps> = ({
  onComplete,
  onSkip,
  onOpenIVOR,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoice, setUserChoice] = useState<'scrollytelling' | 'quick-start' | null>(null);

  const steps = [
    {
      id: 'welcome',
      title: 'WELCOME TO BLKOUT PLATFORM',
      content: 'Your home for Black queer liberation technology. Built by and for our communities with sovereignty, safety, and collective power at the core.',
      action: 'next'
    },
    {
      id: 'ecosystem',
      title: 'CHOOSE YOUR PATH',
      content: 'Start your journey through our liberation platform.',
      action: 'ecosystem'
    },
    {
      id: 'transition',
      title: 'CONNECTING YOU TO LIBERATION',
      content: 'Opening your selected pathway into the BLKOUT ecosystem...',
      action: 'complete'
    }
  ];

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleEcosystemChoice = (choice: 'scrollytelling' | 'ivor' | 'platform' | 'blkouthub' | 'newsletter') => {
    setCurrentStep(2);

    switch (choice) {
      case 'scrollytelling':
        // Open liberation story experience
        window.open('https://blkout-scrollytelling.vercel.app', '_blank');
        setTimeout(() => completeOnboarding(), 1000);
        break;

      case 'ivor':
        // Open IVOR assistant in this platform
        if (onOpenIVOR) {
          setTimeout(() => {
            completeOnboarding();
            onOpenIVOR();
          }, 1000);
        }
        break;

      case 'platform':
        // Stay on current platform
        setTimeout(() => completeOnboarding(), 1000);
        break;

      case 'blkouthub':
        // Open BLKOUTHUB
        window.open('https://blkouthub.com', '_blank');
        setTimeout(() => completeOnboarding(), 1000);
        break;

      case 'newsletter':
        // Open newsletter signup
        window.open('https://sendfox.com/blkoutuk', '_blank');
        setTimeout(() => completeOnboarding(), 1000);
        break;
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('blkout-has-visited', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('blkout-has-visited', 'true');
    onSkip();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(
          "fixed inset-0 z-50 bg-gradient-to-br from-liberation-black-power via-liberation-purple-spirit to-liberation-black-power",
          "flex items-center justify-center p-4",
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-liberation-silver hover:text-liberation-gold-divine transition-colors z-10"
          aria-label="Skip introduction"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Progress Indicator */}
        <div className="absolute top-6 left-6 flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index <= currentStep ? "bg-liberation-gold-divine" : "bg-liberation-silver bg-opacity-30"
              )}
            />
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="max-w-2xl mx-auto text-center"
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src="/blkout-logo.png"
              alt="BLKOUT Logo"
              className="h-20 w-20 mx-auto rounded-full mb-4"
            />
            <div className="text-2xl font-bold text-liberation-gold-divine">BLKOUT</div>
          </motion.div>

          {/* Step Content */}
          <motion.h1
            id="onboarding-title"
            className="text-3xl md:text-4xl lg:text-5xl font-black text-liberation-gold-divine mb-6 leading-tight"
            style={{
              textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
              WebkitTextStroke: '1px #000'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {steps[currentStep].title}
          </motion.h1>

          <motion.p
            id="onboarding-description"
            className="text-lg md:text-xl text-liberation-silver mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {steps[currentStep].content}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {steps[currentStep].action === 'ecosystem' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto max-h-[70vh] overflow-y-auto px-4">
                {/* Liberation Story */}
                <motion.button
                  onClick={() => handleEcosystemChoice('scrollytelling')}
                  className="group bg-gradient-to-br from-liberation-red-liberation to-liberation-purple-spirit text-white p-6 rounded-xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Liberation Story</h3>
                  <p className="text-liberation-silver text-sm mb-4">
                    Experience our immersive scrollytelling journey through Black queer liberation.
                  </p>
                  <div className="flex items-center justify-center text-liberation-gold-divine font-semibold text-sm">
                    Watch Story
                    <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* IVOR Assistant */}
                <motion.button
                  onClick={() => handleEcosystemChoice('ivor')}
                  className="group bg-gradient-to-br from-liberation-green-africa to-liberation-gold-divine text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Meet IVOR</h3>
                  <p className="text-liberation-black-power opacity-80 text-sm mb-4">
                    Chat with our trauma-informed AI assistant built for our community.
                  </p>
                  <div className="flex items-center justify-center text-liberation-black-power font-semibold text-sm">
                    Start Chat
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* Community Platform */}
                <motion.button
                  onClick={() => handleEcosystemChoice('platform')}
                  className="group bg-gradient-to-br from-liberation-purple-spirit to-liberation-black-power text-white p-6 rounded-xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Community Platform</h3>
                  <p className="text-liberation-silver text-sm mb-4">
                    Explore events, stories, and democratic governance features.
                  </p>
                  <div className="flex items-center justify-center text-liberation-gold-divine font-semibold text-sm">
                    Enter Platform
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* BLKOUTHUB */}
                <motion.button
                  onClick={() => handleEcosystemChoice('blkouthub')}
                  className="group bg-gradient-to-br from-liberation-gold-divine to-liberation-red-liberation text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">BLKOUTHUB</h3>
                  <p className="text-liberation-black-power opacity-80 text-sm mb-4">
                    Join our secure community on Heartbeat.chat with enhanced governance access.
                  </p>
                  <div className="flex items-center justify-center text-liberation-black-power font-semibold text-sm">
                    Visit Hub
                    <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* Newsletter */}
                <motion.button
                  onClick={() => handleEcosystemChoice('newsletter')}
                  className="group bg-gradient-to-br from-liberation-silver to-liberation-purple-spirit text-liberation-black-power p-6 rounded-xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Liberation Newsletter</h3>
                  <p className="text-liberation-black-power opacity-80 text-sm mb-4">
                    Stay connected with our liberation updates and community news.
                  </p>
                  <div className="flex items-center justify-center text-liberation-black-power font-semibold text-sm">
                    Subscribe
                    <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                {/* All Platforms */}
                <motion.button
                  onClick={() => handleEcosystemChoice('platform')}
                  className="group bg-gradient-to-br from-liberation-black-power to-liberation-red-liberation text-white p-6 rounded-xl hover:scale-105 transition-all duration-300 border-2 border-liberation-gold-divine"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <img src="/blkout-logo.png" alt="BLKOUT Logo" className="h-8 w-8 rounded-full" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">I Want It All</h3>
                  <p className="text-liberation-silver text-sm mb-4">
                    Start here and explore the entire ecosystem at your own pace.
                  </p>
                  <div className="flex items-center justify-center text-liberation-gold-divine font-semibold text-sm">
                    Full Access
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </div>
            )}

            {steps[currentStep].action === 'next' && (
              <button
                onClick={handleStepComplete}
                className="bg-liberation-gold-divine text-liberation-black-power px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-colors flex items-center mx-auto"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}

            {steps[currentStep].action === 'complete' && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-16 h-16 border-4 border-liberation-gold-divine border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-liberation-silver mb-2">Connecting you to the BLKOUT ecosystem...</p>
                <p className="text-liberation-gold-divine text-sm">
                  Welcome to liberation-centered technology.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Skip Option at Bottom */}
          {currentStep === 0 && (
            <motion.button
              onClick={handleSkip}
              className="mt-8 text-liberation-silver hover:text-liberation-gold-divine transition-colors text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              I'm already familiar with BLKOUT
            </motion.button>
          )}
        </motion.div>

        {/* Community Values Footer */}
        <motion.div
          className="absolute bottom-6 left-6 right-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-4 text-xs text-liberation-silver opacity-75">
            <span><img src="/blkout-logo.png" alt="BLKOUT Logo" className="inline h-3 w-3 rounded-full mr-1" />Creator Sovereignty</span>
            <span><img src="/blkout-logo.png" alt="BLKOUT Logo" className="inline h-3 w-3 rounded-full mr-1" />Democratic Governance</span>
            <span><img src="/blkout-logo.png" alt="BLKOUT Logo" className="inline h-3 w-3 rounded-full mr-1" />Trauma-Informed Design</span>
            <span><img src="/blkout-logo.png" alt="BLKOUT Logo" className="inline h-3 w-3 rounded-full mr-1" />Community Power</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FirstTimeUserFlow;