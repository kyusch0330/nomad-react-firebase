import React, { useState } from "react";
import { authService } from "myFirebase";
const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  // Create User 와 Sign In 토글
  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
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
      setError(error);
    }
  };
  return (
    <>
      <form onSubmit={onSubmit} classNmae="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          classNmae="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          classNmae="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
          classNmae="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
