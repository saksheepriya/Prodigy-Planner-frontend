// test.js

import React, { Component, useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
export default function AdminHome({ userData }) {
  const [data, setData] = useState([]);
  const [pageCount,setPageCount]=useState(5);
  const[limit=5,setLimit]=useState();
  const[currentPage=1,setCurrentPage]=useState();
  const movies = React.useRef(null);

  useEffect(() => {
    movies.current=1;
  getPaginatedData();
 
  });

  const getPaginatedData=()=>{
    fetch("http://localhost:5000/users?page=1&limit=5", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
      });

  }

  const getAllUser = () => {
    fetch("http://localhost:5000/getAllUser", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
        });
    } else {
    }
  };

function handlePageClick(e){
  console.log(e);
  setCurrentPage(e.selected+1);
  movies.current=e.selected+1
  console.log(movies.current);
  fetch(`http://localhost:5000/users?page=${movies.current}&limit=${limit}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userData");
      setData(data.data);
    });
}

function limitChanged(e){


fetch(`http://localhost:5000/users?page=${movies.current}&limit=${limit}`, {
  method: "GET",
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data, "userData");
    setData(data.data);
    setPageCount(data.pageCount)
   movies.current=1
  });
}


  return (
    <div className="auth-wrapper" style={{height:"auto"}}>
      <div className="auth-inner" style={{ width: "auto" }}>
        <h3>Welcom Admin</h3>
        <table style={{ width: 500 }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Delete</th>
          </tr>
        </table>

        <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={handlePageClick}
        breakClassName="page-item"
        breakLinkClassName="page-link"

     
        marginPagesDisplayed={2}
      
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
      <input placeholder="limit" onChange={e=>setLimit(e.target.value)}/>
      <button onClick={limitChanged}>Set limit</button>
        <button onClick={logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    </div>
  );
}
