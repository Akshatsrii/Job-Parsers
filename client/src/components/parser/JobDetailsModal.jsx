import { useEffect, useState } from "react";
import { X, Building2, MapPin, Calendar, Star, ExternalLink, Briefcase, IndianRupee, Tag, AlertCircle, Mail, Phone } from "lucide-react";
import { parseJobUrl } from "../../api/parser.api.js";
import Button from "../common/Button.jsx";
import Loader from "../common/Loader.jsx";
import useParser from "../../hooks/useParser.js";

export default function JobDetailsModal({ isOpen, onClose, job }) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const { updateJobDetails } = useParser();

  useEffect(() => {
    if (!isOpen || !job || !job.applyUrl) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      setDetails(null);
      try {
        const response = await parseJobUrl(job.applyUrl);
        if (response && response.success && response.data) {
          setDetails(response.data);
          // Update the main jobData context list with these fetched details
          updateJobDetails(job.applyUrl, response.data);
        } else {
          setError(response?.message || "Failed to fetch job details");
        }
      } catch (err) {
        setError(err.message || "Failed to parse individual job details page");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, job, updateJobDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-gray-150 p-6 flex justify-between items-start gap-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 leading-snug truncate">
              {job?.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 font-medium text-gray-800">
                <Building2 size={15} className="text-gray-400" />
                {job?.company}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin size={15} className="text-gray-400" />
                {job?.location}
              </span>
              {job?.workMode && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    {job.workMode}
                  </span>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-12">
              <Loader label="Fetching full job description and requirements..." />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center space-y-3">
              <div className="flex justify-center text-red-600">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-sm font-semibold text-red-800">Scraping Failed</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
              <div className="pt-2">
                <Button 
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2"
                >
                  Close & Open Original URL
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && details && (
            <div className="space-y-6">
              
              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-150 p-4 rounded-xl bg-gray-50/50">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Salary Package</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                    <IndianRupee size={15} className="text-emerald-500" />
                    <span>{details.salary && details.salary !== "Not Disclosed" ? details.salary : (job?.salary || "Not Disclosed")}</span>
                  </div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-150 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Experience</span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                    <Briefcase size={15} className="text-blue-500" />
                    <span>{details.experience && details.experience !== "Not Specified" ? details.experience : (job?.experience || "Not Specified")}</span>
                  </div>
                </div>
                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-150 pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Posted Date</span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                    <Calendar size={15} className="text-orange-500" />
                    <span>{details.postedDate && details.postedDate !== "Not Disclosed" ? details.postedDate : (job?.postedDate || "Not Disclosed")}</span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {((details.skills && details.skills.length > 0) || (job?.skills && job.skills.length > 0)) && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Tag size={13} />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(details.skills && details.skills.length > 0 ? details.skills : job.skills).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information — only show when real data is available */}
              {((details.email && details.email !== "Not Disclosed") || (details.contact && details.contact !== "Not Disclosed")) && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                    <Mail size={13} className="text-gray-400" />
                    Company Contact Info
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 p-3 border border-gray-150 rounded-xl bg-gray-50/50">
                    {details.email && details.email !== "Not Disclosed" && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={15} className="text-gray-400 shrink-0" />
                        <span className="text-gray-500 mr-1 text-xs">Email:</span>
                        <a href={`mailto:${details.email}`} className="text-teal-600 hover:text-teal-700 font-semibold hover:underline truncate" title={details.email}>
                          {details.email}
                        </a>
                      </div>
                    )}
                    {details.contact && details.contact !== "Not Disclosed" && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 sm:border-l border-gray-200 sm:pl-6">
                        <Phone size={15} className="text-gray-400 shrink-0" />
                        <span className="text-gray-500 mr-1 text-xs">Phone:</span>
                        <a href={`tel:${details.contact}`} className="text-teal-600 hover:text-teal-700 font-semibold hover:underline truncate" title={details.contact}>
                          {details.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Full Description */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider border-b border-gray-100 pb-2">
                  Detailed Job Description
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-2 max-h-[35vh] overflow-y-auto pr-2">
                  {details.description || "No Description Provided."}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-150 p-4 bg-gray-50 flex justify-end gap-3 shrink-0">
          <Button 
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Close
          </Button>
          {job?.applyUrl && (
            <a 
              href={job.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              Apply Direct
              <ExternalLink size={14} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
