

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useParams, Navigate, Link } from "react-router-dom"; // Added Link import
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfilePosts from "../components/ProfilePosts";
import { UserContext } from "../context/UserContext";
import Loader from '../components/Loader';

const MyBlogs = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${URL}/api/posts/user/${id}`, {
          withCredentials: true
        });
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] min-h-[80vh]">
        <h1 className="text-xl font-bold mt-8 mb-4">Your Blogs</h1>
        {loading ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/posts/post/${post._id}`}
              key={post._id}
              className="block hover:bg-gray-100 transition-colors duration-200"
            >
              <ProfilePosts p={post} />
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16">You haven't created any blogs yet</h3>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBlogs;