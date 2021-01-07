import React from "react";
import {
  Container,
  Divider,
  Grid,
  Header,
  List,
  Segment,
  Image,
  Button
} from "semantic-ui-react";

const Footer = () => {
  const onClickChannelTalk = () => {
    window.ChannelIO("show");
  };

  return (
    <Segment
      style={{
        margin: "5em 0em 0em",
        padding: "2em 0em 5em 0em",
        color: "rgb(53,53,53)"
      }}
      vertical
    >
      <Container textAlign="left" style={{ fontSize: 12 }}>
        <Grid style={{ margin: 0 }}>
          <Grid.Row columns={2}>
            <Grid.Column
              onClick={() => (window.location.href = "https://maint.me")}
              style={{ padding: 0 }}
            >
              <Image
                style={{ width: 123 }}
                src={require("../../img/maintletterlogo.png")}
              />
            </Grid.Column>
            <Grid.Column
              verticalAlign="middle"
              textAlign="right"
              style={{ padding: 0 }}
            >
              <i
                style={{ verticalAlign: "middle", color: "rgba(53,53,53,0.5)" }}
                className="ri-instagram-line ri-2x"
                onClick={() =>
                  window.open("https://www.instagram.com/maint_official/")
                }
              ></i>
              <i
                style={{
                  paddingLeft: 14,
                  verticalAlign: "middle",
                  color: "rgba(53,53,53,0.5)"
                }}
                className="ri-facebook-circle-line ri-2x"
                onClick={() =>
                  window.open("https://www.facebook.com/Maint.korea/")
                }
              ></i>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <span
              className="footer-service-agreement"
              onClick={() => {
                window.location.href = "https://maint.me/agreement";
              }}
              style={{ fontWeight: "bold" }}
            >
              이용약관
            </span>
            <span
              className="footer-privacy-agreement"
              onClick={() => {
                window.location.href = "https://maint.me/privacy";
              }}
              style={{ marginLeft: 20, fontWeight: "bold" }}
            >
              개인정보 처리 방침
            </span>
          </Grid.Row>
          <Grid.Row style={{ fontWeight: "bold" }}>
            고객센터 운영시간 : 10:00 ~ 18:00
            <Button
              fluid
              size="large"
              basic
              onClick={onClickChannelTalk}
              color="red"
              style={{
                fontSize: 13,
                fontWeight: "bold",
                margin: 0,
                marginTop: 5
              }}
            >
              마인트 고객센터
            </Button>
          </Grid.Row>
        </Grid>
        <p>(주)몽우</p>
        <p style={{ lineHeight: 1.8, marginTop: 20, marginBottom: 25 }}>
          대표자: 최홍규
          <br />
          사업자 번호: 489-81-01405
          <br />
          통신판매신고번호 : 2019-서울관악-0970
          <br />
          서울특별시 관악구 관악로 12길 10
          <br />
          고객센터 : 02-876-3233
        </p>
        <p style={{ lineHeight: 1.8 }}>
          (주)몽우는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서
          (주)몽우는 상품, 거래정보 및 거래에 대하여 일절 책임을 지지 않습니다.
        </p>
        <p>Copyright ⓒ Mongwoo Inc. All rights reserved.</p>
      </Container>
    </Segment>
  );
};

export default Footer;
