import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function TodoCard({ task, onDelete, status, onStatusChange, onEdit }){
    return (
        <div className="flex justify-between items-start bg-[#1f1f1f] p-3 rounded border border-gray-700">
            <div className="flex items-start gap-2 w-full">
                <input
                    type="checkbox"
                    className="mt-1 form-checkbox text-lime-500"
                    checked={status === 'COMPLETED'}
                    onChange={onStatusChange}
                />
                <span className={`break-words text-white ${status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
                    {task}
                </span>
            </div>
            <div className="flex gap-3 text-gray-400 ml-2 mt-1">
                <FiEdit onClick={onEdit} className="cursor-pointer hover:text-white" />
                <FiTrash2 onClick={onDelete} className="cursor-pointer hover:text-red-500" />
            </div>
        </div>
    );
}