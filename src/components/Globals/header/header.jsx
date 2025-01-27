"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { addUser, Logout } from "@/store/slice/user";
import "./header.css";
import { merastore } from "@/store/store";
import axiosInstance from "@/utils/axiosInstance";

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
    const token = localStorage.getItem("token")
    if(!token){return}
    axiosInstance.get("/auth/info")
      .then((response) => {
        if (response.data.success) {
          const user = response.data.user;
          dispatch(addUser({ email: user.email, firstName: user.firstName }));
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        dispatch(Logout());
      });
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
              href="/login"
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
