import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
// src폴더를 base로 한 경로로 설정되어 있음

const AppRouter = (props) => {
  return (
    <Router>
      {props.isLoggedIn && <Navigation />}
      {/* 로그인 상태에 따라 라우트 구성이 달라짐 */}
      <Switch>
        {props.isLoggedIn ? (
          <>
            {/* Fragment */}
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            {/* <Redirect from="*" to="/" /> */}
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
            {/* <Redirect from="*" to="/" /> */}
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
