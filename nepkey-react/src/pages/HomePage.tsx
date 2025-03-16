import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>NepKey</h1>
      <Link to="/settings">
        <button>Go to Settings</button>
      </Link>
    </div>
  );
};

export default HomePage;
