import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PostIndex() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);

  const loadPosts = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    axios.get(`http://localhost:8000/api/posts?page=${page}`)
      .then((res) => {
        setTimeout(() => {
          if (res.data.length < 10) setHasMore(false);
          setPosts((prev) => [...prev, ...res.data]);
          setPage((prev) => prev + 1);
          setLoading(false);
        }, 1000);
      })
      .catch(() => setLoading(false));
  }, [loading, hasMore, page]);

  useEffect(() => {
    const currentRef = loadingRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadPosts();
        }
      },
      { threshold: 0.5 }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loadPosts, loading, hasMore]);

  const deletePost = (id) => {
    if (window.confirm("Delete?")) {
      axios.delete(`http://localhost:8000/api/posts/${id}`).then(() => {
        setPosts(prev => prev.filter(p => p.id !== id));
      });
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">CRUD App</h1>
      <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
        Create New Post
      </Link>
      
      <div className="mt-6">
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-full md:w-1/3 mb-4 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 font-bold text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Body</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{post.id}</td>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4 text-gray-600">{post.body}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <Link to={`/show/${post.id}`} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition">Show</Link>
                    <Link to={`/edit/${post.id}`} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition">Edit</Link>
                    <button onClick={() => deletePost(post.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div ref={loadingRef} className="py-10 flex flex-col items-center">
          {loading && (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="text-blue-600 mt-2 font-bold text-sm tracking-wide">Loading next 10 records...</p>
            </>
          )}
          {!hasMore && posts.length > 0 && (
            <p className="text-gray-400 font-medium italic">--- All posts caught up ---</p>
          )}
        </div>
      </div>
    </div>
  );
}