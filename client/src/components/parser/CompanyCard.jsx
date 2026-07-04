import { Building2, MapPin, Globe } from "lucide-react";
import Card from "../common/Card.jsx";
import { getDomainFromUrl } from "../../utils/formatter.js";

export default function CompanyCard({ jobData }) {
  if (!jobData) return null;
  const { company, location, sourceUrl } = jobData;

  return (
    <Card title="Company" icon={Building2}>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Building2 size={18} className="text-primary-600 shrink-0" />
          {company || "Not found"}
        </div>
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="shrink-0" />
            {location}
          </div>
        )}
        {sourceUrl && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe size={16} className="shrink-0" />
            {getDomainFromUrl(sourceUrl)}
          </div>
        )}
      </div>
    </Card>
  );
}
