import React, { useRef } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateTask = () => {
  const theLoadedTask = useLoaderData();
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;
    const title = form.title.value;
    const description = form.description.value;
    const status = form.status.value;
    const date = form.date.value;
    const user = {
      title,
      description,
      status,
      date,
    };
    form.reset();
    fetch(
      `https://todo-server-tigermursa.vercel.app/task/${theLoadedTask._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          Swal.fire({
            title: "Success!",
            text: "Task Updated",
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred. Please try again.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  return (
    <div className="addTask">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex justify-center items-center flex-col mt-10">
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
            <input
              type="text"
              id="status"
              className="border border-gray-400 p-2 w-full"
              name="status"
              defaultValue={theLoadedTask?.status}
              required
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
              defaultValue={theLoadedTask?.date}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-10"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
