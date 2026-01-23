import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import KanbanBoard from "../components/KanbanBoard";

export default function ProjectDetails() {
  const { id } = useParams();

  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const fetchTickets = async () => {
    const res = await API.get(`/tickets/${id}`);
    setTickets(res.data);

    res.data.forEach((t) => fetchComments(t._id));
  };

  const createTicket = async (e) => {
    e.preventDefault();

    await API.post("/tickets", {
      title,
      description,
      priority,
      projectId: id,
    });

    setTitle("");
    setDescription("");
    fetchTickets();
  };

  const fetchComments = async (ticketId) => {
    const res = await API.get(`/comments/${ticketId}`);
    setComments((prev) => ({ ...prev, [ticketId]: res.data }));
  };

  const addComment = async (ticketId) => {
    const text = commentText[ticketId];
    if (!text?.trim()) return;

    await API.post(`/comments/${ticketId}`, { text });

    setCommentText((prev) => ({ ...prev, [ticketId]: "" }));
    fetchComments(ticketId);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl mb-4">Project Tickets</h1>

      {/* Create Ticket */}
      <form onSubmit={createTicket} className="flex gap-2 mb-6">
        <input
          className="p-2 text-black"
          placeholder="Title"
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

        <select
          className="p-2 text-black"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="bg-green-600 px-4">Create</button>
      </form>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-black p-2"
        >
          <option value="All">All</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <input
          className="p-2 text-black"
          placeholder="Search ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Kanban Board */}
      <h2 className="text-xl mb-3">Kanban Board</h2>

      <KanbanBoard tickets={filteredTickets} refresh={fetchTickets} />

      {/* Comments Section (below Kanban) */}
      <div className="mt-8 space-y-4">
        {filteredTickets.map((t) => (
          <div key={t._id} className="bg-gray-800 p-3 rounded">
            <h3 className="font-semibold mb-2">{t.title}</h3>

            <div className="space-y-1 mb-2">
              {(comments[t._id] || []).map((c) => (
                <p key={c._id} className="text-xs text-gray-300">
                  <span className="font-semibold">{c.user.name}:</span>{" "}
                  {c.text}
                </p>
              ))}
            </div>

            <div className="flex gap-1">
              <input
                className="text-black p-1 text-xs flex-1"
                placeholder="Add comment..."
                value={commentText[t._id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [t._id]: e.target.value,
                  }))
                }
              />

              <button
                onClick={() => addComment(t._id)}
                className="bg-blue-600 px-2 text-xs rounded"
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
