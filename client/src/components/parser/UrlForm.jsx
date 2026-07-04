import { useState } from "react";
import { Link2, Search } from "lucide-react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { validateUrlInput } from "../../utils/validator.js";
import useParser from "../../hooks/useParser.js";
import { PARSE_STATUS } from "../../utils/constants.js";

export default function UrlForm() {
  const [url, setUrl] = useState("");
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
      await parseUrl(url.trim());
    } catch {
      // error already surfaced via toast + context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Input
          icon={Link2}
          placeholder="Paste a job URL, e.g. https://internshala.com/job/123"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={fieldError}
        />
      </div>
      <Button type="submit" icon={Search} loading={isLoading} className="sm:mt-0">
        {isLoading ? "Parsing..." : "Extract Data"}
      </Button>
    </form>
  );
}
