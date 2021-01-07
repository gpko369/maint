import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Responsive } from "semantic-ui-react";
import { Route, Link, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import LoginComponent from "./LoginComponent";
import ChannelService from "../utility/ChannelService";
import TestHeader from "../common/TestHeader";
import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";
import FixHeader from "../common/FixHeader";
//import FacebookLogin from "react-facebook-login";

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
      phoneNumber
    }
  }
`;

//로그인 컴포넌트
const Login = ({ history, location, match }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(location.nextPath);

  const [nextPath, setNextPath] = useState(
    location.nextPath ? location.nextPath : null
  );

  return (
    <div>
      <Route>
        <Query query={IS_AUTHENTICATED}>
          {({ loading, error, data }) => {
            if (loading) {
              return null;
            }
            if (error) return null;
            if (data) {
              if (location.nextPath) {
                history.push(location.nextPath);
              }
              history.push("/");
              return null;
            }
          }}
        </Query>
      </Route>
      <FixHeader />

      <Responsive as={Grid} style={{ margin: 0 }}>
        <Grid.Column
          style={{
            maxHeight: 800,
            maxWidth: 400,
            marginTop: 10,
            backgroundColor: "white",
            marginLeft: "auto",
            marginRight: "auto",
            padding: 25
          }}
        >
          <LoginComponent
            history={history}
            nextPath={nextPath ? nextPath : null}
          />
        </Grid.Column>
      </Responsive>

      {/* <Responsive
        as={Grid}
        style={{
          height: "100vh",
          backgroundImage:
            "url('https://s3.ap-northeast-2.amazonaws.com/test.maint/media/banners/Login_background.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          margin: 0,
          marginBottom: -70
        }}
        minWidth={1080}
        verticalAlign="middle"
        centered
        columns={3}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(to top,white,white 80%,white 50%)",
            opacity: 0.7
          }}
        ></div>
        <Grid.Column></Grid.Column>
        <Grid.Column
          style={{
            maxHeight: 918,
            maxWidth: 552,
            backgroundColor: "white",
            paddingTop: 40,
            paddingBottom: 120,
            paddingLeft: 45,
            paddingRight: 45,
            borderRadius: 6,
            boxShadow: "0 0 15pt 1pt rgba(0,0,0,0.2)"
          }}
        >
          <LoginComponent
            history={history}
            project={projectInfo ? projectInfo : null}
            loginType={loginType}
          />
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Responsive> */}
    </div>
  );
};

export default Login;
