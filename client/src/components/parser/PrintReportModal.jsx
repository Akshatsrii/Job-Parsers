import { useEffect } from "react";
import { X, Printer, FileText, Calendar, Link2, Briefcase, Building2, FileJson } from "lucide-react";
import Button from "../common/Button.jsx";
import { downloadFile } from "../../utils/helpers.js";

export default function PrintReportModal({ isOpen, onClose, jobData }) {
  
  // Inject print styles dynamically when modal is mounted
  useEffect(() => {
    if (!isOpen) return;
    
    const style = document.createElement("style");
    style.id = "print-report-styles";
    style.innerHTML = `
      @media print {
        /* Hide all page content except our report container */
        body * {
          visibility: hidden !important;
        }
        #print-report-container, #print-report-container * {
          visibility: visible !important;
        }
        #print-report-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          background: white !important;
          color: black !important;
          padding: 20px !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        /* Hide action header buttons when printing */
        .no-print {
          display: none !important;
        }
        /* Table borders and padding for high contrast print */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        th, td {
          border: 1px solid #ddd !important;
          padding: 8px !important;
          text-align: left !important;
          font-size: 11px !important;
        }
        th {
          background-color: #f2f2f2 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const el = document.getElementById("print-report-styles");
      if (el) document.head.removeChild(el);
    };
  }, [isOpen]);

  if (!isOpen || !jobData) return null;

  const isJobs = jobData.isJobList && Array.isArray(jobData.jobs);
  const isCompanies = jobData.isCompanyList && Array.isArray(jobData.companies);
  const totalCount = isJobs ? jobData.jobs.length : isCompanies ? jobData.companies.length : 1;

  const handlePrint = () => {
    window.print();
  };

  const handleJsonExport = () => {
    downloadFile(
      `${jobData.company || "scraped"}-data.json`,
      JSON.stringify(jobData, null, 2),
      "application/json"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Actions Bar (Screen Only) */}
        <div className="no-print border-b border-gray-150 p-4 bg-gray-50 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="text-primary-600" size={20} />
            <span className="font-bold text-gray-800">Scraped Report PDF Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={FileJson} onClick={handleJsonExport}>
              Download JSON
            </Button>
            <Button variant="primary" icon={Printer} onClick={handlePrint}>
              Print / Save as PDF
            </Button>
            <button 
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Report Preview Document Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center">
          
          <div 
            id="print-report-container" 
            className="w-full max-w-4xl bg-white border border-gray-200 p-8 shadow-md rounded-lg flex flex-col gap-6 text-gray-800 text-sm font-sans"
          >
            {/* Report Header Banner */}
            <div className="border-b-2 border-gray-800 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">DATA SCRAPING REPORT</h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Generated on: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Source Platform</p>
                <p className="text-sm font-bold text-primary-600">
                  {jobData.source || (jobData.sourceUrl && jobData.sourceUrl.includes("ambitionbox") ? "AmbitionBox" : "Internshala")}
                </p>
              </div>
            </div>

            {/* Metadata Summary List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs border border-gray-150">
              <div className="space-y-1">
                <span className="font-semibold text-gray-500">Query / Source Link:</span>
                <p className="text-gray-800 font-medium truncate flex items-center gap-1">
                  <Link2 size={12} />
                  <a href={jobData.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-600 truncate">
                    {jobData.sourceUrl}
                  </a>
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500">Total Extracted Records:</span>
                <p className="text-gray-800 font-bold text-sm">
                  {totalCount} {isJobs ? "Jobs" : isCompanies ? "Companies" : "Job Profile"}
                </p>
              </div>
            </div>

            {/* Document Data Table */}
            <div className="flex-1 overflow-x-auto">
              {isJobs && (
                <table className="w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-200">
                      <th className="p-3 border border-gray-200 w-12 text-center">#</th>
                      <th className="p-3 border border-gray-200">Job Title</th>
                      <th className="p-3 border border-gray-200">Company</th>
                      <th className="p-3 border border-gray-200">Location</th>
                      <th className="p-3 border border-gray-200">Salary</th>
                      <th className="p-3 border border-gray-200">Experience</th>
                      <th className="p-3 border border-gray-200">Mode</th>
                      <th className="p-3 border border-gray-200 max-w-[200px]">Skills Required</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-700">
                    {jobData.jobs.map((job, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 border-b border-gray-100">
                        <td className="p-3 border border-gray-200 text-center font-medium">{index + 1}</td>
                        <td className="p-3 border border-gray-200 font-semibold text-gray-900">{job.title}</td>
                        <td className="p-3 border border-gray-200">{job.company}</td>
                        <td className="p-3 border border-gray-200">{job.location}</td>
                        <td className="p-3 border border-gray-200 text-emerald-700 font-medium">{job.salary}</td>
                        <td className="p-3 border border-gray-200">{job.experience}</td>
                        <td className="p-3 border border-gray-200">{job.workMode || "On-site"}</td>
                        <td className="p-3 border border-gray-200 truncate max-w-[200px]" title={(job.skills || []).join(", ")}>
                          {(job.skills || []).join(", ") || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {isCompanies && (
                <table className="w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-200">
                      <th className="p-3 border border-gray-200 w-12 text-center">#</th>
                      <th className="p-3 border border-gray-200">Company Name</th>
                      <th className="p-3 border border-gray-200 text-center">Rating</th>
                      <th className="p-3 border border-gray-200">Reviews</th>
                      <th className="p-3 border border-gray-200">Company Type</th>
                      <th className="p-3 border border-gray-200">Headquarters</th>
                      <th className="p-3 border border-gray-200 text-center">Age</th>
                      <th className="p-3 border border-gray-200">Employees</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-700">
                    {jobData.companies.map((company, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 border-b border-gray-100">
                        <td className="p-3 border border-gray-200 text-center font-medium">{index + 1}</td>
                        <td className="p-3 border border-gray-200 font-semibold text-gray-900">{company.name}</td>
                        <td className="p-3 border border-gray-200 text-center font-bold text-amber-600">{company.rating || "N/A"}</td>
                        <td className="p-3 border border-gray-200">{company.reviews || "N/A"}</td>
                        <td className="p-3 border border-gray-200">{company.companyType || "N/A"}</td>
                        <td className="p-3 border border-gray-200">{company.headquarters || "N/A"}</td>
                        <td className="p-3 border border-gray-200 text-center">{company.companyAge || "N/A"}</td>
                        <td className="p-3 border border-gray-200">{company.noOfEmployee || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!isJobs && !isCompanies && (
                <table className="w-full text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-600 border-b border-gray-200">
                      <th className="p-3 border border-gray-200 w-1/3">Field</th>
                      <th className="p-3 border border-gray-200 w-2/3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Job Title</td>
                      <td className="p-3 border border-gray-200">{jobData.title}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Company Name</td>
                      <td className="p-3 border border-gray-200">{jobData.company}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Location</td>
                      <td className="p-3 border border-gray-200">{jobData.location}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Salary Package</td>
                      <td className="p-3 border border-gray-200">{jobData.salary}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Experience Range</td>
                      <td className="p-3 border border-gray-200">{jobData.experience}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Skills</td>
                      <td className="p-3 border border-gray-200">{(jobData.skills || []).join(", ") || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 border border-gray-200 font-semibold">Description</td>
                      <td className="p-3 border border-gray-200 whitespace-pre-wrap">{jobData.description || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Report Page Footer */}
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest mt-6">
              <span>Universal Job Parser Sheet</span>
              <span>Page 1 of 1</span>
            </div>
          </div>

        </div>

        {/* Footer actions for screen view */}
        <div className="no-print border-t border-gray-150 p-4 bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button variant="outline" icon={FileJson} onClick={handleJsonExport}>
            Download JSON
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save PDF
          </Button>
        </div>

      </div>
    </div>
  );
}
