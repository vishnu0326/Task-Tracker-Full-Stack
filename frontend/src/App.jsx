import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const API_URL = "http://localhost:8080";

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data.tasks);
  };

  const createTask = async () => {
    if (!title || !description) return;

    await axios.post(`${API_URL}/tasks`, {
      title,
      description,
      status: "pending"
    });

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    const newStatus =
      task.status === "pending" ? "completed" : "pending";

    await axios.put(`${API_URL}/tasks/${task._id}`, {
      status: newStatus
    });

    fetchTasks();
  };

  // 🔥 START EDIT
  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // 🔥 SAVE EDIT
  const saveEdit = async (id) => {
    await axios.put(`${API_URL}/tasks/${id}`, {
      title: editTitle,
      description: editDescription
    });

    setEditingId(null);
    fetchTasks();
  };

  useEffect(() => {
    if (filter === "all") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(
        tasks.filter((task) => task.status === filter)
      );
    }
  }, [tasks, filter]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Task Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow w-32 text-center">
          <p>Total</p>
          <h2 className="font-bold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow w-32 text-center">
          <p>Completed</p>
          <h2 className="text-green-500 font-bold">{completed}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow w-32 text-center">
          <p>Pending</p>
          <h2 className="text-yellow-500 font-bold">{pending}</h2>
        </div>
      </div>

      {/* Input */}
      <div className="flex justify-center gap-2 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
        />

        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
        />

        <button onClick={createTask} className="bg-blue-500 text-white px-4 rounded">
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setFilter("all")} className="bg-gray-300 px-3 py-1 rounded">
          All
        </button>
        <button onClick={() => setFilter("pending")} className="bg-yellow-300 px-3 py-1 rounded">
          Pending
        </button>
        <button onClick={() => setFilter("completed")} className="bg-green-300 px-3 py-1 rounded">
          Completed
        </button>
      </div>

      {/* Tasks */}
      <div className="max-w-xl mx-auto">
        {filteredTasks.map((task) => (
          <div key={task._id} className="bg-white p-4 mb-3 rounded shadow">

            {editingId === task._id ? (
              <>
                <input
                  className="border p-1 mb-2 w-full"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <input
                  className="border p-1 mb-2 w-full"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <button
                  onClick={() => saveEdit(task._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="text-gray-500">{task.description}</p>

                <p className={`font-bold ${
                  task.status === "completed"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}>
                  {task.status}
                </p>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => toggleStatus(task)} className="bg-green-500 text-white px-2 rounded">
                    Toggle
                  </button>

                  <button onClick={() => deleteTask(task._id)} className="bg-red-500 text-white px-2 rounded">
                    Delete
                  </button>

                  <button onClick={() => startEdit(task)} className="bg-blue-500 text-white px-2 rounded">
                    Edit
                  </button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default App;