import { dbService } from "myFirebase";
import React, { useState, useEffect } from "react";
import Kweet from "components/Kweet";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);

  useEffect(() => {
    //onSnapshot : db의 변화를 감지하는 listner (real time)
    dbService.collection("kweets").onSnapshot((snapshot) => {
      const kweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKweets(kweetArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    //새로운 document를 collection에 저장(document id 자동 부여)
    await dbService.collection("kweets").add({
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      email: userObj.email,
    });
    setKweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  // console.log(kweets);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={kweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Kweet" />
      </form>
      <div>
        {kweets.map((kweet) => {
          return (
            <Kweet
              key={kweet.id}
              kweetObj={kweet}
              isOwner={kweet.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
