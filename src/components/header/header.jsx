"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { addUser, Logout } from "@/store/slice/user";
import { jwtDecode } from "jwt-decode";
import helpers from "@/helpers/helpers";
import "./header.css";
import { merastore } from "@/store/store";

export default function Page() {
  return (
    <Provider store={merastore}>
      <Header />
    </Provider>
  );
}

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((store) => store.user);
  const searchRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle menu visibility

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/* Left Section */}
      <div className="navbar-left">
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
      </div>

      {/* Center Section (Search) */}
      <div className="navbar-center">
        <input
          ref={searchRef}
          className="form-control"
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
          className="btn btn-outline-success"
        >
          Search
        </button>
      </div>

      {/* Toggle Button */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle state
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Right Section */}
      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        {users.isAuthenticated ? (
          <>
            <Link
              className="nav-link"
              onClick={() => dispatch(Logout())}
              href="/login"
            >
              Logout
            </Link>
            <Link className="nav-link" href="/favouritesMovie">
              WishList
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/signup">
              SignUp
            </Link>
            <Link className="nav-link" href="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
