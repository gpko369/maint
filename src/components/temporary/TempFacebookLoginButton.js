import React, { useEffect } from "react";
import { Button, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import FacebookLogin from "react-facebook-login";
import gql from "graphql-tag";

const SOCIAL_LOGIN = gql`
  mutation FacebookLogin($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      token
    }
  }
`;

const FacebookButton = () => {
  return (
    <Button basic size="large" fluid>
      <Image
        style={{ height: 28, width: 28, marginRight: 20 }}
        src={require("../../img/facebookLogo.png")}
        avatar
      />
      <span>페이스북으로 계속하기</span>
    </Button>
  );
};

const TempFacebookLoginButton = props => {
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
      props.history.push({
        pathname: "/saebaecoupon"
      });
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

export default TempFacebookLoginButton;
