import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

const InstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already installed, not installable, or user dismissed
  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await promptInstall();
    if (!success) {
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-liberation-gold-divine text-liberation-black-power p-4 rounded-xl shadow-lg border-2 border-liberation-sovereignty-gold z-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <h3 className="font-bold text-sm">Install Liberation Platform</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-liberation-black-power/60 hover:text-liberation-black-power touch-friendly p-1"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs mb-3 text-liberation-black-power/80">
        Add BLKOUT to your home screen for faster access to community liberation.
      </p>

      <div className="flex space-x-2">
        <button
          onClick={handleInstall}
          className="flex-1 bg-liberation-black-power text-liberation-gold-divine py-2 px-3 rounded-lg text-xs font-semibold hover:bg-opacity-80 transition-colors touch-friendly flex items-center justify-center space-x-1"
        >
          <Download className="h-3 w-3" />
          <span>Install App</span>
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-xs text-liberation-black-power/60 hover:text-liberation-black-power transition-colors touch-friendly"
        >
          Later
        </button>
      </div>

      {/* Liberation Values Badge */}
      <div className="mt-2 text-xs text-liberation-black-power/60">
        ✊🏾 Creator Sovereignty • 🗳️ Democratic Governance
      </div>
    </div>
  );
};

export default InstallPrompt;