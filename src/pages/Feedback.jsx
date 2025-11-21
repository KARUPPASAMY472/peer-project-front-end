import { useState } from "react";
import api from "../utils/api";
import { auth } from "../firebase";

function Feedback() {
  const [text, setText] = useState("");
  const [success, setSuccess] = useState("");

  const submitFeedback = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login to submit feedback");

    if (text.trim() === "") {
      return alert("Feedback cannot be empty");
    }

    try {
      await api.post("/feedback", {
        userUid: user.uid,
        userEmail: user.email,
        message: text,
      });

      setSuccess("Thank you! Your feedback has been submitted.");
      setText("");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Feedback error:", err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Feedback</h1>

      <p className="text-gray-600 mb-4">
        We value your feedback! Share your thoughts about the platform.
      </p>

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
          {success}
        </div>
      )}

      <textarea
        className="w-full border p-3 rounded-lg h-32"
        placeholder="Write your feedback..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={submitFeedback}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}

export default Feedback;
