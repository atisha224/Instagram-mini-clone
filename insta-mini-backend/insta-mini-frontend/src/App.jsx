import { useState } from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      <nav style={{ padding: "10px" }}>
        <button onClick={() => setPage("feed")}>Feed</button>
        <button onClick={() => setPage("create")}>Create</button>
        <button onClick={() => setPage("profile")}>Profile</button>
      </nav>

      {page === "login" && <Login setPage={setPage} />}
      {page === "feed" && <Feed />}
      {page === "create" && <CreatePost />}
      {page === "profile" && <Profile />}
    </div>
  );
}

export default App;
