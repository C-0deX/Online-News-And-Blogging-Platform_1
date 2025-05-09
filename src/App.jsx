import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from './pages/PostDetails';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Profile from './pages/Profile';
import MyBlogs from './pages/MyBlogs';
import { UserContext } from './context/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/posts/post/:id" element={<PostDetails />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/write" element={user ? <CreatePost /> : <Navigate to="/login" />} />
      <Route path="/edit/:id" element={user ? <EditPost /> : <Navigate to="/login" />} />
      <Route path="/myblogs/:id" element={user ? <MyBlogs /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;