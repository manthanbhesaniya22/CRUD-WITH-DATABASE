import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PostIndex() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadingRef = useRef(null);

  const loadPosts = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    axios
      .get(`http://localhost:8000/api/posts?page=${page}`)
      .then((res) => {
        const newData = res.data.data || res.data;

        setTimeout(() => {
          if (newData.length < 10) {
            setHasMore(false);
          }
          setPosts((prev) => [...prev, ...newData]);
          setPage((prev) => prev + 1);
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, posts]);
// 
  function deletePost(id) {
    if (window.confirm("Do you want to delete?")) {
      axios.delete(`http://localhost:8000/api/posts/${id}`).then(() => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      });
    }
  }

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-gray-800">CRUD App</h1>
      <Link
        to="/create"
        className="px-4 py-2 bg-blue-600 text-white rounded-md w-24 text-center font-medium shadow-md hover:bg-blue-700 transition"
      >
        Create
      </Link>

      <div className="p-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-6 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-700">
              <tr>
                <th className="px-6 py-4 text-left border-b">ID</th>
                <th className="px-6 py-4 text-left border-b">Title</th>
                <th className="px-6 py-4 text-left border-b">Body</th>
                <th className="px-6 py-4 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{post.id}</td>
                  <td className="px-6 py-4 text-gray-600">{post.title}</td>
                  <td className="px-6 py-4 text-gray-600">{post.body}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link to={`/show/${post.id}`} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-green-700">Show</Link>
                      <Link to={`/edit/${post.id}`} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-700">Edit</Link>
                      <button onClick={() => deletePost(post.id)} className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Yeh element trigger karega loading ko jab user 10th row ke niche pahunchega */}
        <div ref={loadingRef} className="h-10 flex justify-center items-center mt-4">
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
              <span className="text-blue-600 font-bold text-sm">Loading more posts...</span>
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <p className="text-gray-400 font-medium">No more data to load.</p>
          )}
        </div>
      </div>
    </div>
  );
}