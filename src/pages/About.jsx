import React from "react";

function About() {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        About This Project
      </h1>

      <p className="text-gray-600 leading-7">
        This platform allows students and developers to share their coding 
        projects, collaborate, and learn from each other. You can upload your 
        projects, bookmark others' work, leave comments, rate projects, and 
        explore creative ideas built by the community.
      </p>

      <div className="mt-8 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          🔥 Features
        </h2>

        <ul className="space-y-2 text-gray-700">
          <li>✔ Upload and showcase your projects</li>
          <li>✔ Like, comment, and rate other projects</li>
          <li>✔ Bookmark interesting work</li>
          <li>✔ Clean UI and fast API</li>
          <li>✔ Firebase authentication</li>
        </ul>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-blue-700">💡 Our Goal</h2>
        <p className="mt-2 text-gray-700">
          To create a collaborative space where students can grow, 
          share knowledge, and develop real-world project experience.
        </p>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm">
          Built using MERN Stack + Firebase Authentication
        </p>
      </div>

    </div>
  );
}

export default About;
