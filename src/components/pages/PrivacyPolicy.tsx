// BLKOUT Privacy Policy Page
import React from 'react';
import { Shield, Eye, Lock, Database, UserCheck, Globe, Mail, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-liberation-red-liberation" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-gray-100 uppercase">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Last updated: December 2024
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Your privacy matters. Here's how we protect and respect your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-liberation-red-liberation" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Introduction</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BLKOUT Creative Ltd ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We understand the importance of privacy, especially within our community. Your trust is essential to us, and we take our responsibility to protect your data seriously.
            </p>
          </motion.div>

          {/* Information We Collect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">1. Information We Collect</h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li><strong>Account Information:</strong> Name, email address, username, and password when you register</li>
              <li><strong>Profile Information:</strong> Optional details you choose to share (bio, interests, location)</li>
              <li><strong>Communications:</strong> Messages you send through our platform or to our support team</li>
              <li><strong>Content:</strong> Posts, comments, photos, and other content you share</li>
              <li><strong>Survey Responses:</strong> Information you provide when participating in surveys or feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Device Information:</strong> Device type, operating system, and browser type</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on the platform</li>
              <li><strong>Log Data:</strong> IP address, access times, and referring URLs</li>
              <li><strong>Cookies:</strong> Small data files stored on your device (see Cookie Policy below)</li>
            </ul>
          </motion.div>

          {/* How We Use Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide, maintain, and improve our platform and services</li>
              <li>Create and manage your account</li>
              <li>Facilitate community connections and interactions</li>
              <li>Send important updates about the platform and community events</li>
              <li>Respond to your enquiries and provide support</li>
              <li>Ensure community safety and enforce our Terms of Service</li>
              <li>Analyse usage patterns to improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </motion.div>

          {/* Information Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">3. Information Sharing</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              <li><strong>Community Features:</strong> Profile information you choose to make public</li>
              <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, email, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
              <li><strong>Business Transfers:</strong> In connection with any merger or acquisition (with notice to you)</li>
            </ul>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">4. Data Security</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We implement appropriate technical and organisational measures to protect your personal data, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal data by authorised personnel only</li>
              <li>Secure hosting with reputable providers</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.
            </p>
          </motion.div>

          {/* Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Your Rights (UK GDPR)</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Under UK data protection law, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing</li>
              <li><strong>Rights Related to Automated Decision-Making:</strong> Not be subject to purely automated decisions</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              To exercise any of these rights, please contact us at hello@blkoutuk.com. We will respond within one month.
            </p>
          </motion.div>

          {/* Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">6. Data Retention</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days of account deletion</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
              <li><strong>Anonymised Data:</strong> May be retained indefinitely for analytics</li>
            </ul>
          </motion.div>

          {/* Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Cookies & Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function (authentication, security)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use the platform</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.
            </p>
          </motion.div>

          {/* Third-Party Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the following third-party services that may collect data:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Hosting:</strong> Vercel (website hosting)</li>
              <li><strong>Database:</strong> Supabase (secure data storage)</li>
              <li><strong>Analytics:</strong> Privacy-focused analytics tools</li>
              <li><strong>Email:</strong> SendFox (newsletter communications)</li>
              <li><strong>Social Media:</strong> When you connect social accounts</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              These services have their own privacy policies. We encourage you to review them.
            </p>
          </motion.div>

          {/* Children's Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              BLKOUT is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete that information.
            </p>
          </motion.div>

          {/* International Transfers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your data may be processed in countries outside the UK. When we transfer data internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions, to protect your data in accordance with UK GDPR.
            </p>
          </motion.div>

          {/* Changes to Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-liberation-red-liberation/10 to-purple-100 dark:from-liberation-red-liberation/20 dark:to-purple-900/20 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-8 h-8 text-liberation-red-liberation" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">12. Contact Us</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Email:</strong> hello@blkoutuk.com</li>
              <li><strong>Website:</strong> blkoutuk.com</li>
              <li><strong>Data Protection:</strong> For GDPR enquiries, email hello@blkoutuk.com with "Data Protection" in the subject line</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data protection rights have been violated.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
