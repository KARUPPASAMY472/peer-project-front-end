import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [uname, setUname] = useState("");
   const [errorr, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if(!email || !password){
      setError("Please fill all fields");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password, uname);
      nav("/");
    } catch (err) { setError("Already user used this email address"); }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {errorr && <div className="bg-red-200 bg- text-red-800 p-2 mb-4 cursor-pointer  " onClick={()=>setError("")}>{errorr}</div>}  
      <h2 className="text-2xl">SignUp Page</h2>
      <input className="border p-2 w-full mt-4" value={uname} onChange={e=>setUname(e.target.value)} placeholder="User Name"/>
      
      <input className="border p-2 w-full mt-4" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
      <input className="border p-2 w-full mt-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/>
      <button onClick={submit} className="mt-4 bg-blue-600 text-white px-4 py-2">Login</button>
    </div>
  );
}

export default Login;
