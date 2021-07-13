import { dbService, storageService } from "myFirebase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "./Kweet.css";

const Kweet = ({ kweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);
  const handleDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this kweet?");
    if (ok) {
      //delete
      await dbService.doc(`kweets/${kweetObj.id}`).delete();
      //url에서 reference를 얻어 storage의 이미지파일 삭제
      await storageService.refFromURL(kweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`kweets/${kweetObj.id}`).update({
      text: newKweet,
    });
    setNewKweet("");
    setEditing(false);
  };
  const handleChange = (event) => {
    const {
      target: { value, name },
    } = event;

    if (name === "editKweet") {
      setNewKweet(value);
    }
  };
  return (
    <div className="kweet">
      {/* edit kweet */}
      {editing ? (
        <>
          <form onSubmit={handleSubmit} className="container kweetEdit">
            <input
              type="text"
              name="editKweet"
              value={newKweet}
              placeHolder="Edit your Kweet"
              autoFocus
              onChange={handleChange}
              required
              className="formInput"
            />
            <input type="submit" value="Update Kweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <div>
            <span>{kweetObj.text}</span>
          </div>
          {kweetObj.attachmentUrl && <img src={kweetObj.attachmentUrl} />}
          {isOwner && (
            <div className="kweet__actions">
              <span onClick={handleDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
