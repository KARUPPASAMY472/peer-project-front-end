import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";

function AddProject() {
  const nav = useNavigate();
  const { id } = useParams(); // Used for edit mode

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [loading, setLoading] = useState(true);

  // Load existing project if editing
  useEffect(() => {
    if (id) {
      api
        .get(`/projects/${id}`)
        .then((res) => {
          const p = res.data;

          setTitle(p.title);
          setDesc(p.description);
          setTags((p.tags || []).join(","));
          setGithub(p.githubLink || "");
          setDemo(p.demoLink || "");
        })
        .catch((err) => console.error("Failed to load project", err));
    }
    setLoading(false);
  }, [id]);

  const submit = async () => {
    try {
      const user = auth.currentUser;

      if (!title.trim() || !desc.trim()) {
        alert("Title and Description are required");
        return;
      }

      const payload = {
        title,
        description: desc,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        githubLink: github,
        demoLink: demo,
        ownerUid: user?.uid,
        ownerName: user?.displayName || user?.email,
      };

      if (id) {
        // EDIT MODE
        await api.put(`/projects/${id}`, payload);
      } else {
        // ADD MODE
        await api.post("/projects", payload);
      }

      nav("/profile");
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        {id ? "Edit Project" : "Add New Project"}
      </h2>

      <input
        className="border p-2 w-full mt-4"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mt-4"
        rows="4"
        placeholder="Project Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        className="border p-2 w-full mt-4"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        className="border p-2 w-full mt-4"
        placeholder="GitHub Link"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />

      <input
        className="border p-2 w-full mt-4"
        placeholder="Demo Link"
        value={demo}
        onChange={(e) => setDemo(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 mt-6 w-full rounded hover:bg-blue-700"
        onClick={submit}
      >
        {id ? "Update Project" : "Create Project"}
      </button>
    </div>
  );
}

export default AddProject;
