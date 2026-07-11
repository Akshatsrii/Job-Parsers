import { useState } from "react";
import { Briefcase, FileText } from "lucide-react";
import UrlForm from "../components/parser/UrlForm.jsx";
import ResultCard from "../components/parser/ResultCard.jsx";
import JobListCard from "../components/parser/JobListCard.jsx";
import CompanyListCard from "../components/parser/CompanyListCard.jsx";
import ResumeMatcher from "../components/parser/ResumeMatcher.jsx";
import Loader from "../components/common/Loader.jsx";
import useParser from "../hooks/useParser.js";
import { PARSE_STATUS } from "../utils/constants.js";

export default function Parser() {
  const { status, jobData, error } = useParser();
  const [activeTab, setActiveTab] = useState("details");

  const showAITabs = jobData && !jobData.isJobList && !jobData.isCompanyList;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Job URL Parser</h1>
        <p className="text-sm text-slate-500">
          Paste any Internshala or AmbitionBox link below to extract structured data.
        </p>
      </div>

      <UrlForm />

      {status === PARSE_STATUS.LOADING && <Loader label="Fetching and parsing job data..." />}

      {status === PARSE_STATUS.ERROR && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Failed to parse this URL. Try a different job link."}
        </div>
      )}

      {status === PARSE_STATUS.SUCCESS && jobData && (
        <div className="space-y-6">
          {/* Tabs Selector */}
          {showAITabs && (
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                  activeTab === "details"
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Briefcase size={14} /> Job Details
              </button>

              <button
                onClick={() => setActiveTab("matcher")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                  activeTab === "matcher"
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FileText size={14} /> ATS Resume Matcher
              </button>
            </div>
          )}

          {/* Tab Contents */}
          <div className="mt-4">
            {activeTab === "details" || !showAITabs ? (
              jobData.isJobList ? (
                <JobListCard jobData={jobData} />
              ) : jobData.isCompanyList ? (
                <CompanyListCard jobData={jobData} />
              ) : (
                <ResultCard jobData={jobData} />
              )
            ) : null}

            {showAITabs && activeTab === "matcher" && <ResumeMatcher jobData={jobData} />}
          </div>
        </div>
      )}
    </div>
  );
}


