// import { useContext, useEffect, useState } from "react"
// import Footer from "../components/Footer"
// import Navbar from "../components/Navbar"
// import {ImCross} from 'react-icons/im'
// import axios from "axios"
// import { URL } from "../url"
// import { useNavigate, useParams } from "react-router-dom"
// import { UserContext } from "../context/UserContext"


// const EditPost = () => {

//     const postId=useParams().id
//     const {user}=useContext(UserContext)
//     const navigate=useNavigate()
//     const [title,setTitle]=useState("")
//     const [desc,setDesc]=useState("")
//     const [file,setFile]=useState(null)
//     const [cat,setCat]=useState("")
//     const [cats,setCats]=useState([])

//     const fetchPost=async()=>{
//       try{
//         const res=await axios.get(URL+"/api/posts/"+postId)
//         setTitle(res.data.title)
//         setDesc(res.data.desc)
//         setFile(res.data.photo)
//         setCats(res.data.categories)

//       }
//       catch(err){
//         console.log(err)
//       }
//     }

//     const handleUpdate = async (e) => {
//       e.preventDefault();
//       const post = {
//           title,
//           desc,
//           username: user.username,
//           userId: user._id,
//           categories: cats
//       };
  
//       if (file) {
//           const data = new FormData();
//           data.append("file", file);
//           try {
//               const uploadRes = await axios.post(URL + "/api/upload", data, {
//                   withCredentials: true,
//                   headers: {
//                       'Content-Type': 'multipart/form-data'
//                   }
//               });
//               post.photo = uploadRes.data.url;
//           } catch (err) {
//               console.log(err);
//               return;
//           }
//       }
      
//       try {
//           const res = await axios.put(URL + "/api/posts/" + postId, post, {
//               withCredentials: true
//           });
//           navigate("/posts/post/" + res.data._id);
//       } catch (err) {
//           console.log(err);
//           if (err.response?.data?.error) {
//               alert(err.response.data.error);
//           }
//       }
//   };

    

//     useEffect(()=>{
//       fetchPost()
//     },[postId])

//     const deleteCategory=(i)=>{
//        let updatedCats=[...cats]
//        updatedCats.splice(i)
//        setCats(updatedCats)
//     }

//     const addCategory=()=>{
//         let updatedCats=[...cats]
//         updatedCats.push(cat)
//         setCat("")
//         setCats(updatedCats)
//     }
//   return (
//     <div>
//         <Navbar/>
//         <div className='px-6 md:px-[200px] mt-8'>
//         <h1 className='font-bold md:text-2xl text-xl '>Update a post</h1>
//         <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
//           <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter post title' className='px-4 py-2 outline-none'/>
//           <input onChange={(e)=>setFile(e.target.files[0])} type="file"  className='px-4'/>
//           <div className='flex flex-col'>
//             <div className='flex items-center space-x-4 md:space-x-8'>
//                 <input value={cat} onChange={(e)=>setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type="text"/>
//                 <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'>Add</div>
//             </div>

//             {/* categories */}
//             <div className='flex px-4 mt-3'>
//             {cats?.map((c,i)=>(
//                 <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
//                 <p>{c}</p>
//                 <p onClick={()=>deleteCategory(i)} className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
//             </div>
//             ))}
            
            
//             </div>
//           </div>
//           <textarea onChange={(e)=>setDesc(e.target.value)} value={desc} rows={15} cols={30} className='px-4 py-2 outline-none' placeholder='Enter post description'/>
//           <button onClick={handleUpdate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'>Update</button>
//         </form>

//         </div>
//         <Footer/>
//     </div>
//   )
// }

// export default EditPost


import { useNavigate, useParams } from "react-router-dom"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from "axios"
import { URL } from "../url"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"


const PostDetails = () => {

  const postId=useParams().id
  const [post,setPost]=useState({})
  const {user}=useContext(UserContext)
  const [comments,setComments]=useState([])
  const [comment,setComment]=useState("")
  const [loader,setLoader]=useState(false)
  const navigate=useNavigate()
  

  const fetchPost=async()=>{
    try{
      const res= await axios.get(URL+"/api/posts/"+postId)
      // console.log(res.data)
      setPost(res.data)
    }
    catch(err){
      console.log(err)
    }
  }

  const handleDeletePost=async ()=>{

    try{
      const res=await axios.delete(URL+"/api/posts/"+postId,{withCredentials:true})
      console.log(res.data)
      navigate("/")

    }
    catch(err){
      console.log(err)
    }

  }

  useEffect(()=>{
    fetchPost()

  },[postId])

  const fetchPostComments=async()=>{
    setLoader(true)
    try{
      const res=await axios.get(URL+"/api/comments/post/"+postId)
      setComments(res.data)
      setLoader(false)

    }
    catch(err){
      setLoader(true)
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchPostComments()

  },[postId])

  const postComment=async(e)=>{
    e.preventDefault()
    try{
      const res=await axios.post(URL+"/api/comments/create",
      {comment:comment,author:user.username,postId:postId,userId:user._id},
      {withCredentials:true})
      
      // fetchPostComments()
      // setComment("")
      window.location.reload(true)

    }
    catch(err){
         console.log(err)
    }

  }


  
  return (
    <div>
        <Navbar/>
        {loader?<div className="h-[80vh] flex justify-center items-center w-full"><Loader/></div>:<div className="px-8 md:px-[200px] mt-8">
        <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
         {user?._id===post?.userId && <div className="flex items-center justify-center space-x-2">
            <p className="cursor-pointer" onClick={()=>navigate("/edit/"+postId)} ><BiEdit/></p>
            <p className="cursor-pointer" onClick={handleDeletePost}><MdDelete/></p>
         </div>}
        </div>
        <div className="flex items-center justify-between mt-2 md:mt-4">
        <p>@{post.username}</p>
       <div className="flex space-x-2">
       <p>{new Date(post.updatedAt).toString().slice(0,15)}</p>
       <p>{new Date(post.updatedAt).toString().slice(16,24)}</p>
       </div>
        </div>
        <img src={post.photo} className="w-full  mx-auto mt-8" alt=""/>
         <p className="mx-auto mt-8">{post.desc}</p>
         <div className="flex items-center mt-8 space-x-4 font-semibold">
          <p>Categories:</p>
          <div className="flex justify-center items-center space-x-2">
          {post.categories?.map((c,i)=>(
            <>
            <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
            </>
            
          ))}
            
          </div>
         </div>
         <div className="flex flex-col mt-4">
         <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
         {comments?.map((c)=>(
          <Comment key={c._id} c={c} post={post} />
         ))}
           
         </div>
         {/* write a comment */}
         <div className="w-full flex flex-col mt-4 md:flex-row">
          <input onChange={(e)=>setComment(e.target.value)} type="text" placeholder="Write a comment" className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"/>
          <button onClick={postComment} className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0">Add Comment</button>
         </div>
        </div>}
        <Footer/>
    </div>
  )
}

export default PostDetails