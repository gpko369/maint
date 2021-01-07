import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Responsive } from "semantic-ui-react";
import { Route, Link, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import LoginComponent from "./LoginComponent";
import ChannelService from "../utility/ChannelService";
import TestHeader from "../common/TestHeader";
import EmailLoginComponent from "./EmailLoginComponent";
//import FacebookLogin from "react-facebook-login";

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
    }
  }
`;

const PROJECT_INFO = gql`
  query projectInfo($id: ID!) {
    project(id: $id) {
      id
      title
      coach {
        name
      }
      price
      salePrice
      place
      projectintro {
        id
        projectSpecial
        projectProcess
        projectTolearn
      }
      projectTime
      projectTerm
      maxCapacity
      difficulty
      projectGoal
      titleImageUrl
      titleImage
      curriculum {
        id
        week
        content
      }
    }
  }
`;

//로그인 컴포넌트
const EmailLogin = ({ history, location, match }) => {
  ChannelService.boot({ pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a" });

  const [projectQuery, { error, data, loading }] = useLazyQuery(PROJECT_INFO);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loginType, setLoginType] = useState("");

  useEffect(() => {
    if (match.params.id) {
      projectQuery({ variables: { id: match.params.id } });
      setLoginType("payment");
    } else if (match.path === "/saebaecoupon/login") {
      setLoginType("saebaecoupon");
    }
  }, []);

  useEffect(() => {
    if (data) {
      setProjectInfo(data.project);
    }
  }, [data]);

  return (
    <div>
      {projectInfo ? (
        <Route>
          <Query query={IS_AUTHENTICATED}>
            {({ loading, error, data }) => {
              if (loading) {
                return null;
              }
              if (error) return null;
              history.push({
                pathname: "/project/" + match.params.id + "/order",
                state: { projectData: projectInfo }
              });
              return null;
            }}
          </Query>
        </Route>
      ) : (
        <Route>
          <Query query={IS_AUTHENTICATED}>
            {({ loading, error, data }) => {
              if (loading) {
                return null;
              }
              if (error) return null;
              history.push("/");
              return null;
            }}
          </Query>
        </Route>
      )}
      <TestHeader history={history} type="가입" />

      <Responsive as={Grid} style={{ margin: 0 }} maxWidth={1080}>
        <Grid.Column
          style={{
            maxHeight: 800,
            maxWidth: 400,
            marginTop: 10,
            backgroundColor: "white",
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <EmailLoginComponent
            history={history}
            project={projectInfo ? projectInfo : null}
            loginType={loginType}
          />
        </Grid.Column>
      </Responsive>

      <Responsive
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
          <EmailLoginComponent
            history={history}
            project={projectInfo ? projectInfo : null}
            loginType={loginType}
          />
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Responsive>
    </div>
  );
};

export default EmailLogin;
