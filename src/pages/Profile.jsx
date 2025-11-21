import { useEffect, useState } from "react";
import { auth } from "../firebase";
import api from "../utils/api";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        try {
          const projectRes = await api.get("/projects", {
            params: { owner: u.uid },
          });
          setProjects(projectRes.data.projects || []);

          const bookmarkRes = await api.get(`/bookmarks/${u.uid}`);
          setBookmarks(bookmarkRes.data || []);
        } catch (err) {
          console.error("Error loading profile data", err);
        }
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-lg">Please login</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* HEADER */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">Profile</h2>

        <p className="text-gray-600 mt-2 text-lg">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="text-gray-600 text-lg">
          <strong>Username:</strong> {user.uname || "Not set"}
        </p>
      </div>

      {/* USER PROJECTS */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Your Projects
        </h3>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="grid gap-4">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-white p-4 shadow-sm rounded-lg border hover:shadow-md transition"
              >
                <h4 className="text-lg font-medium text-gray-800">{p.title}</h4>
                <Link
                  to={`/project/${p._id}`}
                  className="text-blue-600 mt-2 inline-block hover:underline"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKMARKS */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Bookmarked Projects
        </h3>

        {bookmarks.length === 0 ? (
          <p className="text-gray-500">No bookmarks yet.</p>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((b) => (
              <div
                key={b._id}
                className="bg-white p-4 shadow-sm rounded-lg border hover:shadow-md transition"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {b.projectId?.title}
                </h4>

                <Link
                  to={`/project/${b.projectId?._id}`}
                  className="text-blue-600 mt-2 inline-block hover:underline"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
