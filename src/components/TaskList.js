// TaskList.js

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./TaskList.css";

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDifference = due.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysRemaining;
  };

  const [completedTasks, setCompletedTasks] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    // Set initial sortedTasks based on the initial state of the sorted variable
    setSortedTasks(
      sorted
        ? [...tasks].sort(
            (a, b) =>
              calculateDaysRemaining(a.dueDate) -
              calculateDaysRemaining(b.dueDate)
          )
        : [...tasks]
    );
  }, [tasks, sorted]);

  const handleCompleteTask = (index) => {
    // Check if the task is already completed
    if (completedTasks.includes(index)) {
      // Task is completed, remove it from the completedTasks array
      setCompletedTasks((prevCompletedTasks) =>
        prevCompletedTasks.filter((taskIndex) => taskIndex !== index)
      );
    } else {
      // Task is not completed, add it to the completedTasks array
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, index]);
    }
  };

  const handleSortTasks = () => {
    const updatedSorted = !sorted;
    setSorted(updatedSorted);

    if (updatedSorted) {
      // Sort in increasing order of days remaining
      const sorted = [...tasks].sort(
        (a, b) =>
          calculateDaysRemaining(a.dueDate) - calculateDaysRemaining(b.dueDate)
      );
      setSortedTasks(sorted);
    } else {
      // Revert to the original order
      setSortedTasks([...tasks]);
    }
  };

  return (
    <>
      <div className="task-list-container">
        <button onClick={handleSortTasks} className="sort_button">
          {sorted ? "Show Original Order" : "Sort by Days Remaining"}
        </button>
        <ul className="task_list_ul">
          {sortedTasks.map((task, index) => (
            <li
              className={`tasklist_li ${
                completedTasks.includes(index) ? "completed" : ""
              }`}
              key={index}
            >
              <div>Name : {task.task}</div>
              <div>Priority: {task.priority}</div>
              <div>Due Date: {task.dueDate}</div>
              <div>Days Remaining: {calculateDaysRemaining(task.dueDate)}</div>

              <div>
                <button
                  className="edit_button"
                  onClick={() => onEditTask(task)}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete_button"
                  onClick={() => onDeleteTask(index, task._id)}
                >
                  <FaTrash />
                </button>
                <button
                  className="complete_button"
                  onClick={() => handleCompleteTask(index)}
                >
                  {completedTasks.includes(index) ? "Uncomplete" : "Complete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskList;

// import React, { useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import "./TaskList.css";

// const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
//   const calculateDaysRemaining = (dueDate) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const timeDifference = due.getTime() - today.getTime();
//     const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
//     return daysRemaining;
//   };

//   const [completedTasks, setCompletedTasks] = useState([]);

//   const handleCompleteTask = (index) => {
//     // Check if the task is already completed
//     if (completedTasks.includes(index)) {
//       // Task is completed, remove it from the completedTasks array
//       setCompletedTasks((prevCompletedTasks) =>
//         prevCompletedTasks.filter((taskIndex) => taskIndex !== index)
//       );
//     } else {
//       // Task is not completed, add it to the completedTasks array
//       setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, index]);
//     }
//   };

//   return (
//     <>
//       <div className="task-list-container">
//         <ul className="task_list_ul">
//           {tasks.map((task, index) => (
//             <li
//               className={`tasklist_li ${
//                 completedTasks.includes(index) ? "completed" : ""
//               }`}
//               key={index}
//             >
//               <div>Name : {task.task}</div>
//               <div>Priority: {task.priority}</div>
//               <div>Due Date: {task.dueDate}</div>
//               <div>Days Remaining: {calculateDaysRemaining(task.dueDate)}</div>

//               <div>
//                 <button
//                   className="edit_button"
//                   onClick={() => onEditTask(task)}
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   className="delete_button"
//                   onClick={() => onDeleteTask(index, task._id)}
//                 >
//                   <FaTrash />
//                 </button>
//                 <button
//                   className="complete_button"
//                   onClick={() => handleCompleteTask(index)}
//                 >
//                   {completedTasks.includes(index) ? "Uncomplete" : "Complete"}
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default TaskList;
