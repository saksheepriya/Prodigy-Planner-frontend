// TaskForm.js
import React, { useState, useEffect } from "react";
import "./TaskForm.css";

const TaskForm = ({ onAddTask, editingTask, onClose, userObjectId }) => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [formOpen, setFormOpen] = useState(true);

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.task);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = window.localStorage.getItem("token");

    // Use the token to identify the user
    const result = await fetch("http://localhost:5000/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        task,
        priority,
        dueDate,
      }),
    });

    const data = await result.json();

    if (data.status === "ok") {
      // Task created successfully, you can now update the UI or take any other action
      onAddTask(data.data);
      const existingTasks =
        JSON.parse(window.localStorage.getItem("tasks")) || [];
      const updatedTasks = [...existingTasks, data.data];
      window.localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTask("");
      setPriority("low");
      setDueDate("");
    } else {
      // Handle error case
      console.error("Error creating task:", data.data);
    }
  };
  const handleCloseForm = () => {
    setFormOpen(false);
    onClose();
  };

  return formOpen ? (
    <form className="Task_form" onSubmit={handleSubmit}>
      <span
        className="close_icon"
        style={{ color: "#000", display: "flex", justifyContent: "right" }}
        onClick={handleCloseForm}
      >
        &#10006;
      </span>
      <label className="taskForm_label">
        Task:
        <input
          className="taskForm_input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />
      </label>
      <label className="taskForm_label">
        Priority:
        <select
          className="taskForm_select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label className="taskForm_label">
        Due Date:
        <input
          className="taskForm_input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min="2023-20-11"
        />
      </label>
      <button className="Addtask_button" type="submit">
        Add Task
      </button>
    </form>
  ) : null;
};

export default TaskForm;
