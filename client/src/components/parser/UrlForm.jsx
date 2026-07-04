import { useState } from "react";
import { Link2, Search } from "lucide-react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { validateUrlInput } from "../../utils/validator.js";
import useParser from "../../hooks/useParser.js";
import { PARSE_STATUS } from "../../utils/constants.js";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState("1");
  const [fieldError, setFieldError] = useState("");
  const { parseUrl, status } = useParser();

  const isLoading = status === PARSE_STATUS.LOADING;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, message } = validateUrlInput(url);
    if (!valid) {
      setFieldError(message);
      return;
    }
    setFieldError("");
    try {
      await parseUrl(url.trim(), parseInt(pages) || 1);
    } catch {
      // error already surfaced via toast + context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            icon={Link2}
            placeholder="Paste a listing URL, e.g. https://internshala.com/internships/wfh-jobs"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={fieldError}
          />
        </div>
        <Button type="submit" icon={Search} loading={isLoading} className="sm:mt-0">
          {isLoading ? "Parsing..." : "Extract Data"}
        </Button>
      </div>

      <div className="flex items-center gap-2 pl-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Pages to scrape (for list pages):
        </label>
        <select
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white py-1 px-2 text-xs font-medium text-gray-700 shadow-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="1">1 Page</option>
          <option value="2">2 Pages</option>
          <option value="3">3 Pages</option>
          <option value="5">5 Pages</option>
          <option value="10">10 Pages (Max)</option>
        </select>
      </div>
    </form>
  );
}
