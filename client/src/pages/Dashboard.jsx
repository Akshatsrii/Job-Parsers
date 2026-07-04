import { Briefcase, Building2, Clock3 } from "lucide-react";
import useParser from "../hooks/useParser.js";
import Card from "../components/common/Card.jsx";
import { formatDate } from "../utils/formatter.js";

export default function Dashboard() {
  const { history } = useParser();

  const totalParsed = history.length;
  const uniqueCompanies = new Set(history.map((h) => h.company).filter(Boolean)).size;
  const lastParsedAt = history[0]?.parsedAt ? formatDate(history[0].parsedAt) : "-";

  const stats = [
    { label: "Total Parsed", value: totalParsed, icon: Briefcase },
    { label: "Unique Companies", value: uniqueCompanies, icon: Building2 },
    { label: "Last Parsed", value: lastParsedAt, icon: Clock3 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-6 card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Recent Jobs
          </h2>
          <ul className="divide-y divide-gray-100">
            {history.slice(0, 5).map((item) => (
              <li key={item.id} className="flex justify-between py-2.5 text-sm">
                <span className="font-medium text-gray-800">{item.title}</span>
                <span className="text-gray-500">{item.company}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
