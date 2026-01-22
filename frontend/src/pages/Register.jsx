import { useState } from "react";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", { name, email, password });
    alert("Registered successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={submit} className="bg-gray-800 p-6 rounded text-white w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input className="w-full mb-3 p-2 text-black"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input className="w-full mb-3 p-2 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input className="w-full mb-3 p-2 text-black"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 w-full p-2">Register</button>
      </form>
    </div>
  );
}
