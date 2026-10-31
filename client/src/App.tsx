import { useEffect, useState } from "react";
import api from "./lib/api";

interface HealthResponse {
  success: boolean;
  message: string;
  database: string;
}

function App() {
  const [message, setMessage] = useState("Checking API...");
  const [database, setDatabase] = useState("Checking...");

  useEffect(() => {
    api
      .get<HealthResponse>("/health")
      .then(({ data }) => {
        setMessage(data.message);
        setDatabase(data.database);
      })
      .catch(() => {
        setMessage("Cannot connect to API");
        setDatabase("unknown");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">DevConnect</h1>

        <p className="mt-4 text-slate-400">
          Find developers. Build projects.
        </p>

        <div className="mt-8 space-y-3 rounded-xl border border-slate-700 p-6">
          <p>
            API: <span className="text-green-400">{message}</span>
          </p>

          <p>
            Database: <span className="text-green-400">{database}</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;