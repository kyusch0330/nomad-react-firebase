import React, { useState } from "react";
import { storageService, dbService } from "myFirebase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./KweetFactory.css";

const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState("");
  const [attachment, setAttachment] = useState(""); // image file attachment 파일 첨부

  const onSubmit = async (event) => {
    event.preventDefault();
    if (kweet === "") return;
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
    <form onSubmit={onSubmit} classNmae="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={kweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photo</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      {/*이미지 파일만 업로드 가능*/}
      <input
        id="attach-file"
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={handleClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default KweetFactory;
