import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BookmarkIcon as BookmarkIconOutline,
  ShareIcon,
  FlagIcon as FlagIconOutline,
  CalendarDaysIcon,
  UserCircleIcon,
  GlobeAltIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

import { BASE_URL } from "../utils/constants";
import { Post, User } from "../utils/types";
import { ShimmerFeed } from "../utils/shimmer/PostShimmer";
import { addUser } from "../utils/store/userSlice";

const Feed: React.FC = () => {
  const currentUser = useSelector((state: { user: User }) => state.user);
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [reportReason, setReportReason] = useState<string>("");
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [savingPostId, setSavingPostId] = useState<string | null>(null);
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      setPosts(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load posts");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSavePost = async (postId: string) => {
    if (!currentUser) {
      toast.error("Please log in to save posts", { position: "top-center" });
      return;
    }
    if (savingPostId) return;

    setSavingPostId(postId);

    const savePromise = axios.post(
      `${BASE_URL}/feed/${postId}/save`,
      {},
      { withCredentials: true }
    );

    toast.promise(
      savePromise,
      {
        loading: "Saving...",
        success: (response) => {
          const currentSavedPosts = currentUser.savedPosts || [];
          const isCurrentlySaved = currentSavedPosts.includes(postId);
          let updatedSavedPosts;
          if (isCurrentlySaved) {
            updatedSavedPosts = currentSavedPosts.filter((id) => id !== postId);
          } else {
            updatedSavedPosts = [...currentSavedPosts, postId];
          }
          dispatch(addUser({ ...currentUser, savedPosts: updatedSavedPosts }));
          setSavingPostId(null);
          return isCurrentlySaved ? "Post unsaved!" : "Post saved!";
        },
        error: (err) => {
          setSavingPostId(null);
          return err?.response?.data?.message || "Failed to save post";
        },
      },
      {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        success: { duration: 3000 },
        error: { duration: 4000 },
        position: "top-center",
      }
    );
  };

  const handleSharePost = async (postId: string) => {
    if (sharingPostId) return;

    setSharingPostId(postId);

    const sharePromise = new Promise<string>(async (resolve, reject) => {
      try {
        const res = await axios.get(`${BASE_URL}/feed/${postId}/share`, {
          withCredentials: true,
        });
        const shareLink = res?.data?.data?.link;
        if (!shareLink) {
          throw new Error("Share link not found in response.");
        }
        await navigator.clipboard.writeText(shareLink);
        resolve("Link copied!");
      } catch (err: any) {
        reject(
          new Error(
            err?.response?.data?.message || "Failed to get or copy share link"
          )
        );
      }
    });

    toast
      .promise(
        sharePromise,
        {
          loading: "Getting link...",
          success: (message) => message,
          error: (err) => err.message,
        },
        {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
          success: { duration: 3000 },
          error: { duration: 4000 },
          position: "top-center",
        }
      )
      .finally(() => {
        setSharingPostId(null);
      });
  };

  const handleOpenReportModal = (postId: string) => {
    if (!currentUser) {
      toast.error("Please log in to report posts", { position: "top-center" });
      return;
    }
    setSelectedPostId(postId);
    setReportReason("");
    setReportModalOpen(true);
  };

  const handleReportPost = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason", { position: "top-center" });
      return;
    }

    setReportingPostId(selectedPostId);

    const reportPromise = axios.post(
      `${BASE_URL}/feed/${selectedPostId}/report`,
      { reason: reportReason },
      { withCredentials: true }
    );

    toast.promise(
      reportPromise,
      {
        loading: "Submitting report...",
        success: () => {
          setReportModalOpen(false);
          setReportReason("");
          setSelectedPostId("");
          setReportingPostId(null);
          return "Report submitted successfully";
        },
        error: (err) => {
          setReportingPostId(null);
          return err?.response?.data?.message || "Failed to report post";
        },
      },
      {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
        success: { duration: 3000 },
        error: { duration: 4000 },
        position: "top-center",
      }
    );
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
      <Toaster
        containerClassName="text-sm"
        toastOptions={{
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
          success: { duration: 3000 },
          error: { duration: 4000 },
        }}
      />
      <div className="max-w-2xl mx-auto py-8 px-4 min-h-screen">
        <h2 className="text-3xl font-bold mb-8 text-center text-base-content">
          Latest Feed
        </h2>

        {isLoading && <ShimmerFeed count={5} />}

        {!isLoading && error && (
          <div role="alert" className="alert alert-error my-5 shadow-lg">
            <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6" />
            <div>
              <h3 className="font-bold">Error!</h3>
              <div className="text-xs">{error}</div>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={fetchPosts}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
              />
            </svg>
            <p className="text-lg font-medium">Feed is Empty</p>
            <p className="text-sm">No posts found. Check back later!</p>
          </div>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post) => {
              const isSaved = currentUser?.savedPosts?.includes(post._id);
              const isSavingThisPost = savingPostId === post._id;
              const isSharingThisPost = sharingPostId === post._id;

              return (
                <div
                  key={post._id}
                  className="card bg-base-100 shadow-md border border-base-300 transition-shadow duration-200 hover:shadow-lg"
                >
                  <div className="card-body p-4 md:p-6">
                    <div className="flex justify-between items-center mb-3 text-xs text-base-content/70">
                      <span className="flex items-center gap-1 capitalize">
                        <GlobeAltIcon className="w-4 h-4" />
                        {post.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCircleIcon className="w-4 h-4" />
                        {post.author || "Unknown"}
                      </span>
                    </div>
                    <p className="text-base-content leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-base-300">
                      <span className="flex items-center gap-1 text-xs text-base-content/60">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </span>
                      {currentUser && (
                        <div className="flex space-x-1">
                          <button
                            title={isSaved ? "Unsave Post" : "Save Post"}
                            className={`btn btn-ghost btn-xs p-1 hover:bg-base-300 ${
                              isSaved
                                ? "text-primary hover:text-primary-focus"
                                : "text-base-content/70 hover:text-primary"
                            } ${
                              isSavingThisPost
                                ? "loading loading-spinner !text-primary"
                                : ""
                            }`}
                            onClick={() => handleSavePost(post._id)}
                            disabled={isSavingThisPost || isSharingThisPost}
                          >
                            {!isSavingThisPost &&
                              (isSaved ? (
                                <BookmarkIconSolid className="w-5 h-5" />
                              ) : (
                                <BookmarkIconOutline className="w-5 h-5" />
                              ))}
                          </button>
                          <button
                            title="Share Post"
                            className={`btn btn-ghost btn-xs p-1 text-base-content/70 hover:bg-base-300 hover:text-secondary ${
                              isSharingThisPost
                                ? "loading loading-spinner !text-secondary"
                                : ""
                            }`}
                            onClick={() => handleSharePost(post._id)}
                            disabled={isSavingThisPost || isSharingThisPost}
                          >
                            {!isSharingThisPost && (
                              <ShareIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            title="Report Post"
                            className="btn btn-ghost btn-xs p-1 text-base-content/70 hover:bg-base-300 hover:text-error"
                            onClick={() => handleOpenReportModal(post._id)}
                            disabled={isSavingThisPost || isSharingThisPost}
                          >
                            <FlagIconOutline className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={`modal ${reportModalOpen ? "modal-open" : ""}`}>
        <form
          method="dialog"
          className="modal-box bg-base-100 relative shadow-xl border border-base-300 p-6 max-w-lg"
        >
          <button
            type="button"
            onClick={() => setReportModalOpen(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-base-content/50 hover:bg-base-300"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-3 mb-4 border-b border-base-300 pb-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-error mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-base-content leading-tight">
                Report Content
              </h3>
              <p className="text-xs text-base-content/70">
                Help maintain a positive community.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-base-content/80">
              Please provide a clear reason why you believe this post violates
              community guidelines or is inappropriate.
            </p>
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text text-base-content/80 flex items-center gap-1">
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                  Reason for Reporting
                </span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-28 bg-base-200 text-base-content focus:border-primary focus:ring-1 focus:ring-primary focus:ring-opacity-50 placeholder:text-base-content/40 resize-none transition duration-150 ease-in-out`}
                placeholder="Details..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-ghost btn-sm mr-2"
              onClick={() => setReportModalOpen(false)}
              disabled={!!reportingPostId}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReportPost}
              className={`btn btn-error btn-sm w-32 ${
                reportingPostId === selectedPostId ? "loading" : ""
              }`}
              disabled={!!reportingPostId || !reportReason.trim()}
            >
              {reportingPostId === selectedPostId
                ? "Submitting..."
                : "Submit Report"}
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
    </>
  );
};

export default Feed;
