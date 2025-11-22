import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorr, setError] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    if(!email || !password){
      return setError("Please fill all fields");;
    } 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/");
    } catch (err) { setError("Login failed"); }
  };
return (
  <div className="px-4 py-8 max-w-md mx-auto">

    {/* Error Message */}
    {errorr && (
      <div
        className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3 mb-4 text-sm cursor-pointer"
        onClick={() => setError("")}
      >
        {errorr}
      </div>
    )}

    {/* Title */}
    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
      Login
    </h2>

    {/* Email */}
    <input
      className="border w-full p-3 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
    />

    {/* Password */}
    <input
      className="border w-full p-3 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
    />

    {/* Login Button */}
    <button
      onClick={submit}
      className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
    >
      Login
    </button>

    {/* Signup Link */}
    <p
      className="text-blue-600 text-center mt-4 cursor-pointer hover:underline"
      onClick={() => nav("/signup")}
    >
      New user? Register here
    </p>
  </div>
);

}

export default Login;
