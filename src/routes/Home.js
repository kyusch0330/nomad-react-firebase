import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "myFirebase";
import Kweet from "components/Kweet";

const Home = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [kweets, setKweets] = useState([]);
  const [attachment, setAttachment] = useState(""); // image file attachment 파일 첨부
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
    let attachmentUrl = "";
    //첨부 파일이 있는 경우에만
    if (attachment !== "") {
      //file에 대한 reference를 가진다.
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      //storage에 첨부파일 저장
      const response = await attachmentRef.putString(attachment, "data_url"); //data_url : data format
      attachmentUrl = await response.ref.getDownloadURL();
    }
    //collection에 저장할 kweet 객체
    const kweetObj = {
      text: kweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      email: userObj.email,
      attachmentUrl,
    };
    //새로운 document를 collection에 저장(document id 자동 부여)
    await dbService.collection("kweets").add(kweetObj);
    setKweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setKweet(value);
  };
  const handleFileChange = (event) => {
    //console.log(event.target.files);
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // result는 엄청나게 긴 이미지 주소(브라우저에서 볼 수 있음)
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  // 첨부 이미지 미리보기 제거
  const handleClearAttachment = () => setAttachment("");
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
        {/*오직 이미지 파일만 업로드 가능*/}
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <input type="submit" value="Kweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" />
            <button onClick={handleClearAttachment}>Clear</button>
          </div>
        )}
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
