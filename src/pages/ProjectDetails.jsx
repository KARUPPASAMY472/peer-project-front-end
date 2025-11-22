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
  const [liked, setLiked] = useState(false);


  const load = async () => {
    let res = null; // project response

    try {
      // 1. Load project
      res = await api.get(`/projects/${id}`);
      setProject(res.data);

      // 2. Load comments
      const c = await api.get(`/projects/${id}/comments`);
      setComments(c.data);

    } catch (err) {
      console.error("Error loading project", err);
    }

    // 3. After project loads, check user actions (like & bookmark)
    const user = auth.currentUser;
    if (user && res) {

      // ⭐ Check Like
      setLiked(res.data.likes.includes(user.uid));

      // ⭐ Check Bookmark
      try {
        const b = await api.get(`/bookmarks/check`, {
          params: { userUid: user.uid, projectId: id },
        });
        setBookmarked(b.data.bookmarked === true);
      } catch (err) {
        console.error("Bookmark check error:", err);
      }
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

    // Refresh project + liked state
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
        setBookmarked(true); // already bookmarked
      }
    }

  };

  if (!project) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">

      {/* Project Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
        {project.title}
      </h1>

      <div className="mt-2 text-gray-500 text-sm sm:text-base">
        By <span className="font-semibold">{project.ownerName || "Unknown"}</span> •{" "}
        {new Date(project.createdAt).toLocaleString()}
      </div>

      {/* Description */}
      <p className="mt-6 text-base sm:text-lg text-gray-800 leading-relaxed">
        {project.description}
      </p>

      {/* Github link */}
      <div className="mt-5">
        <a
          className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2"
          href={project.githubLink}
          target="_blank"
        >
          Visit GitHub →
        </a>
      </div>

      {/* Demo link */}
      <div className="mt-3">
        <a
          className="text-blue-600 hover:text-blue-700 font-medium underline decoration-2"
          href={project.demoLink}
          target="_blank"
        >
          Visit Live Link →
        </a>
      </div>

      {/* Rating */}
      <div className="mt-5 flex gap-6 text-gray-700 font-medium">
        <p>⭐ Rating: {project.rating?.total || 0}</p>
        <p>👁 Views: {project.rating?.count || 0}</p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
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
      <div className="mt-8 flex flex-wrap gap-4 items-center">

        {/* Like button */}
        <button
          onClick={toggleLike}
          className={`px-4 py-2 border rounded-xl flex items-center gap-2 shadow-sm transition
          ${liked ? "bg-red-100 border-red-300" : "bg-gray-100 hover:bg-gray-200"}
        `}
        >
          <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
          {project?.likes?.length || 0}
        </button>

        {/* Rating stars */}
        <div className="flex gap-1 sm:gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => rate(n)}
              className="text-yellow-500 text-xl hover:scale-110 transition"
            >
              ⭐
            </button>
          ))}
        </div>

        {/* Bookmark button */}
        <button
          onClick={addBookmark}
          disabled={bookmarked}
          className={`px-5 py-2 rounded-xl shadow-sm text-white transition
          ${bookmarked
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }
        `}
        >
          {bookmarked ? "Bookmarked ✓" : "Bookmark"}
        </button>
      </div>

      {/* COMMENTS */}
      <div className="mt-12">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">Comments</h3>

        {/* Comment list */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="p-4 sm:p-5 border rounded-xl bg-white shadow-sm"
            >
              <div className="text-sm font-semibold text-gray-800">
                {c.userName}
              </div>
              <div className="text-gray-700 mt-1">{c.text}</div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="mt-6">
          <textarea
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
          />

          <button
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700"
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
