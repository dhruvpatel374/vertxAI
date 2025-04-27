import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { User } from "../utils/types";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { removeUser } from "../utils/store/userSlice";

interface RootState {
  user: User | null;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const logoutPromise = axios.post(
      BASE_URL + "/auth/logout",
      {},
      { withCredentials: true }
    );

    toast.promise(
      logoutPromise,
      {
        loading: "Logging Out...",
        success: () => {
          dispatch(removeUser());
          navigate("/");
          return "Logged Out Successfully!";
        },
        error: (err) => {
          console.error("Error logging out:", err);
          return `Failed to log out: ${
            err?.response?.data?.message || "Something went wrong"
          }`;
        },
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000, // Success toast stays for 3 seconds
        },
        error: {
          duration: 4000, // Error toast stays for 4 seconds
        },
        position: "top-center",
      }
    );
  };

  return (
    <>
      <Toaster />
      <nav
        className={`bg-base-200 ${
          isSticky
            ? "sticky top-4 z-40 rounded-xl mx-4 transition-all duration-300"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  to="/"
                  className="text-white font-bold font-ya text-2xl tracking-widest cursor-pointer"
                >
                  vertxAI
                </Link>
              </div>
            </div>
            {!user && (
              <div className="md:flex lg:flex items-center gap-8 justify-center flex-grow hidden">
                <Link
                  to="/"
                  className="text-white px-3 py-2 font-medium cursor-pointer"
                >
                  Home
                </Link>
                <Link
                  to="/feed"
                  className="text-white px-3 py-2 font-medium cursor-pointer"
                >
                  Feed
                </Link>

                <Link
                  to="/auth"
                  className="text-white border tracking-widest border-gray-700 hover:border-gray-400 px-3 py-2 rounded-md font-medium cursor-pointer"
                >
                  Signup
                </Link>
              </div>
            )}
            {!user && (
              <div
                onClick={toggleMenu}
                className="lg:hidden -mr-2 flex md:hidden cursor-pointer relative"
              >
                {!isOpen ? (
                  <Bars3BottomLeftIcon className="h-6 w-6 text-white" />
                ) : (
                  <XMarkIcon className="h-6 w-6 text-white absolute top-0 left-0" />
                )}
              </div>
            )}
            {user && (
              <div className="form-control flex items-center">
                <div className="hidden sm:block self-center">
                  Welcome, {user.name}
                </div>
                <div className="dropdown dropdown-end mx-5">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png"
                        alt="User avatar"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-36 p-2 shadow bg-base-200"
                  >
                    <li>
                      <Link to="/profile" className="justify-between">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/feed">Feed</Link>
                    </li>
                    <li>
                      <Link to="/dashboard" className="justify-between">
                        {user.role === "admin"
                          ? "Admin Dashboard"
                          : "Dashboard"}
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          {!user && (
            <div
              className={`fixed top-0 left-0 w-screen h-screen bg-base-100 transform transition-transform duration-300 ease-in-out z-50 shadow-xl md:hidden ${
                isOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="absolute top-4 right-4">
                <div onClick={toggleMenu} className="text-white cursor-pointer">
                  <XMarkIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="px-2 pt-16 pb-3 space-y-8 sm:px-3 flex flex-col items-center justify-center h-full">
                <Link
                  to="/"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  Home
                </Link>
                <Link
                  to="/feed"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  Feed
                </Link>

                <Link
                  to="/auth"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  Signup
                </Link>
              </div>
            </div>
          )}
          {user && (
            <div
              className={`fixed top-0 left-0 w-screen h-screen bg-base-100 transform transition-transform duration-300 ease-in-out z-50 shadow-xl md:hidden ${
                isOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="absolute top-4 right-4">
                <div onClick={toggleMenu} className="text-white cursor-pointer">
                  <XMarkIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="px-2 pt-16 pb-3 space-y-8 sm:px-3 flex flex-col items-center justify-center h-full">
                <Link
                  to="/profile"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/feed"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  Feed
                </Link>
                <Link
                  to="/dashboard"
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                  onClick={toggleMenu}
                >
                  {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-center cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
