import React, { useState, useEffect } from "react";
import { dbService, storageService } from "myFirebase";
import Kweet from "components/Kweet";
import KweetFactory from "components/KweetFactory";

const Home = ({ userObj }) => {
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

  return (
    <div className="container">
      <KweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
