import React from "react";
import { authService } from "myFirebase";
import { useHistory } from "react-router-dom";

const Profile = (props) => {
  const history = useHistory();
  const handleLogoutClick = () => {
    authService.signOut();
    history.push("/");
  };
  return (
    <>
      <span>Profile</span>
      <button onClick={handleLogoutClick}>Log out</button>
    </>
  );
};

export default Profile;
