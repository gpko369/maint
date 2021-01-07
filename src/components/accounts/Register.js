import React from "react";
import { Grid, Responsive, Container } from "semantic-ui-react";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LoginBannerText from "./LoginBannerText";
import RegisterComponent from "./RegisterComponent";

const IS_AUTHENTICATED = gql`
  query {
    mypage {
      id
    }
  }
`;

//회원가입 컴포넌트
const Register = props => {
  return (
    <div>
      <Route>
        <Query query={IS_AUTHENTICATED}>
          {({ loading, error, data }) => {
            if (loading) {
              return null;
            }
            if (error) return null;
            props.history.goBack();
          }}
        </Query>
      </Route>
      <Responsive as={Grid} style={{ margin: 0 }} maxWidth={1080}>
        <Grid.Column
          style={{
            maxHeight: 700,
            maxWidth: 400,
            backgroundColor: "white",
            marginTop: 50,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <RegisterComponent history={props.history} />
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
        <Grid.Row>
          <Grid.Column>
            <LoginBannerText />
          </Grid.Column>
          <Grid.Column></Grid.Column>
          <Grid.Column
            style={{
              height: 700,
              maxWidth: 400,
              backgroundColor: "white",
              paddingTop: 40,
              paddingBottom: 40,
              paddingLeft: 30,
              paddingRight: 30,
              borderRadius: 4,
              boxShadow: "1px 1px lightgrey"
            }}
          >
            <RegisterComponent history={props.history} />
          </Grid.Column>
        </Grid.Row>
      </Responsive>
    </div>
  );
};

export default Register;
