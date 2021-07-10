import { authService, dbService } from "myFirebase";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);
  const getKweets = async () => {
    const kweetsFromDB = await dbService.collection("kweets").get();
    let _kweets = [];
    kweetsFromDB.forEach((document) => {
      const kweetObject = {
        ...document.data(),
        id: document.id,
      };
      _kweets = [kweetObject, ..._kweets];
    });
    setKweets(_kweets);
  };
  useEffect(() => {
    getKweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    //새로운 document를 collection에 저장(document id 자동 부여)
    await dbService.collection("kweets").add({
      kweet, // = kweet:kweet
      createdAt: Date.now(),
      author: authService.currentUser.email,
    });
    getKweets();
    setKweet("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  console.log(kweets);
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
            <div key={kweet.id}>
              <span>{kweet.author}</span> : <span>{kweet.kweet}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
