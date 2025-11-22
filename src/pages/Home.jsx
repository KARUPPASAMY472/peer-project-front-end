import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

function Home(){
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    try {
      const res = await api.get("/projects", { params: { q, tag, page, limit: 9 } });
      setProjects(res.data.projects);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [q, tag, page]);

  return (
  <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">

    {/* Search Bar */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        className="border w-full sm:w-1/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tag (e.g. React)"
        className="border w-full sm:w-1/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={() => { setPage(1); load(); }}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Search
      </button>

      <Link
        to="/add"
        className="sm:ml-auto bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-900 transition"
      >
        Add Project
      </Link>
    </div>

    {/* Project Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((p) => (
        <div
          key={p._id}
          className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {p.title}
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {p.description?.slice(0, 120)}
            {p.description?.length > 120 ? "..." : ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags?.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 bg-gray-100 border rounded-full"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Link
              to={`/project/${p._id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              View →
            </Link>
            <div className="text-xs text-gray-500">
              {new Date(p.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination */}
    <div className="mt-6 flex justify-center items-center gap-4 text-sm">

      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
        className={`px-4 py-2 rounded-lg border transition ${
          page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      <div className="font-medium">
        Page {page} — {total} results
      </div>

      <button
        disabled={projects.length === 0}
        onClick={() => setPage((p) => p + 1)}
        className={`px-4 py-2 rounded-lg border transition ${
          projects.length === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>

    </div>
  </div>
);

}

export default Home;
