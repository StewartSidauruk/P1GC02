import "./App.css";
import TodoCard from "./components/TodoCard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const LoadingSkeleton = () => (
    <div className="space-y-4 w-[370px]">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-[#1f1f1f] p-4 rounded-lg border border-gray-700 animate-pulse"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="h-5 w-5 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-5 w-5 bg-gray-700 rounded"></div>
            <div className="h-5 w-5 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  async function fetchTodos() {
    setIsLoading(true);
    try {
      const response = await fetch("https://tar-brawny-dance.glitch.me/todos", {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      setTodos(result);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Tidak dapat mengambil daftar tugas dari server.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function createTodo(event) {
    event.preventDefault();
    if (!task.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Tugas Kosong",
        text: "Silakan tulis tugas Anda terlebih dahulu.",
      });
      return;
    }
    const newTodo = {
      task: task,
      status: status,
    };
    try {
      const response = await fetch("https://tar-brawny-dance.glitch.me/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      const actualNewTodo = await response.json();

      setTodos([...todos, actualNewTodo]);
      setTask("");
    } catch (error) {
      console.error("Gagal membuat todo:", error);
    }
  }

  async function deleteTodo(id) {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await fetch(`https://tar-brawny-dance.glitch.me/todos/${id}`, {
          method: "DELETE",
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your task has been successfully deleted.",
        });

        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete the task.",
      });
    }
  }

  async function updateTodoStatus(id) {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;

    const newStatus = todoToUpdate.status === "OPEN" ? "COMPLETED" : "OPEN";

    try {
      await fetch(`https://tar-brawny-dance.glitch.me/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        )
      );
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
    }
  }

  async function submitEditTodo(e) {
    e.preventDefault();

    if (!editTask.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Tugas Kosong',
        text: 'Tugas tidak boleh kosong. Silakan isi terlebih dahulu.'
      });
      return;
    }

    try {
      await fetch(`https://tar-brawny-dance.glitch.me/todos/${editTodo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: editTask }),
      });

      Swal.fire({
        icon: "success",
        title: "Task has been updated!",
        showConfirmButton: false,
        timer: 1500,
      });

      setTodos(
        todos.map((todo) =>
          todo.id === editTodo.id ? { ...todo, task: editTask } : todo
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  }

  function openEditModal(todo) {
    setEditTodo(todo);
    setEditTask(todo.task);
    setShowModal(true);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-black">
      <div className="navbar">
        <a className="btn btn-ghost text-3xl">TODO</a>
      </div>

      <div className="flex flex-col items-center justify-center text-white">
        <div>
          <div className="bg-[#1f1f1f] p-4 rounded-lg mb-4 flex justify-between items-center border border-gray-700">
            <div className="mx-10">
              <div className="text-3xl font-semibold">Task Done</div>
              <div className="text-lg text-gray-400">Keep it up</div>
            </div>
            <div className="bg-lime-600 w-30 h-30 rounded-full flex items-center justify-center text-4xl font-bold">
              {completed}/{total}
            </div>
          </div>
        </div>

        <div className="flex mb-6">
          <form onSubmit={createTodo}>
            <input
              type="text"
              placeholder="Write your task here..."
              className="w-80 p-2 rounded bg-gray-800 text-white placeholder-gray-400 outline-none"
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <button className="w-10 bg-lime-600 p-2 rounded hover:bg-lime-700">
              +
            </button>
          </form>
        </div>

        <div className="space-y-4 w-[370px]">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-lime-500"></div>
            </div>
          ) : (
            <AnimatePresence>
              {todos.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TodoCard
                    task={t.task}
                    status={t.status}
                    onDelete={() => deleteTodo(t.id)}
                    onStatusChange={() => updateTodoStatus(t.id)}
                    onEdit={() => openEditModal(t)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#1f1f1f] p-6 rounded shadow-lg w-96 border border-gray-700">
            <h2 className="text-white text-xl mb-4">Edit Task</h2>
            <form onSubmit={submitEditTodo}>
              <input
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 outline-none mb-4"
                placeholder="Edit your task..."
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
