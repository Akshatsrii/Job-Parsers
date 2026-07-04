import { Link } from "react-router-dom";
import { ArrowRight, Zap, Layers, ShieldCheck } from "lucide-react";
import Button from "../components/common/Button.jsx";
import { SUPPORTED_SITES } from "../utils/constants.js";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Extraction",
    desc: "Paste any job URL and get structured data in seconds.",
  },
  {
    icon: Layers,
    title: "Multi-Site Support",
    desc: "Works with Internshala, Naukri, LinkedIn, Indeed and more.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Fallback",
    desc: "3-level extraction engine ensures data is found even on unknown sites.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Extract Job Data from{" "}
          <span className="text-primary-600">Any URL</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Paste a job posting link and instantly get title, company, salary,
          skills and description — structured and ready to use.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to="/parser">
            <Button icon={ArrowRight}>Try the Parser</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center">
            <Icon size={28} className="mx-auto text-primary-600" />
            <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          Supported Platforms
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {SUPPORTED_SITES.map((site) => (
            <span
              key={site.domain}
              className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700"
            >
              {site.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
