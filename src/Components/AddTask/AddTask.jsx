import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";
import "./AddTask.css";

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskDate, setTaskDate] = useState("");
  const [errors, setErrors] = useState({});

  const options = [
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const description = form.description.value;
    const status = taskStatus ? taskStatus.value : "";
    const date = form.date.value;

    const newErrors = {};

    if (title.trim() === "") {
      newErrors.title = "Please enter a title.";
    }

    if (description.trim() === "") {
      newErrors.description = "Please enter a description.";
    }

    if (!taskStatus) {
      newErrors.status = "Please select a status.";
    }

    if (date.trim() === "") {
      newErrors.date = "Please enter a date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = {
      title,
      description,
      status,
      date,
    };

    form.reset();
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus(null);
    setTaskDate("");
    setErrors({});

    fetch("https://todo-server-neon.vercel.app/task", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.insertedId) {
          Swal.fire({
            title: "Great!",
            text: "Task Added",
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
      });
  };

  const handleStatusChange = (newValue) => {
    setTaskStatus(newValue);
  };

  return (
    <div className="addTask">
      <form onSubmit={handleSubmit}>
        <div className=" flex justify-center items-center flex-col mt-10 ">
          <div className="mb-4 w-80">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              className={`border border-gray-400 p-2 w-full ${
                errors.title ? "border-red-500" : ""
              }`}
              name="title"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
             
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="mb-4 w-80">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Task Description
            </label>
            <textarea
              id="description"
              className={`border border-gray-400 p-2 w-full ${
                errors.description ? "border-red-500" : ""
              }`}
              name="description"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center gap-10">
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 font-bold mb-2"
            >
              Status
            </label>
            <CreatableSelect
              id="status"
              className={`border border-gray-400 p-2 w-full ${
                errors.status ? "border-red-500" : ""
              }`}
              name="status"
              placeholder="Status"
              value={taskStatus}
              options={options}
              onChange={handleStatusChange}
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 font-bold mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              className={`border border-gray-400 p-2 w-full ${
                errors.date ? "border-red-500" : ""
              }`}
              name="date"
              placeholder="Date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
           
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-10"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
