import React, { useEffect, useState } from "react";

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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {taskData.map((task) => (
        <div key={task.id} className="border rounded-md p-4">
          <h2 className="text-center text-xl font-bold mb-2">{task.title}</h2>
          <p className="mb-2">{task.description}</p>
          <p className="mb-2">Status: {task.status}</p>
              <p>Date: {task.date}</p>
              <button>Edit Task</button>
        </div>
      ))}
    </div>
  );
};

export default MyTask;
