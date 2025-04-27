import { useSelector } from "react-redux";
import { User } from "../utils/types";

const Home = () => {
  const user = useSelector((store: { user: User }) => store.user);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-center flex gap-2 justify-center items-center">
        Welcome, {user?.name}!
      </h1>
    </div>
  );
};

export default Home;
