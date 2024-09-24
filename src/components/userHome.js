//UserHome.js

import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Filter from "./Filter";

export default function UserHome({ userData, fetchUserData }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  const handleEditTask = (taskToEdit) => {
    setEditingTask(taskToEdit);
    setShowTaskForm(true);
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  const handleAddTask = async (taskData) => {
    if (editingTask) {
      // If editingTask is present, delete the existing task
      await deleteTask(editingTask._id);
    }

    // Add the updated task
    const updatedTasks = [...tasks, taskData];
    setTasks(updatedTasks);

    // Save tasks to local storage
    window.localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Reset the editingTask state
    setEditingTask(null);
  };
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteTask/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status !== "ok") {
        console.error("Error deleting task:", data.data);
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };
  const handleDeleteTask = (index, taskId) => {
    // Make a request to the backend to delete the task
    fetch(`http://localhost:5000/deleteTask/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok. Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "ok") {
          // Update the state to reflect the deletion
          const updatedTasks = [...tasks];
          updatedTasks.splice(index, 1);
          setTasks(updatedTasks);
        } else {
          console.error("Error deleting task:", data.data);
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error.message);
      });
  };

  const filteredTasks = tasks.filter((task) =>
    filterPriority === "all" ? true : task.priority === filterPriority
  );

  const fetchFilteredTasks = (priority) => {
    // Fetch tasks based on user ID and priority
    // Use your API endpoint for fetching filtered tasks
    fetch(`http://localhost:5000/getUserTasksWithPriority`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        priority: priority,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setTasks(data.data);
        } else {
          console.error("Error fetching tasks:", data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    if (userData && userData._id) {
      // Fetch all tasks initially
      fetchTasks();
    }
  });
  const handleFilterChange = (selectedPriority) => {
    setFilterPriority(selectedPriority);

    // Fetch filtered tasks based on priority
    fetchFilteredTasks(selectedPriority);
  };

  const fetchTasks = async () => {
    const result = await fetch(
      `http://localhost:5000/getUserTasks/${userData._id}`
    );
    const taskData = await result.json();

    if (taskData.status === "ok") {
      setTasks(taskData.data);
    } else {
      console.error("Error fetching tasks:", taskData.data);
    }
  };
  return (
    <>
      <div className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="navbar-brand">{userData.fname}</div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <div className="nav-item">
                <button
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#5c015c",
                    color: "white",
                    border: "black",
                    boxShadow: "1px 2px 3px 0.5px black",
                  }}
                  onClick={() => setShowTaskForm(true)}
                >
                  <BsPlus /> Add Task
                </button>
              </div>

              <div className="nav-item">
                <button
                  style={{
                    backgroundColor: "#5c015c",
                    color: "white",
                    border: "black",
                    boxShadow: "1px 2px 3px 0.5px black",
                  }}
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={logOut}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        {showTaskForm && (
          <TaskForm
            onAddTask={handleAddTask}
            editingTask={editingTask}
            onClose={() => setShowTaskForm(false)}
          />
        )}
        <TaskList
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      <div>
        <Filter onFilterChange={handleFilterChange} />
      </div>
    </>
  );
}
