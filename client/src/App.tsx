import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import AuthForm from "./components/AuthForm";
import { Provider } from "react-redux";
import appStore from "./utils/store/appStore";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="auth" element={<AuthForm />} />
              <Route path="home" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feed" element={<Feed />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
