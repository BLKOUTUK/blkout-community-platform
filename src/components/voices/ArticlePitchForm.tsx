import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ArticlePitchFormProps {
  onClose?: () => void;
}

interface PitchFormData {
  name: string;
  email: string;
  title: string;
  category: string;
  pitch: string;
  wordCount: string;
  deadline: string;
}

const ArticlePitchForm: React.FC<ArticlePitchFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<PitchFormData>({
    name: '',
    email: '',
    title: '',
    category: 'opinion',
    pitch: '',
    wordCount: '',
    deadline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    { value: 'opinion', label: 'Opinion' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'community', label: 'Community Voice' },
    { value: 'liberation', label: 'Liberation Thought' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/voices/submit-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit pitch');
      }

      setSubmitStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          title: '',
          category: 'opinion',
          pitch: '',
          wordCount: '',
          deadline: ''
        });
        setSubmitStatus('idle');
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting pitch:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-liberation-black-power/95 backdrop-blur-sm border border-liberation-silver/20 rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-liberation-gold-divine mb-2">
            Pitch Your Article
          </h2>
          <p className="text-liberation-silver/70">
            Share your voice with the community. We're looking for bold, liberation-centered perspectives.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-liberation-silver/50 hover:text-liberation-silver transition-colors"
            aria-label="Close form"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-liberation-silver mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver placeholder-liberation-silver/40 focus:outline-none focus:border-liberation-gold-divine transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-liberation-silver mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver placeholder-liberation-silver/40 focus:outline-none focus:border-liberation-gold-divine transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Article Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-liberation-silver mb-2">
            Article Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver placeholder-liberation-silver/40 focus:outline-none focus:border-liberation-gold-divine transition-colors"
            placeholder="What's your article about?"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-liberation-silver mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver focus:outline-none focus:border-liberation-gold-divine transition-colors"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pitch */}
        <div>
          <label htmlFor="pitch" className="block text-sm font-semibold text-liberation-silver mb-2">
            Your Pitch *
          </label>
          <textarea
            id="pitch"
            name="pitch"
            required
            rows={6}
            value={formData.pitch}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver placeholder-liberation-silver/40 focus:outline-none focus:border-liberation-gold-divine transition-colors resize-none"
            placeholder="Tell us about your article idea. What perspective are you bringing? Why does this matter to the community?"
          />
        </div>

        {/* Word Count and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wordCount" className="block text-sm font-semibold text-liberation-silver mb-2">
              Proposed Word Count
            </label>
            <input
              type="text"
              id="wordCount"
              name="wordCount"
              value={formData.wordCount}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver placeholder-liberation-silver/40 focus:outline-none focus:border-liberation-gold-divine transition-colors"
              placeholder="e.g., 800-1200 words"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-liberation-silver mb-2">
              Preferred Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-liberation-black-power border border-liberation-silver/30 rounded-lg text-liberation-silver focus:outline-none focus:border-liberation-gold-divine transition-colors"
            />
          </div>
        </div>

        {/* Submit Status Messages */}
        {submitStatus === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">
              Your pitch has been submitted successfully! We'll review it and get back to you soon.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">
              {errorMessage || 'Failed to submit your pitch. Please try again.'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-4 bg-liberation-gold-divine text-liberation-black-power rounded-lg font-bold text-lg hover:bg-liberation-gold-divine/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Pitch
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ArticlePitchForm;
