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
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="border p-2"/>
        <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag (e.g. React)" className="border p-2"/>
        <button onClick={() => { setPage(1); load(); }} className="bg-blue-700 text-white px-4">Search</button>
        <Link to="/add" className="ml-auto bg-slate-800 border-gray-200 border hover:bg-gray-200 hover:text-slate-700 text-white px-4 py-2 rounded">Add Project</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p._id} className="p-4 border rounded">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                
            <p className="text-sm">{p.description?.slice(0, 120)}{p.description?.length > 120 ? "..." : ""}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {p.tags?.map(t => (<span key={t} className="text-xs px-2 py-1 bg-gray-200 rounded">{t}</span>))}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <Link to={`/project/${p._id}`} className="text-blue-600">View →</Link>
              <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button disabled={page<=1} onClick={() => setPage(p => p-1)} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page} — {total} results</div>
        <button disabled={projects.length === 0} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}

export default Home;
