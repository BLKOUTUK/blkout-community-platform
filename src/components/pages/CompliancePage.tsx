// BLKOUT Compliance & Best Practice Hub
// Public page showing cooperative principles, governance, and digital inclusion standards
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Circle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Assessment {
  id: string;
  framework: string;
  framework_display: string;
  category: string;
  principle: string;
  principle_display: string;
  principle_description: string;
  status: 'met' | 'partially_met' | 'not_met' | 'not_assessed' | 'not_applicable';
  met_count: number;
  total_count: number;
  evidence: string | null;
  gaps: string | null;
  action_plan: string | null;
  target_date: string | null;
  assessed_by: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

interface ComplianceData {
  assessments: Record<string, Assessment[]>;
  lastReviewed: string | null;
  totalPrinciples: number;
  metCount: number;
  partialCount: number;
}

const CATEGORY_LABELS: Record<string, { title: string; description: string }> = {
  cooperative: {
    title: 'Co-operative Principles',
    description: 'ICA International Cooperative Principles & Co-operatives UK Governance Code'
  },
  governance: {
    title: 'Governance & Legal',
    description: 'Board accountability, data protection, safeguarding'
  },
  digital_inclusion: {
    title: 'Digital & Inclusion',
    description: 'AI transparency, accessibility, LGBTQ+ standards'
  }
};

const CATEGORY_ORDER = ['cooperative', 'governance', 'digital_inclusion'];

const STATUS_CONFIG = {
  met: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400', label: 'Met' },
  partially_met: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400', label: 'Partially Met' },
  not_met: { icon: Circle, color: 'text-red-400', bg: 'bg-red-400', label: 'Not Met' },
  not_assessed: { icon: Circle, color: 'text-gray-500', bg: 'bg-gray-500', label: 'Not Assessed' },
  not_applicable: { icon: Circle, color: 'text-gray-600', bg: 'bg-gray-600', label: 'N/A' }
};

function StatusDots({ met, total }: { met: number; total: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < met ? 'bg-[#d4af37]' : 'bg-gray-600'}`}
        />
      ))}
      <span className="text-xs text-gray-400 ml-2">{met}/{total}</span>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[assessment.status] || STATUS_CONFIG.not_assessed;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#d4af37]/30 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left flex items-start gap-4"
      >
        <StatusIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.color}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-white font-semibold text-sm md:text-base">{assessment.principle_display}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.color} bg-white/5`}>
              {config.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{assessment.principle_description}</p>
          <div className="mt-2">
            <StatusDots met={assessment.met_count} total={assessment.total_count} />
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-500">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 space-y-4 border-t border-white/5">
              {assessment.evidence && (
                <div className="mt-4">
                  <h5 className="text-[#d4af37] text-xs uppercase tracking-wider font-semibold mb-1">What we do</h5>
                  <p className="text-gray-300 text-sm">{assessment.evidence}</p>
                </div>
              )}
              {assessment.gaps && (
                <div>
                  <h5 className="text-amber-400 text-xs uppercase tracking-wider font-semibold mb-1">What we're working on</h5>
                  <p className="text-gray-300 text-sm">{assessment.gaps}</p>
                </div>
              )}
              {assessment.action_plan && (
                <div>
                  <h5 className="text-white/60 text-xs uppercase tracking-wider font-semibold mb-1">Action plan</h5>
                  <p className="text-gray-300 text-sm">{assessment.action_plan}</p>
                  {assessment.target_date && (
                    <p className="text-gray-500 text-xs mt-1">Target: {new Date(assessment.target_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-white/5">
                <span>Framework: {assessment.framework_display}</span>
                <span>Assessed by: {assessment.assessed_by}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CompliancePage: React.FC = () => {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ivor.blkoutuk.cloud';
    fetch(`${API_BASE}/api/council/compliance`)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalMet = data?.metCount || 0;
  const totalPartial = data?.partialCount || 0;
  const totalPrinciples = data?.totalPrinciples || 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-20 px-6 bg-[#1a1a2e]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20">
                <Shield className="w-10 h-10 text-[#d4af37]" />
              </div>
            </div>
            <p className="text-[#d4af37] text-sm uppercase tracking-[0.3em] font-semibold mb-4">
              Community Benefit Society
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white uppercase tracking-tight">
              Governance & Best Practice
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-2">
              How we hold ourselves accountable as a cooperative.
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This page shows our progress against recognised UK cooperative, governance, and digital inclusion standards.
              We're honest about gaps — transparency is a cooperative value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Summary bar */}
      {!loading && data && (
        <section className="bg-black border-y border-white/10 py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-green-400">{totalMet}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Fully Met</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{totalPartial}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Partially Met</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{totalPrinciples}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Standards</p>
            </div>
            {data.lastReviewed && (
              <div>
                <p className="text-sm font-semibold text-gray-300">
                  {new Date(data.lastReviewed).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Last Reviewed</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Assessment cards by category */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading compliance data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-2">Failed to load compliance data</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : data?.assessments ? (
            CATEGORY_ORDER.map(category => {
              const assessments = data.assessments[category];
              if (!assessments) return null;
              const catConfig = CATEGORY_LABELS[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{catConfig?.title || category}</h2>
                    <p className="text-gray-400 text-sm mt-1">{catConfig?.description}</p>
                  </div>
                  <div className="space-y-3">
                    {assessments.map(a => (
                      <AssessmentCard key={a.id} assessment={a} />
                    ))}
                  </div>
                </motion.div>
              );
            })
          ) : null}
        </div>
      </section>

      {/* Standards we benchmark against */}
      <section className="py-16 px-6 bg-[#1a1a2e] border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-8 text-center">Standards We Benchmark Against</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'ICA Cooperative Principles', url: 'https://ica.coop/en/cooperatives/cooperative-identity', desc: '7 international principles for cooperatives' },
              { name: 'Co-operatives UK Governance Code', url: 'https://www.uk.coop/code', desc: '6-area governance framework (comply or explain)' },
              { name: 'Co-operatives UK Simply Governance', url: 'https://www.uk.coop/resources/simply-governance', desc: 'Practical guide for community enterprise' },
              { name: 'Charity Governance Code', url: 'https://www.charitygovernancecode.org/', desc: 'UK charity board standards' },
              { name: 'UK GDPR', url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/', desc: 'Data protection regulation' },
              { name: 'Charity Digital Code of Practice', url: 'https://superhighways.org.uk/latest/charity-digital-code-of-practi/', desc: '7 principles for responsible digital' },
              { name: 'WCAG 2.1 AA', url: 'https://www.w3.org/WAI/WCAG21/quickref/', desc: 'Web accessibility guidelines' },
              { name: 'Stonewall Best Practice', url: 'https://stonewall.org.uk/best-practice-toolkits-and-guides', desc: 'LGBTQ+ inclusion standards' },
              { name: 'FCA Mutual Societies', url: 'https://www.fca.org.uk/firms/mutual-societies', desc: 'Regulatory framework for co-ops' },
            ].map(standard => (
              <a
                key={standard.name}
                href={standard.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#d4af37] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-[#d4af37] transition-colors">{standard.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{standard.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency notice */}
      <section className="py-12 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            This compliance hub is part of BLKOUT's commitment to transparency as a cooperative.
            Assessments are reviewed by the board and supported by our AI Council (an LLM-based
            deliberation system that helps evaluate our practices). All assessments require human approval.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Have a concern or suggestion? Email <a href="mailto:blkoutuk.com" className="text-[#d4af37] hover:underline">blkoutuk.com</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default CompliancePage;
