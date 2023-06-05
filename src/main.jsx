import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import AddTask from "./Components/AddTask/AddTask.jsx";
import MyTask from "./Components/MyTask/MyTask.jsx";
import UpdateTask from "./Components/UpdateTask/UpdateTask.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/addtask",
        element: <AddTask></AddTask>,
      },
      {
        path: "/mytask",
        element: <MyTask></MyTask>,
      },
      {
        path: "/update/:id",
        element: <UpdateTask></UpdateTask>,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/task/${params.id}`),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
