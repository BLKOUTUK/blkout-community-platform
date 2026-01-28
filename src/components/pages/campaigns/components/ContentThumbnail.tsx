/**
 * Content Thumbnail Component
 * Displays preview thumbnails for campaign content items
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Play,
  FileText,
  Mail,
  Instagram,
  Linkedin,
  MessageCircle,
  Globe,
  Video,
  X,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import type { ContentItem, ContentType, Platform } from '../types';

interface ContentThumbnailProps {
  item: ContentItem;
  size?: 'sm' | 'md' | 'lg';
  showPreview?: boolean;
  className?: string;
}

// Platform colors for placeholder backgrounds
const platformColors: Record<Platform, string> = {
  instagram: 'from-pink-500 to-purple-600',
  twitter: 'from-blue-400 to-blue-600',
  linkedin: 'from-blue-600 to-blue-800',
  tiktok: 'from-gray-900 to-black',
  email: 'from-purple-500 to-purple-700',
  hub: 'from-green-500 to-green-700',
  website: 'from-gray-600 to-gray-800'
};

// Content type icons
const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'video':
      return <Video className="w-6 h-6" />;
    case 'graphic':
      return <Image className="w-6 h-6" />;
    case 'newsletter':
      return <Mail className="w-6 h-6" />;
    case 'article':
      return <FileText className="w-6 h-6" />;
    case 'story':
      return <Play className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

// Platform icons for overlay
const getPlatformIcon = (platform: Platform) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-3 h-3" />;
    case 'linkedin':
      return <Linkedin className="w-3 h-3" />;
    case 'hub':
      return <MessageCircle className="w-3 h-3" />;
    case 'website':
      return <Globe className="w-3 h-3" />;
    default:
      return null;
  }
};

// Size configurations
const sizeConfig = {
  sm: {
    container: 'w-12 h-12',
    icon: 'w-4 h-4',
    badge: 'w-4 h-4 -bottom-1 -right-1'
  },
  md: {
    container: 'w-20 h-20',
    icon: 'w-6 h-6',
    badge: 'w-5 h-5 -bottom-1 -right-1'
  },
  lg: {
    container: 'w-32 h-32',
    icon: 'w-8 h-8',
    badge: 'w-6 h-6 -bottom-2 -right-2'
  }
};

export const ContentThumbnail: React.FC<ContentThumbnailProps> = ({
  item,
  size = 'md',
  showPreview = true,
  className = ''
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const config = sizeConfig[size];
  const hasAsset = item.assetUrl && !imageError;

  // Generate a preview image URL based on content
  const getPreviewUrl = (): string | null => {
    if (item.assetUrl) return item.assetUrl;

    // For social content, we could generate a preview from the text
    // For now, return null to show placeholder
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.div
          className={`${config.container} rounded-lg overflow-hidden cursor-pointer group relative`}
          whileHover={{ scale: 1.05 }}
          onClick={() => showPreview && (previewUrl || item.content) && setIsPreviewOpen(true)}
        >
          {hasAsset && previewUrl ? (
            // Show actual thumbnail
            <img
              src={previewUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            // Show placeholder with gradient and icon
            <div className={`w-full h-full bg-gradient-to-br ${platformColors[item.platform]} flex items-center justify-center text-white/80`}>
              {getContentTypeIcon(item.type)}
            </div>
          )}

          {/* Hover overlay */}
          {showPreview && (previewUrl || item.content) && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Video play indicator */}
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}
        </motion.div>

        {/* Platform badge */}
        <div className={`absolute ${config.badge} bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center border border-gray-200 dark:border-gray-700`}>
          {getPlatformIcon(item.platform)}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <ContentPreviewModal
            item={item}
            previewUrl={previewUrl}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Preview Modal Component
interface ContentPreviewModalProps {
  item: ContentItem;
  previewUrl: string | null;
  onClose: () => void;
}

const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  item,
  previewUrl,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-2xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${platformColors[item.platform]} text-white`}>
                {item.platform}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {item.type}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                item.status === 'published' ? 'bg-green-100 text-green-700' :
                item.status === 'scheduled' ? 'bg-orange-100 text-orange-700' :
                item.status === 'approved' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {item.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Image/Video preview */}
          {previewUrl && (
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {item.type === 'video' ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-64 object-contain"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={item.title}
                  className="w-full max-h-64 object-contain"
                />
              )}
            </div>
          )}

          {/* Text content preview */}
          {item.content && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Preview</h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                  {item.content.length > 1000
                    ? `${item.content.slice(0, 1000)}...`
                    : item.content}
                </pre>
              </div>
            </div>
          )}

          {/* Scheduled info */}
          {item.scheduledFor && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Scheduled:</strong> {new Date(item.scheduledFor).toLocaleString()}
              </p>
              {item.timing && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Original timing: {item.timing}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {item.assetUrl && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={item.assetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              <ExternalLink className="w-4 h-4" />
              Open original asset
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContentThumbnail;
