// BLKOUT Liberation Platform - Proposal Submission Form
// Layer 1: Community Frontend Presentation Layer
// STRICT SEPARATION: Presentation component only - NO business logic

import React, { useState, useEffect } from 'react';
import {
  Vote,
  FileText,
  Calendar,
  AlertTriangle,
  Heart,
  Shield,
  DollarSign,
  Users,
  Info,
  Clock,
  CheckCircle
} from 'lucide-react';
import { LiberationButton } from '@/components/ui/liberation-button';
import { TraumaInformedContainer } from '@/components/protection/trauma-informed-container';
import {
  cn,
  governanceUtils,
  accessibilityUtils,
  traumaInformedUtils,
  liberationColors,
  dateUtils
} from '@/lib/liberation-utils';
import { communityAPI } from '@/services/community-api';
import type {
  ProposalSubmission,
  ProposalResult,
  BaseComponentProps
} from '@/types/liberation';

/**
 * QI COMPLIANCE: Proposal Submission Form Component
 * BOUNDARY ENFORCEMENT: Only submits data through Layer 2 API Gateway
 * LIBERATION VALUES: Democratic participation with trauma-informed design
 * ACCESSIBILITY: WCAG 3.0 Bronze compliant with comprehensive form accessibility
 * CULTURAL AUTHENTICITY: Community empowerment and collective decision-making
 */

export interface ProposalSubmissionFormProps extends BaseComponentProps {
  readonly onSubmissionComplete?: (result: ProposalResult) => void;
  readonly onCancel?: () => void;
  readonly traumaInformedMode?: boolean;
  readonly showLiberationValues?: boolean;
}

