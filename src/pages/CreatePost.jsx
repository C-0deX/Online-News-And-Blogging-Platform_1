import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {ImCross} from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(UserContext)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const deleteCategory = (i) => {
    const updatedCats = [...cats]
    updatedCats.splice(i, 1)
    setCats(updatedCats)
  }

  const addCategory = () => {
    if (cat.trim() !== "" && !cats.includes(cat)) {
      setCats([...cats, cat])
      setCat("")
    }
  }
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!title || !desc || cats.length === 0) {
        setError("Please fill all fields and add at least one category");
        return;
    }

    const post = {
        title,
        desc,
        username: user.username,
        userId: user._id,
        categories: cats
    };

    try {
        // Upload image if exists
        if (file) {
            const data = new FormData();
            data.append("file", file);
            const uploadRes = await axios.post(URL + "/api/upload", data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            post.photo = uploadRes.data.url;
        }

        // Create post
        const res = await axios.post(URL + "/api/posts/create", post, {
            withCredentials: true
        });
        navigate("/posts/post/" + res.data._id);
    } catch (err) {
        console.error("Error creating post:", err);
        setError(err.response?.data?.error || "Failed to create post");
    }
};

  return (
    <div>
      <Navbar/>
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl'>Create a post</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
          <input 
            onChange={(e) => setTitle(e.target.value)} 
            type="text" 
            placeholder='Enter post title' 
            className='px-4 py-2 outline-none border rounded-md'
            value={title}
          />
          <input 
            onChange={(e) => setFile(e.target.files[0])} 
            type="file"  
            className='px-4 border rounded-md py-2'
          />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input 
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className='px-4 py-2 outline-none border rounded-md'
                placeholder='Enter post category' 
                type="text"
              />
              <div 
                onClick={addCategory} 
                className='bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-md'
              >
                Add
              </div>
            </div>

            {/* categories */}
            <div className='flex flex-wrap px-4 mt-3 gap-2'>
              {cats?.map((c, i) => (
                <div key={i} className='flex justify-center items-center space-x-2 bg-gray-200 px-2 py-1 rounded-md'>
                  <p>{c}</p>
                  <p 
                    onClick={() => deleteCategory(i)} 
                    className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'
                  >
                    <ImCross/>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <textarea 
            onChange={(e) => setDesc(e.target.value)} 
            rows={15} 
            cols={30} 
            className='px-4 py-2 outline-none border rounded-md' 
            placeholder='Enter post description'
            value={desc}
          />
          <button 
            onClick={handleCreate} 
            className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg rounded-md hover:bg-gray-800'
          >
            Create
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  )
}

export default CreatePost
