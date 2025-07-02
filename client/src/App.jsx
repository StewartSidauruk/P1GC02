import "./App.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function App() {
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
              0/0
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your task here..."
            className="w-80 p-2 rounded bg-gray-800 text-white placeholder-gray-400 outline-none"
          />
          <button className="w-10 bg-lime-600 p-2 rounded hover:bg-lime-700">
            +
          </button>
        </div>

        <div className="space-y-4 w-[370px]">
          <div className="flex justify-between items-start bg-[#1f1f1f] p-3 rounded border border-gray-700">
            <div className="flex items-start gap-2 w-full">
              <input
                type="checkbox"
                className="mt-1 form-checkbox text-lime-500"
              />
              <span className="break-words text-white">
                taks kerjanya berat banget tapi saya tetap lanjut
                meskipun sudah larut malam dan tidak ada kopi lagi di kosan
              </span>
            </div>
            <div className="flex gap-3 text-gray-400 ml-2 mt-1">
              <FiEdit className="cursor-pointer hover:text-white" />
              <FiTrash2 className="cursor-pointer hover:text-red-500" />
            </div>
          </div>

          <div className="flex justify-between items-start bg-[#1f1f1f] p-3 rounded border border-gray-700">
            <div className="flex items-start gap-2 w-full">
              <input
                type="checkbox"
                className="mt-1 form-checkbox text-lime-500"
              />
              <span className="break-words text-white">
                mantap
              </span>
            </div>
            <div className="flex gap-3 text-gray-400 ml-2 mt-1">
              <FiEdit className="cursor-pointer hover:text-white" />
              <FiTrash2 className="cursor-pointer hover:text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
