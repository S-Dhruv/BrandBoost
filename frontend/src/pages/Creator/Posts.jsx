import React, { useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
  });

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/creator/dashboard/posts/view", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  // Handle input changes for the new post form
  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle form submission to create a new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/creator/dashboard/posts/upload",
        newPost,
        {
          withCredentials: true,
        }
      );
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPost({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {/* Form to create a new post */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newPost.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newPost.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Create Post
        </button>
      </form>

      {/* Display posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-700 mt-2">{post.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;
