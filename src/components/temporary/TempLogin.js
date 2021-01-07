import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Header, Responsive } from "semantic-ui-react";
import { Route, Link, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import { useMutation, useLazyQuery, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import TempLoginComponent from "./TempLoginComponent";
import ChannelService from "../utility/ChannelService";
import TestHeader from "../common/TestHeader";
//import FacebookLogin from "react-facebook-login";

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
    }
  }
`;

//로그인 컴포넌트
const TempLogin = ({ history, location, match }) => {
  ChannelService.boot({ pluginKey: "466cf4d8-2591-44aa-8d27-6d16ff08007a" });
  const { error, loading, data } = useQuery(IS_AUTHENTICATED);

  return (
    <div>
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
          <TempLoginComponent history={history} />
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
          <TempLoginComponent history={history} />
        </Grid.Column>
        <Grid.Column></Grid.Column>
      </Responsive>
    </div>
  );
};

export default TempLogin;
