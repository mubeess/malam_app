import React from 'react';
import { Shield, Music, Users, Mail, Eye, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto py-8 px-4 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Simple and transparent</p>
        <div className="bg-gray-100 rounded-full px-4 py-2 inline-block mt-4">
          <p className="text-sm text-gray-600">Last updated: June 2025</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-purple-50 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-3">
          <Music className="w-5 h-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">About Our App</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          We've built this app to give you the best experience possible. Your privacy matters to us,
          so we've kept things simple - we don't collect personal data unless absolutely necessary
          for the app to work.
        </p>
      </div>

      {/* What We Don't Collect */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">What We DON'T Collect</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">❌ No Personal Info</h3>
            <p className="text-green-700 text-sm">
              We don't ask for your name, email, or phone number
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">❌ No Location Tracking</h3>
            <p className="text-green-700 text-sm">We don't track where you are or where you go</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">❌ No Social Media Links</h3>
            <p className="text-green-700 text-sm">We don't connect to your social accounts</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">❌ No Data Selling</h3>
            <p className="text-green-700 text-sm">We never sell or share your information</p>
          </div>
        </div>
      </div>

      {/* What We Might Collect */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">What We Might Collect</h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-800 mb-3">Basic Technical Info (Anonymous)</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-sm">
                Device type (iPhone, Android, etc.) - to make sure the app works properly
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-sm">
                App crashes or errors - so we can fix bugs and improve performance
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-sm">
                General usage patterns - like which features are most popular
              </span>
            </li>
          </ul>
          <div className="bg-blue-100 rounded-lg p-3 mt-4">
            <p className="text-blue-800 text-sm font-medium">
              🔒 This information cannot be used to identify you personally
            </p>
          </div>
        </div>
      </div>

      {/* How We Use Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Information</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Improve the App</h3>
            <p className="text-sm text-gray-600">Make the music experience better for everyone</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium mb-2">Fix Bugs</h3>
            <p className="text-sm text-gray-600">Identify and resolve technical issues quickly</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium mb-2">Understand Usage</h3>
            <p className="text-sm text-gray-600">Learn which features users love most</p>
          </div>
        </div>
      </div>

      {/* Third Parties */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800 mb-3">Our app may use standard services like:</p>
          <ul className="space-y-1 text-yellow-700 text-sm">
            <li>• App analytics (to understand app performance)</li>
            <li>• Crash reporting (to fix bugs quickly)</li>
            <li>• Music streaming services (if applicable)</li>
          </ul>
          <p className="text-yellow-800 text-sm mt-3 font-medium">
            These services have their own privacy policies and we don't control them.
          </p>
        </div>
      </div>

      {/* Your Rights */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">✅ You Can:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Delete the app anytime</li>
                <li>• Contact us with questions</li>
                <li>• Request information about data we might have</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">🛡️ We Promise:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• No selling your data</li>
                <li>• No unnecessary data collection</li>
                <li>• Transparent communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <Mail className="w-6 h-6 mr-3" />
          <h2 className="text-xl font-semibold">Questions? We're Here to Help!</h2>
        </div>
        <p className="mb-4 opacity-90">
          If you have any questions about this privacy policy or our app, don't hesitate to reach
          out.
        </p>
        <a
          href="mailto:zaurenabubakarmukhtaryola@gmail.com"
          className="inline-flex text-[10px] items-center bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          <Mail className="w-4 h-4 mr-2" />
          zaurenabubakarmukhtaryola@gmail.com
        </a>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          This policy may be updated occasionally. We'll always keep it simple and transparent.
        </p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
