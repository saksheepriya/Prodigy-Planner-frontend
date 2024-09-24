// Filter.js

import React from "react";
import "./Filter.css";

const Filter = ({ onFilterChange }) => {
  const handleChange = (e) => {
    const selectedPriority = e.target.value;
    onFilterChange(selectedPriority);
  };

  return (
    <div className="filter">
      <div style={{ color: "white" }}>Show by Priority :</div>

      <label className="filter_label" htmlFor="priorityFilter">
        <select className="filter_select" onChange={handleChange}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
    </div>
  );
};

export default Filter;
