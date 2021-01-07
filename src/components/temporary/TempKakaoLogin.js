import React, { useEffect } from "react";
//import Kakao from "kakaojs";
import { Button, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SOCIAL_LOGIN = gql`
  mutation KakaoLogin($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      token
    }
  }
`;

const TempKakaoLogin = props => {
  const [kakaoLogin, { data, error }] = useMutation(SOCIAL_LOGIN);

  useEffect(() => {
    if (data) {
      props.history.push({
        pathname: "/saebaecoupon"
      });
    }
  }, [data]);

  // 카카오 로그인 버튼을 생성합니다.
  const loginWithKakao = () => {
    // Kakao.Auth.login({
    //   success: function(authObj) {
    //     kakaoLogin({
    //       variables: {
    //         provider: "kakao",
    //         accessToken: authObj.access_token
    //       }
    //     });
    //   },
    //   fail: function(err) {
    //     alert(JSON.stringify(err));
    //   }
    // });
  };

  return (
    <Button
      style={{ marginBottom: 10 }}
      basic
      size="large"
      fluid
      onClick={loginWithKakao}
    >
      <Image
        style={{ height: 28, width: 28, marginRight: 20, color: "black" }}
        src={require("../../img/kakaoLogo.png")}
        avatar
      />
      <span>카카오톡으로 계속하기</span>
    </Button>
  );
};

export default TempKakaoLogin;
