import axios from "axios";
import { useState } from "react";
import validator from "validator";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/store/userSlice";
import { useNavigate } from "react-router-dom";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    nameErr: "",
    emailIdErr: "",
    passwordErr: "",
    generalErr: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validateForm = () => {
    let isValid = true;
    const newError = {
      nameErr: "",
      emailIdErr: "",
      passwordErr: "",
      generalErr: "",
    };

    if (!isLogin) {
      if (!name) {
        newError.nameErr = "Name is required";
        isValid = false;
      }
    }
    if (!validator.isEmail(emailId)) {
      newError.emailIdErr = "Please enter a valid email address";
      isValid = false;
    }
    if (!password) {
      newError.passwordErr = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newError.passwordErr = "Password should be at least 8 characters long";
      isValid = false;
    }
    setError(newError);
    return isValid;
  };
  // validateForm();
  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    const loginPromise = axios.post(
      BASE_URL + "/auth/login",
      {
        email: emailId,
        password,
      },
      { withCredentials: true }
    );

    toast.promise(
      loginPromise,
      {
        loading: "Logging In...",
        success: (response) => {
          dispatch(addUser(response.data.data));
          navigate("/home");
          return `Welcome, ${response.data.data.name}`;
        },
        error: (err) => {
          const errorMsg =
            err?.response?.data?.message || "Something went wrong";
          setError((prevErr) => ({
            ...prevErr,
            generalErr: errorMsg,
          }));
          return `Login failed: ${errorMsg}`;
        },
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
        position: "top-center",
      }
    );
  };

  const handleSignUp = () => {
    if (!validateForm()) {
      return;
    }

    const signupPromise = axios.post(
      BASE_URL + "/auth/signup",
      {
        name,
        email: emailId,
        password,
      },
      { withCredentials: true }
    );

    toast.promise(
      signupPromise,
      {
        loading: "Signing Up...",
        success: (response) => {
          dispatch(addUser(response.data.data));
          navigate("/profile");
          return `Welcome, ${response.data.data.name}! 🎉 You've received 10 credits 💰`;
        },
        error: (err) => {
          const errorMsg =
            err?.response?.data?.message || "Something went wrong";
          setError((prevErr) => ({
            ...prevErr,
            generalErr: errorMsg,
          }));
          return `Signup failed: ${errorMsg}`;
        },
      },
      {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
        position: "top-center",
      }
    );
  };
  return (
    <>
      <Toaster />
      <div className="flex justify-center items-center m-5 bg-base-100">
        <div className="bg-[#ffffff19] p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="border rounded w-full p-2"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {error.nameErr && (
                  <p className="text-red-500 text-sm mt-1">{error.nameErr}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="border rounded w-full p-2"
                placeholder="Enter your email address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              {error.emailIdErr && (
                <p className="text-red-500 text-sm mt-1">{error.emailIdErr}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="border rounded w-full p-2 pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {error.passwordErr && (
              <p className="text-red-500 text-sm mt-1 mb-2">
                {error.passwordErr}
              </p>
            )}

            {error.generalErr && (
              <p className="text-red-500 text-sm my-2">{error.generalErr}</p>
            )}

            <button
              type="submit"
              className="bg-white text-black p-2 rounded-md w-full cursor-pointer"
              onClick={isLogin ? handleLogin : handleSignUp}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
