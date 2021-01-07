import React, { useEffect } from "react";
import { Button, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import FacebookLogin from "react-facebook-login";
import gql from "graphql-tag";

const SOCIAL_LOGIN = gql`
  mutation FacebookLogin($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      token
      social {
        user {
          id
          phoneNumber
        }
      }
    }
  }
`;

const FacebookButton = () => {
  return (
    <Button basic size="large" fluid>
      <Image
        style={{ height: 22, width: 22, marginRight: 20 }}
        src={require("../../img/facebookLogo.png")}
        avatar
      />
      <span style={{ fontSize: 15 }}>페이스북으로 시작하기</span>
    </Button>
  );
};

const FacebookLoginButton = props => {
  const [facebookLogin, { data, error }] = useMutation(SOCIAL_LOGIN);

  const responseFacebook = response => {
    if (response.accessToken) {
      facebookLogin({
        variables: { provider: "facebook", accessToken: response.accessToken }
      });
    }
  };

  useEffect(() => {
    if (data) {
      if (props.nextPath) {
        if (!data.socialAuth.social.user.phoneNumber) {
          props.history.push({
            pathname: "/signup",
            nextPath: props.nextPath
          });
        } else {
          props.history.push({
            pathname: props.nextPath
          });
        }
      } else {
        if (!data.socialAuth.social.user.phoneNumber) {
          props.history.push("/signup");
        } else {
          props.history.push("/");
          window.location.reload();
        }
      }
    }
  }, [data]);

  // 카카오 로그인 버튼을 생성합니다.
  const loginWithFacebook = () => {};

  return (
    <FacebookLogin
      appId="2269825603102626"
      autoLoad={false}
      fields="name,email,picture"
      language="ko_KR"
      textButton={<FacebookButton />}
      cssClass="my-facebook-button-class"
      disableMobileRedirect={true}
      callback={responseFacebook}
    />
  );
};

export default FacebookLoginButton;
