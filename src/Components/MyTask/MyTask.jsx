import React, { useEffect, useState } from "react";
import { FaRegEdit, FaCheck, FaSquare, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MyTask = () => {
  const [taskData, setTaskData] = useState([]);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    // Fetch task data from the server
    fetch("https://todo-server-neon.vercel.app/task")
      .then((response) => response.json())
      .then((data) => {
        setTaskData(data);
        // Compute the number of pending and completed tasks
        const pendingCount = data.filter(
          (task) => task.status === "pending"
        ).length;
        const completedCount = data.filter(
          (task) => task.status === "completed"
        ).length;
        setPendingTasks(pendingCount);
        setCompletedTasks(completedCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const updateStatus = (id, newStatus) => {
    // Update task status on the server
    fetch(`https://todo-server-neon.vercel.app/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the task status in the state
        const updatedTasks = taskData.map((task) => {
          if (task._id === id) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        setTaskData(updatedTasks);

        // Compute the updated counts of pending and completed tasks
        const pendingCount = updatedTasks.filter(
          (task) => task.status === "pending"
        ).length;
        const completedCount = updatedTasks.filter(
          (task) => task.status === "completed"
        ).length;
        setPendingTasks(pendingCount);
        setCompletedTasks(completedCount);

        // Show success message using Swal
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
    // Show confirmation dialog using Swal
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
        // Delete the task on the server
        fetch(`https://todo-server-neon.vercel.app/task/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            // Remove the deleted task from the state
            const updatedTasks = taskData.filter((task) => task._id !== id);
            setTaskData(updatedTasks);

            // Compute the updated counts of pending and completed tasks
            const pendingCount = updatedTasks.filter(
              (task) => task.status === "pending"
            ).length;
            const completedCount = updatedTasks.filter(
              (task) => task.status === "completed"
            ).length;
            setPendingTasks(pendingCount);
            setCompletedTasks(completedCount);

            // Show success message using Swal
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
    <div>
      <div className="flex justify-center gap-10 mb-4">
        <div>Pending Tasks: {pendingTasks}</div>
        <div>Completed Tasks: {completedTasks}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {taskData.map((task) => (
          <div key={task._id} className="border rounded-md p-4">
            <h2 className="text-center text-xl font-bold mb-2">
              {task.title}{" "}
              {task.status === "pending" ? (
                // Mark red for pending tasks
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              ) : (
                // Mark green for completed tasks
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              )}
            </h2>
            <p className="mb-2 text-justify p-1">{task.description}</p>
            <div className="flex items-center mb-2">
              <span className="flex-grow">Status: {task.status}</span>
            </div>
            <p>Date: {task.date}</p>
            <div className="flex justify-center items-center mt-5">
              {task.status === "completed" ? (
                <button
                  title="mark the task"
                  className="mr-2 text-green-500 font-bold py-2 px-4 rounded"
                  onClick={() => updateStatus(task._id, "pending")}
                >
                  <FaCheck />
                </button>
              ) : (
                <button
                  title="update task"
                  className="mr-2 text-red-500 font-bold py-2 px-4 rounded"
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
                title="Delete task"
                className="ml-2 text-white font-bold py-2 px-4 rounded"
                onClick={() => deleteTask(task._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTask;
