import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <Link to="/">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default Settings;
