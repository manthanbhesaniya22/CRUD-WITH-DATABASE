import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function PostShow() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/posts/" + id)
      .then((res) => {
        setTitle(res.data.title);
        setBody(res.data.body);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]); // ✅ dependency added

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Bar */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          ← Back
        </Link>
      </div>

      {/* Center */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Show Post
          </h1>

          <p className="text-lg mb-2">
            <strong>Title:</strong> {title}
          </p>

          <p className="text-gray-700">
            <strong>Body:</strong> {body}
          </p>

        </div>
      </div>
    </div>
  );
}
