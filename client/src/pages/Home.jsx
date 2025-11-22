import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Copy,

  Link as LinkIcon,
  Check,
} from "lucide-react";
import { API_BASE_URL } from "../lib/Api";
import { Link } from "react-router-dom";
// Change this to your backend URL

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, shortUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Short URL Created Successfully!
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Your tiny URL is ready to use
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Your Short URL:</p>
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2">
              <span className="text-blue-600 font-medium truncate">
                {shortUrl}
              </span>
              <button
                onClick={handleCopy}
                className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const CreateLinkPage = ({ onNavigate }) => {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/links`, {
        targetUrl,
        customCode: customCode || undefined,
      });

      const generatedShortUrl = `${API_BASE_URL}/${response.data.code}`;
      setShortUrl(generatedShortUrl);
      setModalOpen(true);
      setTargetUrl("");
      setCustomCode("");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This custom code is already taken. Please try another one.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to create short URL. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <LinkIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TinyURL</h1>
          <p className="text-gray-600">Shorten your long URLs instantly</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="targetUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Original URL *
              </label>
              <input
                type="url"
                id="targetUrl"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/your-long-url"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="customCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Custom Code (Optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-custom-code"
                pattern="[A-Za-z0-9]{6,8}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-1 text-sm text-gray-500">
                6-8 alphanumeric characters (leave empty for auto-generated)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              {loading ? "Creating..." : "Shorten URL"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/dashboard"
            
            className="text-blue-600 hover:text-blue-700 font-medium underline hover:cursor-pointer"
          >
            View All URLs →
          </Link>
        </div>
      </div>

      <SuccessModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        shortUrl={shortUrl}
      />
    </div>
  );
};

export default CreateLinkPage
