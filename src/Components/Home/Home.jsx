import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation
import AddTask from "../AddTask/AddTask";
import MyTask from "../MyTask/MyTask";

const Home = () => {
  return (
    <div>
      <Link to="/addtask">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-5 mb-7" >
          Add a task
        </button>
      </Link>
      <MyTask></MyTask>
    </div>
  );
};

export default Home;
