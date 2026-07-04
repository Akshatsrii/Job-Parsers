import UrlForm from "../components/parser/UrlForm.jsx";
import ResultCard from "../components/parser/ResultCard.jsx";
import JobListCard from "../components/parser/JobListCard.jsx";
import Loader from "../components/common/Loader.jsx";
import useParser from "../hooks/useParser.js";
import { PARSE_STATUS } from "../utils/constants.js";

export default function Parser() {
  const { status, jobData, error } = useParser();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Job URL Parser</h1>
      <p className="mb-6 text-sm text-gray-600">
        Paste any job posting link below to extract structured data.
      </p>

      <UrlForm />

      {status === PARSE_STATUS.LOADING && <Loader label="Fetching and parsing job data..." />}

      {status === PARSE_STATUS.ERROR && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Failed to parse this URL. Try a different job link."}
        </div>
      )}

      {status === PARSE_STATUS.SUCCESS && jobData && (
        jobData.isJobList ? (
          <JobListCard jobData={jobData} />
        ) : (
          <ResultCard jobData={jobData} />
        )
      )}
    </div>
  );
}

