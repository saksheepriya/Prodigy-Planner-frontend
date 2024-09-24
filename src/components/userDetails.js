
// UserDetails

import React, { useEffect, useState } from "react";
import UserHome from "./userHome";
import TaskForm from "./TaskForm";

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);

    fetchUserData(); // Moved the fetchUserData function to a separate function
  }, []);

  const fetchUserData = () => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setUserData(data.data);

        if (data.data === "token expired") {
          alert("Token expired login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  };

  const handleAddTask = (taskData) => {
    // Update the tasks state
    const updatedTasks = [...tasks, taskData];
    setTasks(updatedTasks);

    // Save tasks to local storage
    window.localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };



  return (
    <>
    <UserHome userData={userData} fetchUserData={fetchUserData} />
    {showTaskForm && (
      <TaskForm
        onAddTask={handleAddTask}
        editingTask={editingTask}
        onClose={() => setShowTaskForm(false)}
      />
    )}
  </>
  );
}