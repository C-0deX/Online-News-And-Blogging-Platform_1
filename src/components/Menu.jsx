import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import axios from "axios"
import { URL } from "../url"
import { Link, useNavigate } from "react-router-dom"

const Menu = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(URL + "/api/auth/logout", { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-black w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
      {!user ? (
        <>
          <Link to="/login" className="text-white text-sm hover:text-gray-500 cursor-pointer">Login</Link>
          <Link to="/register" className="text-white text-sm hover:text-gray-500 cursor-pointer">Register</Link>
        </>
      ) : (
        <>
          <Link to={`/profile/${user._id}`} className="text-white text-sm hover:text-gray-500 cursor-pointer">Profile</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/write" className="text-white text-sm hover:text-gray-500 cursor-pointer">Write</Link>
              <Link to={`/myblogs/${user._id}`} className="text-white text-sm hover:text-gray-500 cursor-pointer">My Blogs</Link>
            </>
          )}
          <div onClick={handleLogout} className="text-white text-sm hover:text-gray-500 cursor-pointer">Logout</div>
        </>
      )}
    </div>
  )
}

export default Menu