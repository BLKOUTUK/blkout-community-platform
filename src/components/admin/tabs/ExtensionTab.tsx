/**
 * Extension Tab Component
 * Chrome extension download, installation instructions, and feature overview
 */

import React from 'react';
import { Chrome, Download, CheckCircle } from 'lucide-react';

export const ExtensionTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Chrome Extension</h2>

      {/* Download Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <Chrome className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">BLKOUT Moderator Tools v2.2.0</h3>
            <p className="text-gray-300">Dual-platform support - Submit news articles and events directly from any webpage</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <a
            href="/blkout-moderator-tools-v2.2.0.zip"
            download="blkout-moderator-tools-v2.2.0.zip"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download v2.2.0 (.zip)
          </a>
        </div>

        {/* What's New */}
        <WhatsNewSection />
      </div>

      {/* Installation Instructions */}
      <InstallationInstructions />

      {/* Features Overview */}
      <FeaturesOverview />
    </div>
  );
};

// What's New Section
const WhatsNewSection: React.FC = () => (
  <div className="bg-green-900/20 backdrop-blur-md rounded-lg p-4 border border-green-500/30 mb-4">
    <h4 className="text-lg font-semibold text-white mb-3">🚀 What's New in v2.2.0</h4>
    <div className="space-y-2 text-gray-300 text-sm">
      <p>• ✅ Dual-platform support: Submit to both news platform and events calendar</p>
      <p>• ✅ Intelligent API routing based on content type (Event/News/Story)</p>
      <p>• ✅ Event-specific fields: Date, time, location, capacity auto-extraction</p>
      <p>• ✅ Smart content type detection with keyword analysis</p>
      <p>• ✅ Fixed null reference error and duplicate context menu issues</p>
      <p>• ✅ Enhanced success messages indicating target platform</p>
    </div>
  </div>
);

// Installation Instructions Component
const InstallationInstructions: React.FC = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
    <h3 className="text-xl font-semibold text-white mb-4">Installation Instructions</h3>

    <div className="space-y-4">
      <InstallStep
        number={1}
        title="Download & Extract Extension"
        description="Click the download button above to get the extension package, then extract the zip file"
        color="bg-yellow-500"
      />

      <InstallStep
        number={2}
        title="Enable Developer Mode"
        description="Go to chrome://extensions/ and toggle 'Developer mode' in the top right"
        color="bg-yellow-500"
      />

      <InstallStep
        number={3}
        title="Load Extension"
        description="Click 'Load unpacked' and select the extracted extension folder"
        color="bg-yellow-500"
      />

      <InstallStep
        number={4}
        title="Start Using"
        description="Navigate to any webpage and click the extension icon to submit content"
        color="bg-green-500"
      />
    </div>
  </div>
);

// Install Step Component
interface InstallStepProps {
  number: number;
  title: string;
  description: string;
  color: string;
}

const InstallStep: React.FC<InstallStepProps> = ({ number, title, description, color }) => (
  <div className="flex gap-4">
    <div className={`flex-shrink-0 w-8 h-8 ${color} rounded-full flex items-center justify-center text-black font-bold`}>
      {number}
    </div>
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

// Features Overview Component
const FeaturesOverview: React.FC = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
    <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FeatureItem
        title="Dual-Platform Routing"
        description="Events → Events Calendar API, News/Stories → News Platform API"
      />
      <FeatureItem
        title="Auto Content Extraction"
        description="Automatically extracts title, summary, images, dates, and locations"
      />
      <FeatureItem
        title="Smart Type Detection"
        description="Keyword analysis auto-suggests Event/News/Story based on page content"
      />
      <FeatureItem
        title="Offline Support"
        description="Saves submissions locally if API is unavailable, syncs when online"
      />
    </div>
  </div>
);

// Feature Item Component
interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

export default ExtensionTab;
