import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await API.post("/projects", { title, description });
    setTitle("");
    setDescription("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Create Project */}
      <form onSubmit={createProject} className="mb-6 flex gap-2 flex-wrap">
        <input
          className="p-2 text-black"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="p-2 text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-green-600 px-4 py-2 rounded">Create</button>
      </form>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="font-bold text-lg">{p.title}</h2>
            <p className="text-sm text-gray-300 mb-3">{p.description}</p>

            <button
              onClick={() => navigate(`/projects/${p._id}`)}
              className="bg-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-700"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
