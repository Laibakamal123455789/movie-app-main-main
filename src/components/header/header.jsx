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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" href="/">
          {users?.currentUser?.firstName
            ? `Welcome, ${users.currentUser.firstName}`
            : "JustWatch"}
        </Link>
      </div>

      <div className="navbar-center">
        <input
          ref={searchRef}
          type="text"
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
        >
          Search
        </button>
      </div>

      <button
        className="navbar-toggler"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        {users.isAuthenticated ? (
          <>
            <Link className="nav-link" href="/favouritesMovie">
              WishList
            </Link>
            <Link
              className="nav-link"
              href="/login" // Ensure the href is always passed as a string
              onClick={() => {
                dispatch(Logout());
                router.push("/login");
              }}
            >
              Logout
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
