import { Trash2, ExternalLink } from "lucide-react";
import useParser from "../hooks/useParser.js";
import Button from "../components/common/Button.jsx";
import { formatDate, getDomainFromUrl } from "../utils/formatter.js";

export default function History() {
  const { history, removeFromHistory, clearHistory } = useParser();

  if (history.length === 0) {
    return (
      <div className="card text-center text-sm text-gray-500">
        No parsed jobs yet. Go to the Parser page to extract your first job.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <Button variant="danger" icon={Trash2} onClick={clearHistory}>
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="card flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-900">{item.title || "Untitled Job"}</p>
              <p className="truncate text-sm text-gray-600">
                {item.company} · {getDomainFromUrl(item.sourceUrl)} · {formatDate(item.parsedAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" icon={ExternalLink}>
                  Open
                </Button>
              </a>
              <Button variant="secondary" icon={Trash2} onClick={() => removeFromHistory(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
