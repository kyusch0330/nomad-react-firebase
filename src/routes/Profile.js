import React, { useEffect, useState } from "react";
import { authService, dbService } from "myFirebase";
import { useHistory } from "react-router-dom";
import "./Profile.css";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const handleLogoutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyKweets = async () => {
    // db에서 where문 필터링을 통해 알맞은 kweet들을 가져온다.
    // 복잡한 쿼리는 인덱스를 만들어줘야 함(개발자 콘솔 에러 링크 클릭)
    const kweets = await dbService
      .collection("kweets")
      .where("creatorId", "==", userObj.uid) //원한다면 where().where()... 처럼 필터링 여러 번 가능
      .orderBy("createdAt")
      .get();
    kweets.docs.map((doc) => doc.data());
  };
  useEffect(() => {
    getMyKweets();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="profileForm">
        <input
          onChange={handleChange}
          autoFocus
          type="text"
          value={newDisplayName}
          placeholder="Display name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={handleLogoutClick}>
        Log out
      </span>
    </div>
  );
};

export default Profile;
