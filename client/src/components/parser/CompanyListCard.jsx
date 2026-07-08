import { useState } from "react";
import { Building2, Star, MessageSquare, MapPin, Calendar, Users, Tag, Search, Sparkles } from "lucide-react";
import Card from "../common/Card.jsx";
import ExportCard from "./ExportCard.jsx";

export default function CompanyListCard({ jobData }) {
  const [searchQuery, setSearchQuery] = useState("");
  if (!jobData || !jobData.companies) return null;

  const filteredCompanies = jobData.companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    const name = (company.name || "").toLowerCase();
    const type = (company.companyType || "").toLowerCase();
    const hq = (company.headquarters || "").toLowerCase();
    return name.includes(query) || type.includes(query) || hq.includes(query);
  });

  return (
    <div className="mt-6 space-y-6">
      {/* Header / Summary */}
      <div className="card bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-5 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute right-4 top-4 text-teal-200 pointer-events-none">
          <Sparkles size={64} className="opacity-40 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-600 p-3 text-white shadow-md shadow-teal-200">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Company List Extracted</h2>
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold text-teal-600">{jobData.companies.length}</span> companies on <span className="font-medium text-gray-800">{jobData.source || "AmbitionBox"}</span>
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
          placeholder="Search by company name, type, or headquarters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* Filtered Count */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Showing {filteredCompanies.length} of {jobData.companies.length} results
        </p>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No companies found matching your search. Try a different query.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCompanies.map((company, idx) => (
            <div 
              key={idx} 
              className="group card border border-gray-150 hover:border-teal-300 hover:shadow-md transition-all duration-200 p-5 rounded-xl bg-white flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                {/* Header: Name, Rating, Reviews */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                      <Tag size={13} className="shrink-0 text-gray-400" />
                      <span className="truncate font-medium">{company.companyType || "Not Disclosed"}</span>
                    </div>
                  </div>

                  {/* Rating / Review count */}
                  <div className="flex flex-col items-end shrink-0">
                    {company.rating && company.rating !== "N/A" && (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>{company.rating}</span>
                      </div>
                    )}
                    {company.reviews && company.reviews !== "N/A" && (
                      <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
                        <MessageSquare size={10} />
                        {company.reviews.replace(/\s*reviews?/i, "")} revs
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.headquarters || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.companyAge || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Users size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{company.noOfEmployee || "N/A"} employees</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <ExportCard jobData={jobData} />
      </div>
    </div>
  );
}
