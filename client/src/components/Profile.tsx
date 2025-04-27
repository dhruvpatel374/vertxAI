import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { BASE_URL } from "../utils/constants"; // Adjust path if needed
import { addUser } from "../utils/store/userSlice"; // Adjust path and action name if needed

const Profile = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((store) => store.user);

  // State for editable fields
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    ageErr: "",
    genderErr: "",
    generalErr: "",
  });

  useEffect(() => {
    if (currentUser) {
      setAge(currentUser.age || "");
      setGender(currentUser.gender || "");
    }
  }, [currentUser]);
  const validateForm = () => {
    let isValid = true;
    const newError = { ageErr: "", genderErr: "", generalErr: "" };

    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum <= 0 || !Number.isInteger(ageNum)) {
      newError.ageErr = "Please enter a valid age.";
      isValid = false;
    }

    if (!gender || !["male", "female", "other"].includes(gender)) {
      newError.genderErr = "Please select a gender.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setError({ ageErr: "", genderErr: "", generalErr: "" });
    setIsLoading(true);

    const profileData = {
      age: Number(age),
      gender,
    };

    const updatePromise = axios.patch(`${BASE_URL}/user/profile`, profileData, {
      withCredentials: true,
    });

    toast.promise(
      updatePromise,
      {
        loading: "Updating Profile...",
        success: (response) => {
          setIsLoading(false);
          const updatedUser = response?.data?.data;

          if (updatedUser) {
            const profileJustCompleted =
              !currentUser?.profileCompleted && updatedUser.profileCompleted;

            dispatch(addUser(updatedUser));

            let successMessage = "Profile updated successfully!";
            if (profileJustCompleted) {
              successMessage = "Profile completed! 50 Credits awarded!";
            }
            return successMessage;
          } else {
            return "Profile updated, but user data response was unexpected.";
          }
        },
        error: (err) => {
          setIsLoading(false);
          const errorMsg =
            err?.response?.data?.message ||
            "Failed to update profile. Please try again.";
          setError((prev) => ({ ...prev, generalErr: errorMsg }));
          return `Update failed: ${errorMsg}`;
        },
      },
      {
        style: {
          minWidth: "250px",
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        success: { duration: 4000 },
        error: { duration: 5000 },
        position: "top-center",
      }
    );
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        Loading profile data...
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="flex justify-center py-10 px-4">
        <div className="card w-full max-w-lg bg-base-200 shadow-xl">
          {" "}
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-6">
              User Profile
            </h2>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                readOnly
                value={currentUser.name || ""}
                className="input input-bordered w-full input-disabled bg-base-300 text-base-content/70"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                readOnly
                value={currentUser.email || ""}
                className="input input-bordered w-full input-disabled bg-base-300 text-base-content/70"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Credits</span>
                </label>
                <input
                  type="number"
                  readOnly
                  value={currentUser.credits ?? 0}
                  className="input input-bordered w-full input-disabled bg-base-300 text-base-content/70 font-bold"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  className={`input input-bordered w-full ${
                    error.ageErr ? "input-error" : ""
                  }`}
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError((prev) => ({ ...prev, ageErr: "" }));
                  }}
                />
                {error.ageErr && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {error.ageErr}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    error.genderErr ? "select-error" : ""
                  }`}
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setError((prev) => ({ ...prev, genderErr: "" }));
                  }}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {error.genderErr && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {error.genderErr}
                    </span>
                  </label>
                )}
              </div>

              {error.generalErr && (
                <p className="text-error text-sm text-center mb-4">
                  {error.generalErr}
                </p>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    isLoading ? "loading" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
