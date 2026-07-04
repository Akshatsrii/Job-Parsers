import { useState } from "react";
import { Briefcase, Building2, MapPin, DollarSign, Clock, Tag, ExternalLink, Search, Sparkles } from "lucide-react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";

export default function JobListCard({ jobData }) {
  const [searchQuery, setSearchQuery] = useState("");
  if (!jobData || !jobData.jobs) return null;

  const filteredJobs = jobData.jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const skills = (job.skills || []).map(s => s.toLowerCase()).join(" ");
    const location = (job.location || "").toLowerCase();
    return title.includes(query) || company.includes(query) || skills.includes(query) || location.includes(query);
  });

  return (
    <div className="mt-6 space-y-6">
      {/* List Header / Summary */}
      <div className="card bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 p-5 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute right-4 top-4 text-primary-200 pointer-events-none">
          <Sparkles size={64} className="opacity-40 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary-600 p-3 text-white shadow-md shadow-primary-200">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Job List Extracted</h2>
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold text-primary-600">{jobData.jobs.length}</span> jobs on <span className="font-medium text-gray-800">{jobData.source || "AmbitionBox"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by job title, company, skills, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Filtered Jobs Count */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Showing {filteredJobs.length} of {jobData.jobs.length} results
        </p>
      </div>

      {/* Jobs Grid/List */}
      {filteredJobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No jobs found matching your search. Try a different query.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {filteredJobs.map((job, idx) => (
            <div 
              key={idx} 
              className="group card border border-gray-150 hover:border-primary-300 hover:shadow-md transition-all duration-200 p-5 rounded-xl bg-white flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-3 flex-1 min-w-0">
                {/* Title & Company */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-700">{job.company}</span>
                    {job.workMode && (
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full uppercase tracking-wider ${
                        job.workMode === 'Remote' ? 'bg-green-50 text-green-700 border border-green-200' :
                        job.workMode === 'Hybrid' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {job.workMode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={15} className="text-gray-400 shrink-0" />
                    <span className="truncate">{job.location || "Not disclosed"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={15} className="text-gray-400 shrink-0" />
                    <span className="truncate">{job.experience || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={15} className="text-gray-400 shrink-0" />
                    <span className="truncate font-medium text-gray-800">{job.salary || "Not disclosed"}</span>
                  </div>
                </div>

                {/* Skills tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-lg hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors cursor-default"
                      >
                        <Tag size={10} className="opacity-70" />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button & Date */}
              <div className="flex md:flex-col items-between justify-between md:items-end gap-2.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                {job.postedDate && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={13} />
                    <span>{job.postedDate}</span>
                  </div>
                )}
                {job.applyUrl && (
                  <a href={job.applyUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                    <Button variant="outline" size="sm" icon={ExternalLink} className="w-full md:w-auto hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                      Apply / View
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
