import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/store/userSlice";
import { useEffect } from "react";
import { User } from "../utils/types";

const Body = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: { user: User }) => store.user);
  const navigate = useNavigate();
  const fetchUserProfile = async () => {
    if (user) return;
    try {
      const response = await axios.get(BASE_URL + "/user/profile", {
        withCredentials: true,
      });
      dispatch(addUser(response?.data.data));
    } catch (err) {
      if (err.status === 401) {
        return navigate("/");
      }
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
