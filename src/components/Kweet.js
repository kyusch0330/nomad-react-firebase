import { dbService } from "myFirebase";
import React, { useState } from "react";

const Kweet = ({ kweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);
  const handleDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this kweet?");
    if (ok) {
      //delete
      await dbService.doc(`kweets/${kweetObj.id}`).delete();
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
    <div>
      {editing ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="editKweet"
              value={newKweet}
              placeHolder="Edit your Kweet"
              onChange={handleChange}
              required
            />
            <input type="submit" value="Update Kweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        isOwner && (
          <>
            <div>
              <span>{kweetObj.email}</span> : <span>{kweetObj.text}</span>
            </div>
            <button onClick={handleDeleteClick}>Delete Kweet</button>
            <button onClick={toggleEditing}>Edit Kweet</button>
          </>
        )
      )}
    </div>
  );
};

export default Kweet;
