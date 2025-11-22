import axios from "axios";
import { Check, Copy, ExternalLink, LinkIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../lib/Api";

// List Links Page
const ListLinksPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/links`);
      console.log(response.data);
      setLinks(response.data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/link/${code}`);
      setLinks(links.filter((link) => link.code !== code));
    } catch (err) {
      alert("Failed to delete link");
    } finally {
      setLoading(false);
    }
  };
  const handleRedirect = async (code) => {
    window.open(`${API_BASE_URL}/${code}`, "_blank");
    const response = await axios.get(`${API_BASE_URL}/link/${code}`);
    console.log(response);
    window.location.reload();
  };

  const handleCopy = (code) => {
    const url = `${API_BASE_URL}/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Short URLs
            </h1>
            <p className="text-gray-600">{links.length} total links</p>
          </div>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create New
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {links.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <LinkIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No links yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first short URL to get started
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Short URL
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 px-3 py-1 rounded-full">
                        <span className="text-blue-700 font-mono font-semibold">
                          {link.code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(link.code)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy short URL"
                      >
                        {copiedCode === link.code ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Target URL:</p>
                    <p className="text-gray-900 truncate mb-3">
                      {link.targetUrl}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Clicks:</span>{" "}
                        {link.clicks}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(link.createdAt)}
                      </div>
                      {link.lastClicked && (
                        <div>
                          <span className="font-medium">Last Clicked:</span>{" "}
                          {formatDate(link.lastClicked)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRedirect(link.code)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Redirect
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListLinksPage;
