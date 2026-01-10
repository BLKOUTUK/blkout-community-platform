/**
 * Learning Certificate Component
 * Generates downloadable certificates for completed modules
 * Liberation-focused recognition and credential sovereignty
 */

// Certificate component for Learning Platform
import { Award, Download, Share2, ExternalLink } from 'lucide-react';

interface CertificateProps {
  certificateId: string;
  userName: string;
  moduleName: string;
  score: number;
  issuedDate: string;
  verificationCode: string;
  liberationValues?: Record<string, number>;
}

export default function LearningCertificate({
  certificateId,
  userName,
  moduleName,
  score,
  issuedDate,
  verificationCode,
  liberationValues
}: CertificateProps) {
  const formattedDate = new Date(issuedDate).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    // In production, generate PDF certificate
    console.log('Downloading certificate:', certificateId);
    alert('Certificate download functionality will be implemented in production');
  };

  const handleShare = () => {
    // Share to social media
    const shareUrl = `https://blkoutuk.com/certificates/${verificationCode}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Certificate link copied to clipboard!');
  };

  const handleVerify = () => {
    // Open verification page
    window.open(`https://blkoutuk.com/certificates/verify/${verificationCode}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Certificate Preview */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-purple-600 rounded-lg p-12 mb-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-4 text-6xl">🏴‍☠️</div>
          <div className="absolute bottom-4 right-4 text-6xl">✊</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">🎓</div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              BLKOUT Community Platform
            </h1>
            <p className="text-xl text-purple-700 font-semibold">
              Liberation Learning Certificate
            </p>
          </div>

          {/* Certificate Body */}
          <div className="mb-8 space-y-6">
            <p className="text-lg text-gray-700">
              This certifies that
            </p>

            <h2 className="text-3xl font-bold text-gray-900 border-b-2 border-purple-400 inline-block px-8 py-2">
              {userName}
            </h2>

            <p className="text-lg text-gray-700">
              has successfully completed
            </p>

            <h3 className="text-2xl font-semibold text-purple-800 px-4">
              {moduleName}
            </h3>

            <div className="flex items-center justify-center gap-8 text-gray-700">
              <div>
                <p className="text-sm text-gray-600">Score Achieved</p>
                <p className="text-2xl font-bold text-green-600">{score}%</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <p className="text-sm text-gray-600">Date Issued</p>
                <p className="text-lg font-semibold">{formattedDate}</p>
              </div>
            </div>

            {/* Liberation Values */}
            {liberationValues && Object.keys(liberationValues).length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Liberation Values Demonstrated</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(liberationValues)
                    .filter(([_, value]) => value >= 7)
                    .map(([key, value]) => (
                      <span
                        key={key}
                        className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-medium"
                      >
                        {key.replace(/_/g, ' ')} ({value}/10)
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 border-gray-300">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Award className="h-8 w-8 text-purple-600" />
              <p className="text-sm text-gray-600">
                Verified Credential • Community-Owned Platform
              </p>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              Verification Code: {verificationCode}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download PDF
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Share2 className="h-5 w-5" />
          Share Certificate
        </button>

        <button
          onClick={handleVerify}
          className="flex items-center gap-2 border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
          Verify Online
        </button>
      </div>

      {/* Verification Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-2">About This Certificate</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>✅ <strong>Verifiable:</strong> Use the verification code to confirm authenticity</li>
          <li>✅ <strong>Community-Owned:</strong> Issued by BLKOUT cooperative platform</li>
          <li>✅ <strong>Liberation-Focused:</strong> Recognizes values-aligned learning</li>
          <li>✅ <strong>Portable:</strong> Your credential, your data sovereignty</li>
        </ul>
      </div>
    </div>
  );
}
