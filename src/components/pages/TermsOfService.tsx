// BLKOUT Terms of Service Page
import React from 'react';
import { Shield, Users, Heart, AlertTriangle, Scale, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
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
              <Scale className="w-16 h-16 text-liberation-red-liberation" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-gray-100 uppercase">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Last updated: December 2024
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Community agreements for a safer, more liberating space
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
              <Heart className="w-8 h-8 text-liberation-red-liberation" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to BLKOUT</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BLKOUT is a community-owned platform created for and by Black queer men in the UK, operated by BLKOUT Creative Ltd. These Terms of Service govern your use of our website, applications, and services (collectively, the "Platform").
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing or using BLKOUT, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Platform.
            </p>
          </motion.div>

          {/* Who We Are */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">1. Who We Are</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BLKOUT is operated by BLKOUT Creative Ltd, a Community Benefit Society registered by the Financial Conduct Authority under the Co-operative and Community Benefit Societies Act 2014, dedicated to supporting Black queer men through connection, resources, and collective liberation.
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Organisation:</strong> BLKOUT Creative Ltd</li>
              <li><strong>Contact:</strong> hello@blkoutuk.com</li>
              <li><strong>Location:</strong> United Kingdom</li>
              <li><strong>Website:</strong> blkoutuk.com</li>
            </ul>
          </motion.div>

          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To use BLKOUT, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be prohibited from using the Platform under applicable laws</li>
              <li>Agree to these Terms of Service and our Privacy Policy</li>
            </ul>
          </motion.div>

          {/* Community Standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">3. Community Standards</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BLKOUT is built on principles of mutual respect, liberation, and collective care. When using our Platform, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Treat all community members with respect and dignity</li>
              <li>Not engage in harassment, discrimination, or hate speech</li>
              <li>Respect the privacy and boundaries of others</li>
              <li>Not share others' personal information without consent</li>
              <li>Not post illegal, harmful, or misleading content</li>
              <li>Not impersonate others or misrepresent your identity</li>
              <li>Report violations to help maintain community safety</li>
            </ul>
          </motion.div>

          {/* User Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. User Accounts</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              When you create an account with us, you must provide accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Keeping your contact information up to date</li>
            </ul>
          </motion.div>

          {/* Content & Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Content & Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Your Content</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You retain ownership of content you create and share on BLKOUT. By posting content, you grant us a non-exclusive license to use, display, and distribute your content within the Platform for community purposes.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Our Content</h3>
            <p className="text-gray-700 dark:text-gray-300">
              The BLKOUT name, logo, and Platform design are owned by BLKOUT UK. You may not use our branding without written permission.
            </p>
          </motion.div>

          {/* Prohibited Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">6. Prohibited Activities</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The following activities are strictly prohibited on BLKOUT:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Harassment, bullying, or threatening behaviour</li>
              <li>Sharing sexually explicit content without appropriate warnings</li>
              <li>Spam, phishing, or fraudulent activities</li>
              <li>Attempting to compromise Platform security</li>
              <li>Commercial solicitation without permission</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Outing or exposing others' identities without consent</li>
            </ul>
          </motion.div>

          {/* Termination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may suspend or terminate your account if you violate these Terms or our Community Standards. You may also delete your account at any time by contacting us.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Upon termination, your right to use the Platform will immediately cease. We may retain certain information as required by law or for legitimate business purposes.
            </p>
          </motion.div>

          {/* Disclaimers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Disclaimers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              BLKOUT is provided "as is" without warranties of any kind. We do not guarantee that the Platform will be uninterrupted, secure, or error-free.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We are not responsible for content posted by users or third parties. Views expressed by community members do not necessarily reflect the views of BLKOUT UK.
            </p>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              To the maximum extent permitted by law, BLKOUT Creative Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.
            </p>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>
          </motion.div>

          {/* Governing Law */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
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
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Email:</strong> hello@blkoutuk.com</li>
              <li><strong>Website:</strong> blkoutuk.com</li>
            </ul>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
