import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { URL } from "../url";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";
import Loader from '../components/Loader';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef();
  const { user, setUser } = useContext(UserContext);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${URL}/api/users/${id}`);
      setUserProfile(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await axios.post(`${URL}/api/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (user._id !== id) {
        throw new Error("You can only update your own profile");
      }

      const updateRes = await axios.put(
        `${URL}/api/users/${id}`,
        { img: uploadRes.data.url },
        { withCredentials: true }
      );

      setUserProfile(updateRes.data);
      setUser(updateRes.data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    try {
      if (user._id !== id) {
        throw new Error("You can only update your own profile");
      }

      const updateRes = await axios.put(
        `${URL}/api/users/${id}`,
        formData,
        { withCredentials: true }
      );

      setUserProfile(updateRes.data);
      setUser(updateRes.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || err.message || "Update failed");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (user._id !== id) {
        throw new Error("You can only delete your own account");
      }

      if (!window.confirm("Are you sure you want to delete your account? This cannot be undone!")) {
        return;
      }

      await axios.delete(`${URL}/api/users/${id}`, { withCredentials: true });

      // Logout and redirect
      await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      navigate("/");
      alert("Your account has been deleted");
    } catch (err) {
      console.error("Deletion failed:", err);
      alert(err.response?.data?.message || err.message || "Deletion failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center mt-8">User not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8 mb-12">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold">Profile Page</h1>

          <div className="mt-8 bg-gray-100 p-8 rounded-lg w-full max-w-2xl">
            <div className="flex flex-col items-center space-y-6">
              {/* Profile Picture */}
              <div className="relative group">
                {userProfile.img ? (
                  <img
                    src={userProfile.img}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </div>
                )}

                {user && user._id === id && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-all
                        ${uploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        }`}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <span className="text-white text-sm">Uploading...</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Profile Info */}
              <div className="w-full space-y-4">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-center">{userProfile.username}</h2>
                    {user && user._id === id && (
                      <p className="text-gray-600 text-center">{userProfile.email}</p>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons (only for own profile) */}
              {user && user._id === id && (
                <div className="flex space-x-4">
                  {editing ? (
                    <>
                      <button
                        onClick={handleUpdateProfile}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Edit Profile
                    </button>
                  )}

                  {!editing && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full">
                    <h3 className="text-lg font-bold mb-4">Confirm Account Deletion</h3>
                    <p className="mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Profile;