import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "myFirebase";

function App() {
  //firebase가 실행되고 현재 유저정보를 가져오면 init = true
  const [init, setInit] = useState(false);
  //authService.currentUser : 현재 유저 정보를 초기값으로 (로그인 여부)
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    //firebase가 실행되고 현재 유저정보가 변화하면 실행
    //IndexedDB에 저장된 user정보 변경할 때마다 동작하는 콜백
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; Kwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
