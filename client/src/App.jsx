import "./App.css";
import TodoCard from "./components/TodoCard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css'; 

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("OPEN");

  async function fetchTodos() {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      setTodos(result);
    } catch (error) {
      console.log(error);
    }
  }

  async function createTodo(event) {
    event.preventDefault();
    if (!task.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Tugas Kosong',
            text: 'Silakan tulis tugas Anda terlebih dahulu.'
        });
        return;
    }
    const newTodo = {
      id: String(+todos.at(-1).id + 1) ?? "1",
      task: task,
      status: status,
    };
    await fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });

    setTodos([...todos, newTodo]);
    setTask("");
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
        await fetch(`http://localhost:3000/todos/${id}`, {
          method: "DELETE",
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your task has been successfully deleted.",
        });

        fetchTodos();
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
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const newStatus = todoToUpdate.status === 'OPEN' ? 'COMPLETED' : 'OPEN';

    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      ));
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);
  
  const total = todos.length;
  const completed = todos.filter(todo => todo.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-black">
      <div className="navbar">
        <a className="btn btn-ghost text-3xl">TODO</a>
      </div>

      <div className="flex flex-col items-center justify-center">
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

        <div className="flex gap-2 mb-6">
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
          {todos.map((t) => (
            <TodoCard
              key={t.id}
              task={t.task}
              status={t.status}
              onDelete={() => deleteTodo(t.id)}
              onStatusChange={() => updateTodoStatus(t.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
