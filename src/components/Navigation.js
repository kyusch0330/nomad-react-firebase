import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj, refreshUser }) => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link to="/">
            <FontAwesomeIcon icon={faTwitter} color={"#00A0F0"} size="2x" />
          </Link>
        </li>
        <li>
          <Link
            to={{
              pathname: "/profile",
            }}
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#00A0F0"} size="2x" />
            <span style={{ marginTop: 10 }}>
              {userObj.displayName}'s Profile
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
