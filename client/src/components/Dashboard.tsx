import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  CurrencyDollarIcon,
  BookmarkIcon,
  ClockIcon,
  FlagIcon,
  UsersIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { BASE_URL } from "../utils/constants";
import {
  AdminDashboardData,
  Post,
  RootState,
  User,
  UserDashboardData,
} from "../utils/types";
import DashboardShimmer from "../utils/shimmer/DashboardShimmer";
import { addUser } from "../utils/store/userSlice";

const Dashboard: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userDashboard, setUserDashboard] = useState<UserDashboardData | null>(
    null
  );
  const [adminDashboard, setAdminDashboard] =
    useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [creditModalOpen, setCreditModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditsInput, setCreditsInput] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState<string>("");
  const [updatingCredits, setUpdatingCredits] = useState<boolean>(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError("");
    try {
      if (currentUser?.role === "admin") {
        const [dashboardRes, usersRes] = await Promise.all([
          axios.get(`${BASE_URL}/admin/dashboard`, { withCredentials: true }),
          axios.get(`${BASE_URL}/admin/users`, { withCredentials: true }),
        ]);
        setAdminDashboard(dashboardRes.data.data || {});
        setUsers(usersRes.data.data || []);
        setUserDashboard(null);
      } else {
        const res = await axios.get(`${BASE_URL}/user/dashboard`, {
          withCredentials: true,
        });
        setUserDashboard(res.data.data || {});
        setAdminDashboard(null);
        setUsers([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
      setUserDashboard(null);
      setAdminDashboard(null);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboard();
    }
  }, [currentUser]);

  const handleOpenCreditModal = (user: User) => {
    setSelectedUser(user);
    setCreditsInput(user.credits);
    setReasonInput("");
    setCreditModalOpen(true);
  };

  const handleUpdateCredits = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) e.preventDefault();

    if (!reasonInput.trim()) {
      toast.error("Please provide a reason", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        position: "top-center",
        duration: 4000,
      });
      return;
    }

    if (!selectedUser) {
      toast.error("No user selected", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        position: "top-center",
        duration: 4000,
      });
      return;
    }

    setUpdatingCredits(true);

    // Use toast.promise to handle loading, success, and error messages
    toast
      .promise(
        axios.patch(
          `${BASE_URL}/admin/users/${selectedUser._id}/credits`,
          { credits: creditsInput, reason: reasonInput },
          { withCredentials: true }
        ),
        {
          loading: "Updating credits...",
          success: "Credits updated successfully!",
          error: (err) =>
            err?.response?.data?.message || "Failed to update credits",
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
      )
      .then((res) => {
        // Update user data in the state
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? res.data.data : u))
        );
        if (currentUser._id === selectedUser._id) {
          dispatch(addUser(res.data.data));
        }

        // Reset state
        setCreditModalOpen(false);
        setSelectedUser(null);
        setCreditsInput(0);
        setReasonInput("");
      })
      .catch(() => {
        // Any errors will automatically trigger the error toast
      })
      .finally(() => {
        setUpdatingCredits(false);
      });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto py-8 px-4 min-h-screen">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-base-content">
          {currentUser?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
        </h2>

        {isLoading && <DashboardShimmer count={4} />}

        {!isLoading && error && (
          <div
            role="alert"
            className="alert alert-error my-6 shadow-lg rounded-lg"
          >
            <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <h3 className="font-bold">Error!</h3>
              <div className="text-sm">{error}</div>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={fetchDashboard}>
              Retry
            </button>
          </div>
        )}

        {/* User Dashboard */}
        {!isLoading &&
          !error &&
          currentUser.role === "user" &&
          userDashboard && (
            <div className="space-y-8">
              {/* Credits Card */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl hover:shadow-xl transition-shadow duration-300">
                <div className="card-body p-6">
                  <div className="flex items-center gap-4">
                    <CurrencyDollarIcon className="w-10 h-10 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-base-content">
                        Credits
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        {userDashboard.credits}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credit History */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl">
                <div className="card-body p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <CurrencyDollarIcon className="w-7 h-7 text-primary" />
                    Credit History
                  </h3>
                  {userDashboard.creditHistory.length === 0 ? (
                    <p className="text-base-content/70 text-center py-4">
                      No credit history available.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th className="text-base-content">Amount</th>
                            <th className="text-base-content">Reason</th>
                            <th className="text-base-content">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDashboard.creditHistory.map((entry) => (
                            <tr
                              key={entry._id || `${entry.date}-${entry.reason}`}
                            >
                              <td className="text-base-content">
                                <span
                                  className={
                                    entry.amount >= 0
                                      ? "text-success"
                                      : "text-error"
                                  }
                                >
                                  {entry.amount >= 0
                                    ? `+${entry.amount}`
                                    : entry.amount}
                                </span>
                              </td>
                              <td className="text-base-content">
                                {entry.reason}
                              </td>
                              <td className="text-base-content">
                                {formatDate(entry.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Posts */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl">
                <div className="card-body p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <BookmarkIcon className="w-7 h-7 text-primary" />
                    Saved Posts
                  </h3>
                  {userDashboard.savedPosts.length === 0 ? (
                    <p className="text-base-content/70 text-center py-4">
                      No saved posts yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th className="text-base-content">Content</th>
                            <th className="text-base-content">Source</th>
                            <th className="text-base-content">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDashboard.savedPosts.map((post) => (
                            <tr key={post._id}>
                              <td className="text-base-content">
                                {post.content.substring(0, 50)}
                                {post.content.length > 50 ? "..." : ""}
                              </td>
                              <td className="text-base-content capitalize">
                                {post.source}
                              </td>
                              <td className="text-base-content">
                                {formatDate(post.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl">
                <div className="card-body p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <ClockIcon className="w-7 h-7 text-primary" />
                    Recent Activity
                  </h3>
                  {userDashboard.recentActivity.length === 0 ? (
                    <p className="text-base-content/70 text-center py-4">
                      No recent activity.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {userDashboard.recentActivity.map((activity, index) => (
                        <li
                          key={index}
                          className="text-base-content/80 text-sm flex justify-between items-center bg-base-200 p-3 rounded-lg"
                        >
                          <span>{activity.action}</span>
                          <span>{formatDate(activity.date)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Admin Dashboard */}
        {!isLoading &&
          !error &&
          currentUser.role === "admin" &&
          adminDashboard && (
            <div className="space-y-8">
              {/* Total Users */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl hover:shadow-xl transition-shadow duration-300">
                <div className="card-body p-6">
                  <div className="flex items-center gap-4">
                    <UsersIcon className="w-10 h-10 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-base-content">
                        Total Users
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        {adminDashboard.totalUsers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reported Posts */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl">
                <div className="card-body p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <FlagIcon className="w-7 h-7 text-primary" />
                    Reported Posts
                  </h3>
                  {adminDashboard.reportedPosts.length === 0 ? (
                    <p className="text-base-content/70 text-center py-4">
                      No reported posts.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th className="text-base-content">Content</th>
                            <th className="text-base-content">Reason</th>
                            <th className="text-base-content">Source</th>
                            <th className="text-base-content">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminDashboard.reportedPosts.map((post) => (
                            <tr key={post._id}>
                              <td className="text-base-content">
                                {post.content.substring(0, 50)}
                                {post.content.length > 50 ? "..." : ""}
                              </td>
                              <td className="text-base-content">
                                {post.reportReason || "No reason provided"}
                              </td>
                              <td className="text-base-content capitalize">
                                {post.source}
                              </td>
                              <td className="text-base-content">
                                {formatDate(post.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Users Management */}
              <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl">
                <div className="card-body p-6">
                  <h3 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-3">
                    <UsersIcon className="w-7 h-7 text-primary" />
                    Manage Users
                  </h3>
                  {users.length === 0 ? (
                    <p className="text-base-content/70 text-center py-4">
                      No users found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th className="text-base-content">Name</th>
                            <th className="text-base-content">Email</th>
                            <th className="text-base-content">Credits</th>
                            <th className="text-base-content">Saved Posts</th>
                            <th className="text-base-content">Profile</th>
                            <th className="text-base-content">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td className="text-base-content">{user.name}</td>
                              <td className="text-base-content">
                                {user.email}
                              </td>
                              <td className="text-base-content">
                                {user.credits}
                              </td>
                              <td className="text-base-content">
                                {(user.savedPosts || []).length}
                              </td>
                              <td className="text-base-content">
                                {user.profileCompleted ? (
                                  <span className="badge badge-success">
                                    Complete
                                  </span>
                                ) : (
                                  <span className="badge badge-warning">
                                    Incomplete
                                  </span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
                                  onClick={() => handleOpenCreditModal(user)}
                                  disabled={isLoading}
                                >
                                  <PencilIcon className="w-5 h-5 mr-1" />
                                  Edit Credits
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        {/* Credit Update Modal */}
        <div className={`modal ${creditModalOpen ? "modal-open" : ""}`}>
          <form
            method="dialog"
            className="modal-box bg-base-100 shadow-xl border border-base-300 p-6 max-w-md rounded-xl"
          >
            <button
              type="button"
              onClick={() => setCreditModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-base-content/50 hover:bg-base-300"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-3 mb-5 border-b border-base-300 pb-3">
              <CurrencyDollarIcon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-xl text-base-content">
                  Update Credits
                </h3>
                <p className="text-sm text-base-content/70">
                  Adjust credits for {selectedUser?.name || "user"}.
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="form-control">
                <label className="label mr-2">
                  <span className="label-text text-base-content font-medium">
                    Credits
                  </span>
                </label>
                <input
                  type="number"
                  value={creditsInput}
                  onChange={(e) => setCreditsInput(Number(e.target.value))}
                  className="input input-bordered bg-base-200 text-base-content focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                  disabled={updatingCredits}
                />
              </div>
              <div className="form-control">
                <label className="label mr-2">
                  <span className="label-text text-base-content font-medium">
                    Reason
                  </span>
                </label>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="textarea textarea-bordered bg-base-200 text-base-content focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none"
                  placeholder="Reason for credit change"
                  required
                  disabled={updatingCredits}
                />
              </div>
            </div>
            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost btn-sm text-base-content/70 hover:bg-base-300"
                onClick={() => setCreditModalOpen(false)}
                disabled={updatingCredits}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateCredits}
                className={`btn btn-primary btn-sm w-32 ${
                  updatingCredits ? "loading" : ""
                }`}
                disabled={updatingCredits || !reasonInput.trim()}
              >
                {updatingCredits ? "Updating..." : "Update Credits"}
              </button>
            </div>
          </form>
          <form
            method="dialog"
            className="modal-backdrop bg-black/50 cursor-pointer"
          >
            <button>close</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
