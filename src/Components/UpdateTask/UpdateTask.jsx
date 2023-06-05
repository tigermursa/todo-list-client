import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Swal from "sweetalert2";

const UpdateTask = () => {
  const theLoadedTask = useLoaderData();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskDate, setTaskDate] = useState("");

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

    // Send updated task data to the server
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
          // Show success message using Swal
          Swal.fire({
            title: "Success!",
            text: "Task Updated",
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
              className="border border-gray-400 p-2 w-full"
              name="title"
              defaultValue={theLoadedTask?.title}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
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
              className="border border-gray-400 p-2 w-full"
              name="description"
              defaultValue={theLoadedTask?.description}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
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
              className="border border-gray-400 p-2 w-full"
              name="status"
              placeholder="Status"
              defaultValue={theLoadedTask?.status}
              options={options}
              onChange={handleStatusChange}
            />
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
              className="border border-gray-400 p-2 w-full"
              name="date"
              placeholder="Date"
              defaultValue={theLoadedTask?.date}
              onChange={(e) => setTaskDate(e.target.value)}
              required
            />
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

export default UpdateTask;
