import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj, refreshUser }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/profile",
            }}
          >
            {userObj.displayName}'s Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
