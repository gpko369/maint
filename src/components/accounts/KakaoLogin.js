import React, { useEffect } from "react";
import Kakao from "kakaojs";
import { Button, Image } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SOCIAL_LOGIN = gql`
  mutation KakaoLogin($provider: String!, $accessToken: String!) {
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

const KakaoLogin = props => {
  const [kakaoLogin, { data, error }] = useMutation(SOCIAL_LOGIN);

  useEffect(() => {
    if (data) {
      //결제과정 중 로그인을 진행할 때
      if (props.nextPath) {
        //회원정보가 불완전할 때
        if (!data.socialAuth.social.user.phoneNumber) {
          props.history.push({
            pathname: "/signup",
            nextPath: props.nextPath
          });
        } else {
          //회원정보가 완전할 때
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
  const loginWithKakao = () => {
    Kakao.Auth.login({
      success: function(authObj) {
        kakaoLogin({
          variables: {
            provider: "kakao",
            accessToken: authObj.access_token
          }
        });
      },
      fail: function(err) {
        alert(JSON.stringify(err));
      }
    });
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
        style={{ height: 22, width: 22, marginRight: 20, color: "black" }}
        src={require("../../img/kakaoLogo.png")}
        avatar
      />
      <span style={{ fontSize: 15 }}>카카오톡으로 시작하기</span>
    </Button>
  );
};

export default KakaoLogin;
