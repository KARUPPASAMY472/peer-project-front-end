import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";

function AddProject(){
  const nav = useNavigate();
  const { id } = useParams(); // optional for edit
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");

  useEffect(() => {
    if(id){
      api.get(`/projects/${id}`).then(r=>{
        const p = r.data;
        setTitle(p.title); setDesc(p.description); setTags((p.tags||[]).join(","));
        setGithub(p.githubLink||""); setDemo(p.demoLink||"");
      }).catch(()=>{});
    }
  }, [id]); 

  const submit = async () => {
    try {
      const user = auth.currentUser;
      const payload = {
        title, description: desc, tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
        githubLink: github, demoLink: demo,
        ownerUid: user?.uid, ownerName: user?.displayName || user?.email
      
      };
      if(id){
        await api.put(`/projects/${id}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">{id ? "Edit" : "Add"} Project</h2>
      <input className="border p-2 w-full mt-4" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mt-4" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
      <input className="border p-2 w-full mt-4" placeholder="Tags comma separated" value={tags} onChange={e=>setTags(e.target.value)} />
      <input className="border p-2 w-full mt-4" placeholder="GitHub Link" value={github} onChange={e=>setGithub(e.target.value)} />
      <input className="border p-2 w-full mt-4" placeholder="Live demo link" value={demo} onChange={e=>setDemo(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 mt-4" onClick={submit}>Save</button>
    </div>
  );
}

export default AddProject;
