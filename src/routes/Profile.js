import React, { useEffect, useState } from "react";
import { authService, dbService } from "myFirebase";
import { useHistory } from "react-router-dom";

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
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={newDisplayName}
          type="text"
          placeholder="Display name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <span>Profile</span>
      <button onClick={handleLogoutClick}>Log out</button>
    </>
  );
};

export default Profile;
