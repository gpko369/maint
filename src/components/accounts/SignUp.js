import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Responsive } from "semantic-ui-react";
import { Route, Link, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import SignUpComponent from "./SignUpComponent";
import LoginComponent from "./LoginComponent";
import ChannelService from "../utility/ChannelService";
import TestHeader from "../common/TestHeader";
import TitleHeader from "../common/TitleHeader";
import SignUpComponentNew from "./SignUpComponentNew";
//import FacebookLogin from "react-facebook-login";

const USER_INFO = gql`
  query {
    mypage {
      id
      email
    }
  }
`;

//로그인 컴포넌트
const SignUp = ({ history, location, match }) => {
  const { error, data, loading } = useQuery(USER_INFO);
  const [userID, setUserID] = useState("");
  const [userEmail, setUserEmail] = useState("");

  console.log(location.nextPath);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) {
      setUserID(data.mypage.id);
      setUserEmail(data.mypage.email);
    }
  }, [data]);

  return (
    <div>
      <TitleHeader
        history={history}
        type="회원정보 입력"
        nextPathRemember={location.nextPath}
      />

      <Grid style={{ margin: 0 }}>
        <Grid.Column
          style={{
            maxWidth: 400,
            marginTop: 10,
            padding: 25,
            backgroundColor: "white",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          {data ? (
            <SignUpComponent
              history={history}
              nextPath={location.nextPath}
              user={userID}
              userEmail={userEmail}
            />
          ) : (
            <SignUpComponentNew
              history={history}
              nextPath={location.nextPath}
            />
          )}
        </Grid.Column>
      </Grid>

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
          {data ? (
            <SignUpComponent
              history={history}
              project={projectInfo ? projectInfo : null}
              loginType={loginType}
              nextPath={nextPath}
              user={userID}
            />
          ) : (
            <SignUpComponentNew
              history={history}
              project={projectInfo ? projectInfo : null}
              loginType={loginType}
              nextPath={nextPath}
            />
          )}
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Responsive> */}
    </div>
  );
};

export default SignUp;
