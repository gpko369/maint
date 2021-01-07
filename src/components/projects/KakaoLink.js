import React, { useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
import Kakao from "kakaojs";

const KakaoLink = ({ project }) => {
  // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

  // useEffect(() => {
  //   Kakao.Link.createDefaultButton({
  //     container: "#kakao-link",
  //     objectType: "feed",
  //     content: {
  //       title: "딸기 치즈 케익",
  //       description: "#케익 #딸기 #삼평동 #카페 #분위기 #소개팅",
  //       imageUrl:
  //         "http://mud-kage.kakao.co.kr/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
  //       link: {
  //         mobileWebUrl: "https://maint.me",
  //         webUrl: "https://maint.me"
  //       }
  //     },
  //     social: {
  //       likeCount: 286,
  //       commentCount: 45,
  //       sharedCount: 845
  //     },
  //     buttons: [
  //       {
  //         title: "웹으로 보기",
  //         link: {
  //           mobileWebUrl: "https://maint.me",
  //           webUrl: "https://maint.me"
  //         }
  //       },
  //       {
  //         title: "앱으로 보기",
  //         link: {
  //           mobileWebUrl: "https://maint.me",
  //           webUrl: "https://maint.me"
  //         }
  //       }
  //     ]
  //   });
  // }, []);
  const onClickKakaoLink = () => {
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: project.title,
        description: project.projectGoal,
        imageUrl:
          "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
          project.titleImage,
        link: {
          mobileWebUrl: "http://maint.me/project/" + project.id,
          webUrl: "http://maint.me/project/" + project.id
        }
      },
      buttons: [
        {
          title: "웹으로 보기",
          link: {
            mobileWebUrl: "http://maint.me/project/" + project.id,
            webUrl: "http://maint.me/project/" + project.id
          }
        },
        {
          title: "앱으로 보기",
          link: {
            mobileWebUrl: "http://maint.me/project/" + project.id,
            webUrl: "http://maint.me/project/" + project.id
          }
        }
      ]
    });
  };

  return (
    <Button id="kakao-link" fluid onClick={onClickKakaoLink}>
      <i
        className="ri-share-forward-box-line ri-lg"
        style={{
          verticalAlign: "middle",
          marginRight: 10
        }}
      ></i>
      공유하기
    </Button>
  );
};

export default KakaoLink;
