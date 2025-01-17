"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { addUser, Logout } from "@/store/slice/user";
import { jwtDecode } from "jwt-decode";
import helpers from "@/helpers/helpers";
import "./header.css";
import { merastore } from "@/store/store";

export default function Page(){
  return <Provider store={merastore}>
    <Header/>
  </Provider>
}
function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((store) => store.user);
  const searchRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(
          addUser({ email: decoded.email, firstName: decoded.firstName })
        );
      } catch (error) {
        localStorage.removeItem("token");
        alert(error.message);
      }
    }
  }, [dispatch]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <ul className="navbar-nav mr-auto">
          {users?.currentUser?.firstName ? (
            <Link href="/" id="link">
              <span id="name">Welcome, {users.currentUser.firstName}</span>
            </Link>
          ) : users?.currentUser?.email ? (
            <span>
              Welcome, {helpers.getNameFromEmail(users.currentUser.email)}
            </span>
          ) : (
            <Link className="navbar-brand" href="/">
              JustWatch
            </Link>
          )}
          {users.isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  onClick={() => dispatch(Logout())}
                  href="/login"
                >
                  Logout
                </Link>
              </li>
              <li>
                <Link className="nav-link" href="/favouritesMovie">
                  WishList
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/signup">
                  SignUp
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <input
            ref={searchRef}
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            onClick={() => {
              const query = searchRef.current.value.trim();
              if (query) {
                router.push(`/search?q=${query}`);
              }
            }}
            className="btn btn-outline-success my-2 my-sm-0"
            type="button"
          >
            Search
          </button>
        </div>
      </nav>
    </div>
  );
}
