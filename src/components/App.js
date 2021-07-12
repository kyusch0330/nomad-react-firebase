import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "myFirebase";

function App() {
  //firebase가 실행되고 현재 유저정보를 가져오면 init = true
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    //firebase가 실행되고 현재 유저정보가 변화하면 실행
    //IndexedDB에 저장된 user정보 변경할 때마다 동작하는 콜백
    authService.onAuthStateChanged((user) => {
      if (user) {
        //로그인 O
        if (!user.displayName) user.updateProfile({ displayName: "user" });
        setUserObj(user);
      } else {
        //로그인 X
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    // setUserObj(user)는 리액트의 얕은 비교에 의해 같은 값으로 여겨지기 때문에 아래와 같이 작성
    // 혹은 setUserObj(Object.assign({}, user));
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      // 우리가 원하는 function을 얻기 위한 중간 function 역할
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Kwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
