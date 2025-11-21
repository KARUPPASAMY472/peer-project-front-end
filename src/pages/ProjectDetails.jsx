import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import { auth } from "../firebase";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  const load = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);

      const c = await api.get(`/projects/${id}/comments`);
      setComments(c.data);
    } catch (err) {
      console.error("Error loading project", err);
    }
  };

  const loadBookmarkStatus = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const res = await api.get(`/bookmarks/check`, {
        params: { userUid: user.uid, projectId: id },
      });
      setBookmarked(res.data.exists);
    } catch (err) {
      console.error("Bookmark check error", err);
    }
  };

  useEffect(() => {
    load();
    loadBookmarkStatus();
  }, [id]);

  const addComment = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login");

    try {
      const res = await api.post(`/projects/${id}/comments`, {
        text,
        userUid: user.uid,
        userName: user.displayName || user.email,
      });
      setComments(res.data);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login");

    await api.post(`/projects/${id}/like`, { userUid: user.uid });
    await load();
  };

  const rate = async (value) => {
    const user = auth.currentUser;
    if (!user) return alert("Please login");

    await api.post(`/projects/${id}/rate`, { userUid: user.uid, value });
    await load();
  };

  const addBookmark = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login");

    try {
      await api.post(`/bookmarks`, { userUid: user.uid, projectId: id });
      setBookmarked(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setBookmarked(true);
      } else {
        console.error("Bookmark error:", err);
      }
    }
  };

  if (!project) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Project Title */}
      <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>

      <div className="mt-1 text-gray-500 text-sm">
        By <span className="font-semibold">{project.ownerName || "Unknown"}</span> •{" "}
        {new Date(project.createdAt).toLocaleString()}
      </div>

      {/* Description */}
      <p className="mt-5 text-lg text-gray-800 leading-relaxed">
        {project.description}
      </p>

      {/* Github link */}
      <div className="mt-4">
        <a
          className="text-blue-600 underline hover:text-blue-800 font-medium"
          href={project.githubLink}
          target="_blank"
        >
          Visit GitHub →
        </a>
      </div>

      {/* Rating */}
      <p className="mt-4 font-medium text-gray-700">
        ⭐ Rating: {project.rating?.total || 0}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags?.map((t) => (
          <span
            key={t}
            className="text-xs px-3 py-1 bg-gray-100 border border-gray-300 rounded-full"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={toggleLike}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border rounded-lg"
        >
          ❤️ Like ({project.likes?.length || 0})
        </button>
       
        <div className="flex gap-2">
  {[1,2,3,4,5].map(n => (
    <button
      key={n}
      onClick={() => rate(n)}
      className="py-2 text-yellow-600 text-xl"
    >
      ⭐
    </button>
  ))}
</div>

        <button
          onClick={addBookmark}
          disabled={bookmarked}
          className={`px-4 py-2 rounded-lg text-white ${
            bookmarked
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {bookmarked ? "Bookmarked ✓" : "Bookmark"}
        </button>
      </div>

      {/* COMMENTS */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-3">Comments</h3>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c._id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="text-sm font-semibold text-gray-800">{c.userName}</div>
              <div className="text-gray-700 mt-1">{c.text}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="mt-4">
          <textarea
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />

          <button
            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            onClick={addComment}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
