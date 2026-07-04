import { Link } from "react-router-dom";
import Button from "../components/common/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
      <p className="mt-3 text-gray-600">Page not found.</p>
      <Link to="/" className="mt-6">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
