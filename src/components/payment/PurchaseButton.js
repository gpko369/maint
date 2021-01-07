import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Segment,
  Container,
  Image,
  Divider,
  Header
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import BootPay from "bootpay-js";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const VERIFY_PAYMENT = gql`
  mutation VerifyPayment($applyId: ID!, $receiptId: String!) {
    verifyPayment(applyId: $applyId, receiptId: $receiptId) {
      payment {
        id
        verified
      }
    }
  }
`;

const SLACK_NOTIFY = gql`
  mutation SlakcNotify($channel: String, $attachments: JSONString) {
    slackNotify(channel: $channel, attachments: $attachments) {
      message
    }
  }
`;

const CREATE_APPLY = gql`
  mutation CreateApply($couponId: ID, $quantity: Int, $classId: ID) {
    createApply(couponId: $couponId, quantity: $quantity, classId: $classId) {
      message
      apply {
        id
        orderId
        price
        user {
          id
          name
          email
          phoneNumber
        }
        pClass {
          project {
            id
            title
            price
            titleImage
          }
        }
        coupon {
          amount
        }
      }
    }
  }
`;

const PurchaseButton = props => {
  const [slackNotify] = useMutation(SLACK_NOTIFY);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);
  const [createApply, { data }] = useMutation(CREATE_APPLY);

  //   useEffect(() => {
  //     if (data) {
  //       console.log(data);
  //       history.push("/mypage");
  //     }
  //   }, [data]);

  useEffect(() => {
    if (data && data.createApply) {
      if (
        data.createApply.message ===
        "이미 결제 완료된 신청건이 존재합니다. 관리자에게 기존 결제건 취소요청을 해주세요"
      ) {
        alert(
          "이미 결제 완료된 프로젝트입니다. 관리자에게 기존 결제건 관련 문의를 해주세요."
        );
        props.history.push("/");
      } else if (props.method === "toss") {
        props.history.push({
          pathname: "/toss/payment/applyId/" + data.createApply.apply.id,
          state: "toss"
        });
      } else {
        purchase(
          data.createApply.apply.price,
          data.createApply.apply.pClass.project.id,
          data.createApply.apply.pClass.project.title,
          data.createApply.apply.user.name,
          data.createApply.apply.user.email,
          data.createApply.apply.user.phoneNumber,
          data.createApply.apply.user.id,
          data.createApply.apply.orderId,
          data.createApply.apply.id,
          props.method,
          data.createApply.apply.pClass.project
        );
      }
    }
  }, [data]);

  const onClickPurchase = () => {
    if (!props.serviceAgreement) {
      alert("이용약관에 동의해주셔야합니다.");
    } else if (!props.detailAgreement) {
      alert("상품, 가격, 및 할인 정보에 동의해주셔야합니다.");
    } else {
      createApply({
        variables: {
          couponId: props.coupon ? props.coupon[0].id : -1,
          quantity: props.quantity,
          classId: props.projectClass
        }
      });
    }
  };

  const pleaseVerify = () => {
    alert("본인인증을 완료하신 후 결제가 가능합니다.");
  };

  const purchase = (
    price,
    project_id,
    title,
    username,
    email,
    phoneNumber,
    user_id,
    order_id,
    apply_id,
    pay_method,
    projectInfo
  ) => {
    BootPay.request({
      price: price, //실제 결제되는 가격
      application_id: "5dc13d864f74b4002ec5f50d",
      name: title, //결제창에서 보여질 이름
      pg: "danal",
      method: pay_method, //결제수단, 입력하지 않으면 결제수단 선택부터 화면이 시작합니다.
      show_agree_window: 0, // 부트페이 정보 동의 창 보이기 여부
      items: [
        {
          item_name: title, //상품명
          qty: 1, //수량
          unique: project_id, //해당 상품을 구분짓는 primary key
          price: price, //상품 단가
          cat1: "MAINT", // 대표 상품의 카테고리 상, 50글자 이내
          cat2: "프로젝트", // 대표 상품의 카테고리 중, 50글자 이내
          cat3: "" // 대표상품의 카테고리 하, 50글자 이내
        }
      ],
      user_info: {
        username: username,
        email: email,
        addr: "사용자 주소",
        phone: phoneNumber
      },
      order_id: order_id, //고유 주문번호로, 생성하신 값을 보내주셔야 합니다.
      params: {
        apply_id: apply_id,
        user_id: user_id,
        customvar1234: "변수명도 마음대로"
      },
      account_expire_at: "2018-05-25", // 가상계좌 입금기간 제한 ( yyyy-mm-dd 포멧으로 입력해주세요. 가상계좌만 적용됩니다. )
      extra: {
        start_at: "2019-05-10", // 정기 결제 시작일 - 시작일을 지정하지 않으면 그 날 당일로부터 결제가 가능한 Billing key 지급
        end_at: "2022-05-10", // 정기결제 만료일 -  기간 없음 - 무제한
        //vbank_result: 1, // 가상계좌 사용시 사용, 가상계좌 결과창을 볼지(1), 말지(0), 미설정시 봄(1)
        quota: "0,2,3,5" // 결제금액이 5만원 이상시 할부개월 허용범위를 설정할 수 있음, [0(일시불), 2개월, 3개월] 허용, 미설정시 12개월까지 허용
      }
    })
      .error(function(data) {
        //결제 진행시 에러가 발생하면 수행됩니다.
        console.log(data);
      })
      .cancel(function(data) {
        //결제가 취소되면 수행됩니다.
        console.log(data);
      })
      .ready(function(data) {
        // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
        console.log(data);
      })
      .confirm(function(data) {
        //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
        //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
        console.log(data);
        var enable = true; // 재고 수량 관리 로직 혹은 다른 처리
        if (enable) {
          BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
        } else {
          BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
        }
      })
      .close(function(data) {
        // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
        console.log(data);
      })
      .done(function(data) {
        //결제가 정상적으로 완료되면 수행됩니다
        //비즈니스 로직을 수행하기 전에 결제 유효성 검증을 하시길 추천합니다.

        //여기서 이제 data값을 가지고 결제
        console.log(data);

        slackNotify({
          variables: {
            channel: "test_notify",
            attachments: '{"text":"결제 완료 ' + data["receipt_id"] + '"}'
          }
        });

        props.history.push({
          pathname: "/purchaseComplete/" + data["receipt_id"],
          state: {
            applyId: apply_id,
            paymentData: data,
            projectData: projectInfo
          }
        });
      });
  };

  return (
    <Button
      style={{
        backgroundColor: "#eb4c2a",
        color: "white",
        marginTop: 20,
        paddingTop: 12,
        paddingBottom: 12
      }}
      fluid
      onClick={onClickPurchase}
    >
      프로젝트 결제하기
    </Button>
    //   <Button
    //   style={{
    //     backgroundColor: "#eb4c2a",
    //     color: "white",
    //     marginTop: 20,
    //     paddingTop: 12,
    //     paddingBottom: 12
    //   }}
    //   fluid
    //   onClick={props.hasPhoneNumber ? onClickPurchase : pleaseVerify}
    // >
    //   프로젝트 결제하기
    // </Button>
  );
};

export default PurchaseButton;
