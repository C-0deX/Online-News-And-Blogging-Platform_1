
import { useContext } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";

const Comment = ({ c, post }) => {
  const { user } = useContext(UserContext);

  const deleteComment = async (id) => {
    try {
      // Check if user is comment author OR blog owner admin
      if (user._id !== c.userId && user._id !== post.userId) {
        alert("You can only delete your own comments");
        return;
      }

      await axios.delete(`${URL}/api/comments/${id}`, { 
        withCredentials: true 
      });
      window.location.reload();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="px-2 py-2 bg-gray-200 rounded-lg my-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
        <div className="flex items-center space-x-4">
          <p>{new Date(c.updatedAt).toString().slice(0, 15)}</p>
          <p>{new Date(c.updatedAt).toString().slice(16, 24)}</p>
          
          {/* Show delete button if: 
              1. User is comment author OR 
              2. User is admin owner of the post */}
          {(user?._id === c.userId || (user?.role === "admin" && user?._id === post.userId)) && (
            <button 
              onClick={() => deleteComment(c._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="px-4 mt-2">{c.comment}</p>
    </div>
  );
};

export default Comment;