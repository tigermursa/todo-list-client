import React, { useEffect, useState } from "react";
import { FaRegEdit, FaCheck, FaSquare, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MyTask = () => {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/task")
      .then((response) => response.json())
      .then((data) => setTaskData(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:3000/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTasks = taskData.map((task) => {
          if (task._id === id) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        setTaskData(updatedTasks);

        const alertText =
          newStatus === "completed"
            ? "Congratulations! Task completed."
            : "Task marked as pending.";
        MySwal.fire({
          icon: "success",
          title: alertText,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const deleteTask = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/task/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            const updatedTasks = taskData.filter((task) => task._id !== id);
            setTaskData(updatedTasks);

            MySwal.fire({
              icon: "success",
              title: "Task deleted successfully.",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            console.error("Error deleting task:", error);
          });
      }
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {taskData.map((task) => (
        <div key={task._id} className="border rounded-md p-4">
          <h2 className="text-center text-xl font-bold mb-2">
            {task.title}{" "}
            {task.status === "pending" ? (
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
            ) : (
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            )}
          </h2>
          <p className="mb-2">{task.description}</p>
          <div className="flex items-center mb-2">
            <span className="flex-grow">Status: {task.status}</span>
          </div>
          <p>Date: {task.date}</p>
          <div className="flex justify-center items-center mt-5">
            {task.status === "completed" ? (
              <button
                className="mr-2 text-white font-bold py-2 px-4 rounded"
                onClick={() => updateStatus(task._id, "pending")}
              >
                <FaCheck />
              </button>
            ) : (
              <button
                className="mr-2 text-white font-bold py-2 px-4 rounded"
                onClick={() => updateStatus(task._id, "completed")}
              >
                <FaSquare />
              </button>
            )}
            <Link to={`/update/${task._id}`}>
              <button>
                <FaRegEdit />
              </button>
            </Link>
            <button
              className="ml-2 text-white font-bold py-2 px-4 rounded"
              onClick={() => deleteTask(task._id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTask;