export const ProposalSubmissionForm: React.FC<ProposalSubmissionFormProps> = ({
  onSubmissionComplete,
  onCancel,
  traumaInformedMode = true,
  showLiberationValues = true,
  className,
  'data-testid': testId,
  ...props
}) => {
  // QI COMPLIANCE: State for presentation data only - NO business logic
  const [formData, setFormData] = useState<ProposalSubmission>({
    title: '',
    description: '',
    category: 'platform_governance',
    priorityLevel: 'medium',
    votingType: 'consensus',
    consensusThreshold: 0.80,
    votingDeadline: '',
    anonymousVotingAllowed: true,
    resourceRequirements: {},
    creatorSovereigntyImpact: 0,
    communitySafetyImpact: 0,
    culturalAuthenticityImpact: 0,
    democraticGovernanceImpact: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showImpactHelp, setShowImpactHelp] = useState(false);

  // Trauma-informed progress tracking
  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Set default voting deadline (7 days from now)
  useEffect(() => {
    if (!formData.votingDeadline) {
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 7);
      setFormData(prev => ({
        ...prev,
        votingDeadline: defaultDeadline.toISOString().slice(0, 16) // format for datetime-local input
      }));
    }
  }, [formData.votingDeadline]);

  // QI COMPLIANCE: Form validation (presentation layer only)
  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.title.trim()) {
          errors.title = 'Proposal title is required';
        } else if (formData.title.length < 10) {
          errors.title = 'Title must be at least 10 characters';
        } else if (formData.title.length > 200) {
          errors.title = 'Title must be no more than 200 characters';
        }

        if (!formData.description.trim()) {
          errors.description = 'Proposal description is required';
        } else if (formData.description.length < 50) {
          errors.description = 'Description must be at least 50 characters for community clarity';
        }

        if (!formData.category) {
          errors.category = 'Category is required for proper governance routing';
        }
        break;

      case 2: // Voting Configuration
        if (!formData.votingDeadline) {
          errors.votingDeadline = 'Voting deadline is required';
        } else {
          const deadline = new Date(formData.votingDeadline);
          const now = new Date();
          const minDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

          if (deadline < minDeadline) {
            errors.votingDeadline = 'Voting deadline must be at least 24 hours in the future';
          }
        }

        if (formData.votingType === 'consensus' &&
            (formData.consensusThreshold! < 0.51 || formData.consensusThreshold! > 1.0)) {
          errors.consensusThreshold = 'Consensus threshold must be between 51% and 100%';
        }
        break;

      case 3: // Liberation Values Impact
        // Optional validation - values can be neutral (0)
        if (formData.creatorSovereigntyImpact! < -1 || formData.creatorSovereigntyImpact! > 1) {
          errors.creatorSovereigntyImpact = 'Impact must be between -1 (negative) and 1 (positive)';
        }
        break;

      case 4: // Review
        // Final validation happens here
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ProposalSubmission, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // BOUNDARY ENFORCEMENT: Only submit through Layer 2 API Gateway
      const result = await communityAPI.submitProposal(formData);

      if (result.success) {
        onSubmissionComplete?.(result);
      } else {
        setError(result.message || 'Failed to submit proposal');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Information
  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold font-liberation text-liberation-black-power mb-2">
          Share Your Proposal
        </h3>
        <p className="text-sm opacity-70">
          Help shape our community through democratic participation
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="proposal-title"
          className="block text-sm font-medium text-liberation-black-power"
        >
          Proposal Title *
        </label>
        <input
          id="proposal-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple',
            validationErrors.title ? 'border-red-500' : 'border-gray-300',
            traumaInformedMode && traumaInformedUtils.getSafeTransition('medium')
          )}
          placeholder="Enter a clear, descriptive title for your proposal"
          maxLength={200}
          aria-describedby={validationErrors.title ? 'title-error' : 'title-help'}
          aria-invalid={!!validationErrors.title}
        />
        <div className="flex justify-between text-xs">
          <span id="title-help" className="text-gray-500">
            {formData.title.length}/200 characters
          </span>
          {validationErrors.title && (
            <span id="title-error" className="text-red-500">
              {validationErrors.title}
            </span>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="proposal-category"
          className="block text-sm font-medium text-liberation-black-power"
        >
          Category *
        </label>
        <select
          id="proposal-category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple',
            validationErrors.category ? 'border-red-500' : 'border-gray-300'
          )}
          aria-describedby="category-help"
        >
          <option value="platform_governance">Platform Governance</option>
          <option value="community_guidelines">Community Guidelines</option>
          <option value="resource_allocation">Resource Allocation</option>
          <option value="policy_change">Policy Change</option>
          <option value="creator_compensation">Creator Compensation</option>
          <option value="safety_measures">Safety Measures</option>
        </select>
        <p id="category-help" className="text-xs text-gray-500">
          Choose the category that best describes your proposal
        </p>
        {validationErrors.category && (
          <p className="text-xs text-red-500">{validationErrors.category}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="proposal-description"
          className="block text-sm font-medium text-liberation-black-power"
        >
          Detailed Description *
        </label>
        <textarea
          id="proposal-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={6}
          className={cn(
            'w-full px-3 py-2 border rounded-lg resize-vertical',
            'focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple',
            validationErrors.description ? 'border-red-500' : 'border-gray-300',
            traumaInformedMode && traumaInformedUtils.getSafeTransition('medium')
          )}
          placeholder="Describe your proposal in detail. What change do you want to see? Why is it important? How will it benefit the community?"
          aria-describedby={validationErrors.description ? 'description-error' : 'description-help'}
          aria-invalid={!!validationErrors.description}
        />
        <div className="flex justify-between text-xs">
          <span id="description-help" className="text-gray-500">
            Minimum 50 characters for community clarity
          </span>
          <span className={cn(
            formData.description.length < 50 ? 'text-red-500' : 'text-green-600'
          )}>
            {formData.description.length} characters
          </span>
        </div>
        {validationErrors.description && (
          <p id="description-error" className="text-xs text-red-500">
            {validationErrors.description}
          </p>
        )}
      </div>

      {/* Priority Level */}
      <div className="space-y-2">
        <label
          htmlFor="proposal-priority"
          className="block text-sm font-medium text-liberation-black-power"
        >
          Priority Level
        </label>
        <select
          id="proposal-priority"
          value={formData.priorityLevel}
          onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple"
          aria-describedby="priority-help"
        >
          <option value="low">Low - General improvement</option>
          <option value="medium">Medium - Significant enhancement</option>
          <option value="high">High - Important change</option>
          <option value="critical">Critical - Urgent community need</option>
        </select>
        <p id="priority-help" className="text-xs text-gray-500">
          How urgent is this change for the community?
        </p>
      </div>
    </div>
  );

  // Step 2: Voting Configuration
  const renderVotingConfiguration = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold font-liberation text-liberation-black-power mb-2">
          Voting Setup
        </h3>
        <p className="text-sm opacity-70">
          Configure how the community will decide on your proposal
        </p>
      </div>

      {/* Voting Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-liberation-black-power">
          Voting Mechanism *
        </label>
        <div className="space-y-3">
          {[
            {
              value: 'consensus',
              label: 'Consensus (Recommended)',
              description: 'Requires broad community agreement with configurable threshold',
              icon: Users
            },
            {
              value: 'majority',
              label: 'Simple Majority',
              description: 'Passes with more support than opposition votes',
              icon: Vote
            },
            {
              value: 'supermajority',
              label: 'Supermajority',
              description: 'Requires 67% support to pass',
              icon: CheckCircle
            }
          ].map(({ value, label, description, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                'flex items-start space-x-3 p-3 border rounded-lg cursor-pointer',
                'hover:bg-liberation-pride-purple hover:bg-opacity-5',
                formData.votingType === value
                  ? 'border-liberation-pride-purple bg-liberation-pride-purple bg-opacity-10'
                  : 'border-gray-200',
                traumaInformedMode && traumaInformedUtils.getSafeTransition('fast')
              )}
            >
              <input
                type="radio"
                name="votingType"
                value={value}
                checked={formData.votingType === value}
                onChange={(e) => handleInputChange('votingType', e.target.value)}
                className="mt-1"
              />
              <Icon className="h-5 w-5 mt-0.5 text-liberation-pride-purple" aria-hidden="true" />
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Consensus Threshold */}
      {formData.votingType === 'consensus' && (
        <div className="space-y-2">
          <label
            htmlFor="consensus-threshold"
            className="block text-sm font-medium text-liberation-black-power"
          >
            Consensus Threshold
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="consensus-threshold"
              type="range"
              min="0.51"
              max="1.0"
              step="0.01"
              value={formData.consensusThreshold}
              onChange={(e) => handleInputChange('consensusThreshold', parseFloat(e.target.value))}
              className="flex-1"
              aria-describedby="threshold-display"
            />
            <span
              id="threshold-display"
              className="font-medium text-liberation-pride-purple min-w-[4rem]"
            >
              {Math.round((formData.consensusThreshold || 0.8) * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Percentage of votes needed to reach consensus (minimum 51%)
          </p>
          {validationErrors.consensusThreshold && (
            <p className="text-xs text-red-500">{validationErrors.consensusThreshold}</p>
          )}
        </div>
      )}

      {/* Voting Deadline */}
      <div className="space-y-2">
        <label
          htmlFor="voting-deadline"
          className="block text-sm font-medium text-liberation-black-power"
        >
          Voting Deadline *
        </label>
        <input
          id="voting-deadline"
          type="datetime-local"
          value={formData.votingDeadline}
          onChange={(e) => handleInputChange('votingDeadline', e.target.value)}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:ring-2 focus:ring-liberation-pride-purple focus:border-liberation-pride-purple',
            validationErrors.votingDeadline ? 'border-red-500' : 'border-gray-300'
          )}
          aria-describedby="deadline-help"
        />
        <p id="deadline-help" className="text-xs text-gray-500">
          Community members will have until this date to vote
        </p>
        {validationErrors.votingDeadline && (
          <p className="text-xs text-red-500">{validationErrors.votingDeadline}</p>
        )}
      </div>

      {/* Anonymous Voting */}
      <div className="space-y-2">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.anonymousVotingAllowed}
            onChange={(e) => handleInputChange('anonymousVotingAllowed', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-liberation-black-power">
            Allow anonymous voting
          </span>
        </label>
        <p className="text-xs text-gray-500 ml-6">
          Members can choose to vote anonymously for sensitive topics
        </p>
      </div>
    </div>
  );

  // Step 3: Liberation Values Impact Assessment
  const renderLiberationValuesImpact = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold font-liberation text-liberation-black-power mb-2">
          Liberation Values Impact
        </h3>
        <p className="text-sm opacity-70">
          How will your proposal affect our core liberation values?
        </p>
        <button
          type="button"
          onClick={() => setShowImpactHelp(!showImpactHelp)}
          className="text-xs text-liberation-pride-purple hover:underline mt-2"
        >
          Need help with impact assessment?
        </button>
      </div>

      {showImpactHelp && (
        <div className="bg-liberation-pride-purple bg-opacity-10 p-4 rounded-lg border border-liberation-pride-purple border-opacity-30">
          <h4 className="font-medium mb-2">Impact Assessment Guide</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Positive (+1):</strong> Significantly strengthens this value</li>
            <li><strong>Neutral (0):</strong> No significant impact on this value</li>
            <li><strong>Negative (-1):</strong> May weaken this value (requires explanation)</li>
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Creator Sovereignty */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-liberation-gold-divine" aria-hidden="true" />
            <label className="font-medium text-liberation-black-power">
              Creator Sovereignty Impact
            </label>
          </div>
          <p className="text-sm text-gray-600">
            How does this proposal affect creator economic control and 75% revenue share?
          </p>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={formData.creatorSovereigntyImpact}
            onChange={(e) => handleInputChange('creatorSovereigntyImpact', parseFloat(e.target.value))}
            className="w-full"
            aria-describedby="creator-impact-display"
          />
          <div className="flex justify-between text-xs">
            <span>Negative</span>
            <span
              id="creator-impact-display"
              className={cn(
                'font-medium',
                (formData.creatorSovereigntyImpact || 0) > 0 ? 'text-green-600' :
                (formData.creatorSovereigntyImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {(formData.creatorSovereigntyImpact || 0).toFixed(1)}
            </span>
            <span>Positive</span>
          </div>
        </div>

        {/* Community Safety */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-liberation-green-africa" aria-hidden="true" />
            <label className="font-medium text-liberation-black-power">
              Community Safety Impact
            </label>
          </div>
          <p className="text-sm text-gray-600">
            How does this proposal affect trauma-informed design and community protection?
          </p>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={formData.communitySafetyImpact}
            onChange={(e) => handleInputChange('communitySafetyImpact', parseFloat(e.target.value))}
            className="w-full"
            aria-describedby="safety-impact-display"
          />
          <div className="flex justify-between text-xs">
            <span>Negative</span>
            <span
              id="safety-impact-display"
              className={cn(
                'font-medium',
                (formData.communitySafetyImpact || 0) > 0 ? 'text-green-600' :
                (formData.communitySafetyImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {(formData.communitySafetyImpact || 0).toFixed(1)}
            </span>
            <span>Positive</span>
          </div>
        </div>

        {/* Cultural Authenticity */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-liberation-red-liberation" aria-hidden="true" />
            <label className="font-medium text-liberation-black-power">
              Cultural Authenticity Impact
            </label>
          </div>
          <p className="text-sm text-gray-600">
            How does this proposal affect Black queer joy and Pan-African values?
          </p>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={formData.culturalAuthenticityImpact}
            onChange={(e) => handleInputChange('culturalAuthenticityImpact', parseFloat(e.target.value))}
            className="w-full"
            aria-describedby="cultural-impact-display"
          />
          <div className="flex justify-between text-xs">
            <span>Negative</span>
            <span
              id="cultural-impact-display"
              className={cn(
                'font-medium',
                (formData.culturalAuthenticityImpact || 0) > 0 ? 'text-green-600' :
                (formData.culturalAuthenticityImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {(formData.culturalAuthenticityImpact || 0).toFixed(1)}
            </span>
            <span>Positive</span>
          </div>
        </div>

        {/* Democratic Governance */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-liberation-purple-spirit" aria-hidden="true" />
            <label className="font-medium text-liberation-black-power">
              Democratic Governance Impact
            </label>
          </div>
          <p className="text-sm text-gray-600">
            How does this proposal affect community decision-making and one-member-one-vote?
          </p>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={formData.democraticGovernanceImpact}
            onChange={(e) => handleInputChange('democraticGovernanceImpact', parseFloat(e.target.value))}
            className="w-full"
            aria-describedby="democratic-impact-display"
          />
          <div className="flex justify-between text-xs">
            <span>Negative</span>
            <span
              id="democratic-impact-display"
              className={cn(
                'font-medium',
                (formData.democraticGovernanceImpact || 0) > 0 ? 'text-green-600' :
                (formData.democraticGovernanceImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {(formData.democraticGovernanceImpact || 0).toFixed(1)}
            </span>
            <span>Positive</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Review and Submit
  const renderReviewAndSubmit = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold font-liberation text-liberation-black-power mb-2">
          Review Your Proposal
        </h3>
        <p className="text-sm opacity-70">
          Please review all details before submitting to the community
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Information Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Title:</strong> {formData.title}</div>
            <div><strong>Category:</strong> {formData.category.replace('_', ' ')}</div>
            <div><strong>Priority:</strong> {formData.priorityLevel}</div>
            <div><strong>Description:</strong></div>
            <div className="pl-4 italic text-gray-700">{formData.description}</div>
          </div>
        </div>

        {/* Voting Configuration Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Voting Configuration</h4>
          <div className="space-y-2 text-sm">
            <div><strong>Voting Type:</strong> {formData.votingType}</div>
            {formData.votingType === 'consensus' && (
              <div><strong>Consensus Threshold:</strong> {Math.round((formData.consensusThreshold || 0.8) * 100)}%</div>
            )}
            <div><strong>Voting Deadline:</strong> {dateUtils.formatDisplayDateTime(formData.votingDeadline)}</div>
            <div><strong>Anonymous Voting:</strong> {formData.anonymousVotingAllowed ? 'Allowed' : 'Not allowed'}</div>
          </div>
        </div>

        {/* Liberation Values Impact Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Liberation Values Impact</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>Creator Sovereignty:</span>
              <span className={cn(
                'font-medium',
                (formData.creatorSovereigntyImpact || 0) > 0 ? 'text-green-600' :
                (formData.creatorSovereigntyImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}>
                {(formData.creatorSovereigntyImpact || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Community Safety:</span>
              <span className={cn(
                'font-medium',
                (formData.communitySafetyImpact || 0) > 0 ? 'text-green-600' :
                (formData.communitySafetyImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}>
                {(formData.communitySafetyImpact || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cultural Authenticity:</span>
              <span className={cn(
                'font-medium',
                (formData.culturalAuthenticityImpact || 0) > 0 ? 'text-green-600' :
                (formData.culturalAuthenticityImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}>
                {(formData.culturalAuthenticityImpact || 0).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Democratic Governance:</span>
              <span className={cn(
                'font-medium',
                (formData.democraticGovernanceImpact || 0) > 0 ? 'text-green-600' :
                (formData.democraticGovernanceImpact || 0) < 0 ? 'text-red-600' : 'text-gray-600'
              )}>
                {(formData.democraticGovernanceImpact || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
            <span className="text-red-800 font-medium">Submission Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Final Confirmation */}
      <div className="p-4 bg-liberation-pride-purple bg-opacity-10 border border-liberation-pride-purple border-opacity-30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-liberation-pride-purple mt-0.5" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-medium mb-1">Ready to Submit?</p>
            <p>
              Your proposal will be reviewed by the community for 48 hours before voting begins.
              You can engage with community feedback during this time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TraumaInformedContainer
      traumaInformedMode={traumaInformedMode}
      className={cn(
        'max-w-2xl mx-auto p-6 bg-white rounded-lg border-2',
        liberationColors.pride.purple,
        'border-liberation-pride-purple/20',
        className
      )}
      data-testid={testId}
      aria-label="Democratic proposal submission form"
      {...props}
    >
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-liberation-black-power">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              liberationColors.pride.purple,
              'bg-liberation-pride-purple'
            )}
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
            aria-label={`Proposal submission progress: ${Math.round(progressPercentage)}%`}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && renderBasicInformation()}
        {currentStep === 2 && renderVotingConfiguration()}
        {currentStep === 3 && renderLiberationValuesImpact()}
        {currentStep === 4 && renderReviewAndSubmit()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <LiberationButton
              variant="secondary"
              onClick={handlePreviousStep}
              disabled={loading}
              className="mr-4"
            >
              Previous
            </LiberationButton>
          )}
          {onCancel && (
            <LiberationButton
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </LiberationButton>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <LiberationButton
              variant="democratic-governance"
              onClick={handleNextStep}
              disabled={loading}
            >
              Next Step
            </LiberationButton>
          ) : (
            <LiberationButton
              variant="democratic-governance"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || Object.keys(validationErrors).length > 0}
            >
              Submit Proposal
            </LiberationButton>
          )}
        </div>
      </div>
    </TraumaInformedContainer>
  );
};