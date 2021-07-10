import { authService, firebaseInstance } from "myFirebase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value); //xzczxc
    } else {
      setPassWord(value);
    }
  };
  const onSubmit = async (event) => {
    // prevent refresh
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        // createUser와 동시에 로그인도 수행함
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
        console.log("sign in...");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Create User 와 Sign In 토글
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  // Social login
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <br />
      <button onClick={onSocialClick} name="google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with Github
      </button>
    </div>
  );
};
export default Auth;
