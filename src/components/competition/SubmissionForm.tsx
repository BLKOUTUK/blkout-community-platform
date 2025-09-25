import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Image, X, ArrowLeft, Check, Info } from 'lucide-react';
import type { CompetitionTheme } from './PhotoCompetitionModal';

interface SubmissionFormProps {
  themes: readonly CompetitionTheme[];
  selectedTheme: CompetitionTheme;
  onThemeSelect: (theme: CompetitionTheme) => void;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  themes,
  selectedTheme,
  onThemeSelect,
  onSubmit,
  onBack,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artistStatement, setArtistStatement] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title || !selectedTheme || !agreedToTerms) {
      alert('Please fill in all required fields and agree to the terms');
      return;
    }

    const formData = {
      file: selectedFile,
      title,
      description,
      artistStatement,
      theme: selectedTheme,
      timestamp: new Date().toISOString()
    };

    onSubmit(formData);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Competition Home</span>
      </button>

      {/* Form Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Submit Your Photo</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share your vision and join our community of creative liberation
        </p>
      </div>

      {/* Theme Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Select Theme <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((theme) => (
            <motion.button
              key={theme}
              type="button"
              onClick={() => onThemeSelect(theme)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTheme === theme
                  ? 'border-liberation-pride-purple bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">{theme}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {theme === 'Black' ? 'Heritage & Power' :
                 theme === 'Out' ? 'Pride & Joy' :
                 'Future & Innovation'}
              </p>
              {selectedTheme === theme && (
                <Check className="w-4 h-4 text-liberation-pride-purple mt-2 mx-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Upload Photo <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-liberation-pride-purple transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Click to upload your photo</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              JPG, PNG or GIF (max 10MB) • Min resolution: 1920x1080
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={previewUrl!}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              type="button"
              onClick={removeSelectedFile}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Photo Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Photo Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          placeholder="Give your photo a meaningful title"
          maxLength={100}
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{title.length}/100 characters</p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          rows={3}
          placeholder="Tell us about your photo (optional)"
          maxLength={300}
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{description.length}/300 characters</p>
      </div>

      {/* Artist Statement */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Artist Statement
        </label>
        <textarea
          value={artistStatement}
          onChange={(e) => setArtistStatement(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-liberation-pride-purple"
          rows={4}
          placeholder="Share your creative vision and what this photo means to you (optional)"
          maxLength={500}
        />
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{artistStatement.length}/500 characters</p>
      </div>

      {/* Terms Agreement */}
      <div className="mb-8">

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            I agree to the competition terms and confirm that this is my original work.
            I understand that BLKOUT's liberation-focused values guide all competition decisions.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>

        <motion.button
          type="submit"
          disabled={isLoading || !selectedFile || !title || !selectedTheme || !agreedToTerms}
          className="px-6 py-3 bg-liberation-pride-purple text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit Photo'
          )}
        </motion.button>
      </div>
    </form>
  );
};