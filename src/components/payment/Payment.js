import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Segment,
  Container,
  Image,
  Divider,
  Header,
  Icon,
  Form,
  Responsive,
  GridColumn,
  Checkbox,
  Dropdown
} from "semantic-ui-react";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import numberFormat from "../utility/numberFormat";
import SMSAuthModal from "../accounts/SMSAuthModal";
import PurchaseButton from "./PurchaseButton";
import ReactPixel from "react-facebook-pixel";
import AgreementModal from "./AgreementModal";
import CouponModal from "./CouponModal";
import TestHeader from "../common/TestHeader";
import TitleHeader from "../common/TitleHeader";
import ReactGA from "react-ga";

const MY_PAGE = gql`
  query {
    mypage {
      id
      phoneNumber
      password
      coupon {
        id
        description
        due
        amount
        minPrice
        maxPrice
        apply {
          payment {
            verified
          }
        }
      }
    }
  }
`;

function togetherSale(price, quantity) {
  var sale = 0;
  if (quantity == 1) {
    return sale;
  } else if (quantity == 2) {
    return price * 0.2;
  } else if (quantity == 3) {
    return price * 0.2 + price * 0.3;
  } else if (quantity == 4) {
    return price * 0.2 + price * 0.3 + price * 0.4;
  }
  return sale;
}

const yearOptions = [];
for (var i = 1950; i < 2021; i++) {
  yearOptions.push({ key: String(i), value: String(i), text: String(i) });
}

const monthOptions = [];
for (i = 1; i < 13; i++) {
  monthOptions.push({
    key: String(i),
    value: String(i),
    text: String(i)
  });
}

const dayOptions = [];
for (i = 1; i < 32; i++) {
  dayOptions.push({
    key: String(i),
    value: String(i),
    text: String(i)
  });
}

const quantityOptions = [];
for (i = 1; i < 5; i++) {
  quantityOptions.push({ key: i, value: i, text: String(i) + "인" });
}

const Payment = ({ match, location, history }) => {
  if (!location.state) {
    history.push("/project/" + match.params.id);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [projectData, setProjectData] = useState(
    location.state ? location.state.projectData : null
  );
  const [style1, setStyle1] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });
  const [style2, setStyle2] = useState({
    backgroundColor: "white",
    border: "solid 1px rgb(223,227,233)"
  });
  const [style3, setStyle3] = useState({ padding: "12px 12px", fontSize: 12 });
  const [style4, setStyle4] = useState({ padding: "12px 12px", fontSize: 12 });
  const [style5, setStyle5] = useState({ padding: "12px 12px", fontSize: 12 });
  const [coupon, setCoupon] = useState(null);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birth, setBirth] = useState("");
  const [quantity, setQuantity] = useState(location.state.quantity);
  const [projectClass, setProjectClass] = useState(location.state.projectClass);
  const [userInfo, setUserInfo] = useState({ name: "", gender: "", birth: "" });
  const [payMethod, setPayMethod] = useState("");
  const [serviceAgreement, setServiceAgreement] = useState(false);
  const [detailAgreement, setDetailAgreement] = useState(false);
  const { error, loading, data } = useQuery(MY_PAGE);

  useEffect(() => {
    //결제 정보 입력 추적 픽셀
    ReactPixel.fbq("track", "AddPaymentInfo");
    //GA 결제 시작 이벤트
    ReactGA.event({ category: "결제", action: "결제 시작" });
  }, []);

  const onClickServiceAgreement = e => {
    e.preventDefault();
    setServiceAgreement(!serviceAgreement);
  };

  const onClickDetailAgreement = e => {
    e.preventDefault();
    setDetailAgreement(!detailAgreement);
  };

  const onSelectCoupon = coupon => {
    setCoupon([coupon]);
  };

  const onClickMethodCard = e => {
    setPayMethod("card");
    setStyle3({
      padding: "12px 12px",
      border: "1.5px solid #eb4c2a",
      fontSize: 12
    });
    setStyle4({ padding: "12px 12px", fontSize: 12 });
    setStyle5({ padding: "12px 12px", fontSize: 12 });
  };

  const onClickMethodPhone = e => {
    setPayMethod("phone");
    setStyle3({ padding: "12px 12px", fontSize: 12 });
    setStyle4({
      padding: "12px 12px",
      border: "1.5px solid #eb4c2a",
      fontSize: 12
    });
    setStyle5({ padding: "12px 12px", fontSize: 12 });
  };

  const onClickMethodToss = e => {
    setPayMethod("toss");
    setStyle3({ padding: "12px 12px", fontSize: 12 });
    setStyle4({ padding: "12px 12px", fontSize: 12 });
    setStyle5({
      padding: "12px 12px",
      border: "1.5px solid #eb4c2a",
      fontSize: 12
    });
  };

  return (
    <div>
      <TitleHeader history={history} type={"결제"} />
      <Grid style={{ margin: 0 }}>
        <Container
          style={{ margin: "50px 0 0 0", paddingLeft: 0, paddingRight: 0 }}
        >
          <div
            style={{ maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}
          >
            <Grid.Row textAlign="left" style={{ marginBottom: 20 }}>
              <Header as="h3" textAlign="left">
                프로젝트 등록
              </Header>
            </Grid.Row>
            {/* <Grid.Row>
            <Query query={MY_PAGE}>
              {({ error, loading, data }) => {
                if (error) return null;
                if (loading) return null;
                if (data.mypage.phoneNumber) return null;
                return (
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={9} textAlign="left">
                        <strong>휴대폰 본인인증 </strong>
                        <p style={{ color: "#eb4c2a", fontSize: 12 }}>
                          본인인증이 필요한 계정입니다.
                        </p>
                      </Grid.Column>
                      <Grid.Column width={7}>
                        <SMSAuthModal location={location} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                );
              }}
            </Query>
          </Grid.Row> */}
            <Image
              style={{
                marginBottom: 20,
                marginTop: 20
              }}
              src={
                "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
                projectData.titleImage
              }
            />
            <Grid.Row>
              <Query query={MY_PAGE}>
                {({ error, loading, data }) => {
                  if (error) return null;
                  if (loading) return null;
                  return (
                    <CouponModal
                      coupon={data.mypage.coupon}
                      onSelectCoupon={onSelectCoupon}
                      price={
                        projectData
                          ? projectData.price * quantity -
                            togetherSale(projectData.price, quantity)
                          : null
                      }
                    />
                  );
                }}
              </Query>
            </Grid.Row>
            <Responsive
              as={Divider}
              className="payment"
              maxWidth={650}
              style={{ marginLeft: -30, marginRight: -21 }}
            />
            <Responsive
              as={Divider}
              className="payment"
              minWidth={650}
              style={{ marginLeft: -5, marginRight: -5 }}
            />
            <Grid.Row style={{ marginTop: 20 }}>
              <Header
                textAlign="left"
                as="h3"
                style={{ fontSize: 16, marginBottom: 20 }}
              >
                결제 금액
              </Header>
              <Grid columns={2}>
                <Grid.Column textAlign="left" className="thin">
                  총 상품 금액
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Header
                    as="h4"
                    style={{ fontWeight: "normal", fontSize: 14 }}
                  >
                    {projectData
                      ? quantity
                        ? numberFormat(
                            (projectData.price + projectData.salePrice) *
                              quantity
                          )
                        : numberFormat(
                            projectData.price + projectData.salePrice
                          )
                      : null}
                    원
                  </Header>
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Grid.Row>
              <Grid columns={2}>
                <Grid.Column textAlign="left" style={{ opacity: 0.5 }}>
                  할인 금액
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Header
                    as="h4"
                    style={{
                      fontWeight: "normal",
                      fontSize: 14,
                      color: "#eb4c2a"
                    }}
                  >
                    -{" "}
                    {projectData
                      ? quantity
                        ? numberFormat(projectData.salePrice * quantity)
                        : numberFormat(projectData.salePrice)
                      : null}
                    원
                  </Header>
                </Grid.Column>
              </Grid>
            </Grid.Row>
            {quantity > 1 ? (
              <Grid.Row>
                <Grid columns={2}>
                  <Grid.Column textAlign="left" style={{ opacity: 0.5 }}>
                    같이 할인
                  </Grid.Column>
                  <Grid.Column textAlign="right">
                    <Header
                      as="h4"
                      style={{
                        fontWeight: "normal",
                        fontSize: 14,
                        color: "#eb4c2a"
                      }}
                    >
                      -{" "}
                      {projectData
                        ? quantity
                          ? numberFormat(
                              togetherSale(projectData.price, quantity)
                            )
                          : numberFormat(
                              togetherSale(projectData.price, quantity)
                            )
                        : null}
                      원
                    </Header>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            ) : null}
            {coupon ? (
              <Grid.Row>
                <Grid columns={2}>
                  <Grid.Column textAlign="left" style={{ opacity: 0.5 }}>
                    쿠폰 할인
                  </Grid.Column>
                  <Grid.Column textAlign="right">
                    <Header
                      as="h4"
                      style={{
                        fontWeight: "normal",
                        fontSize: 14,
                        color: "#eb4c2a"
                      }}
                    >
                      - {coupon[0] ? numberFormat(coupon[0].amount) : null}원
                    </Header>
                  </Grid.Column>
                </Grid>
              </Grid.Row>
            ) : null}

            {/* 
          <Responsive
            as={Divider}
            maxWidth={650}
            style={{ marginLeft: -30, marginRight: -30 }}
          />
          <Responsive
            as={Divider}
            minWidth={650}
            style={{ marginLeft: -5, marginRight: -5 }}
          /> */}
            <Divider
              className="payment"
              style={{ marginLeft: -5, marginRight: -5, opacity: 0.5 }}
            />
            <Grid.Row style={{ marginTop: 20, marginBottom: 20 }}>
              <Grid columns={2}>
                <Grid.Column textAlign="left" width={10}>
                  <Header as="h3" style={{ color: "#eb4c2a", fontSize: 15 }}>
                    최종 가격{""}{" "}
                    <span
                      style={{
                        fontSize: 11,
                        color: "black",
                        opacity: 0.6,
                        marginLeft: 5,
                        fontWeight: 300,
                        color: "#eb4c2a"
                      }}
                    >
                      무이자 할부 가능
                    </span>
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign="right" width={6}>
                  <Header
                    as="h3"
                    style={{ color: "#eb4c2a", fontSize: 16, fontWeight: 800 }}
                  >
                    {projectData
                      ? quantity
                        ? numberFormat(
                            projectData.price * quantity -
                              togetherSale(projectData.price, quantity) -
                              (coupon ? coupon[0].amount : 0)
                          )
                        : numberFormat(
                            projectData.price - (coupon ? coupon[0].amount : 0)
                          )
                      : null}
                    원
                  </Header>
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Responsive
              as={Divider}
              className="payment"
              maxWidth={650}
              style={{ marginLeft: -30, marginRight: -21 }}
            />
            <Responsive
              as={Divider}
              className="payment"
              minWidth={650}
              style={{ marginLeft: -5, marginRight: -5 }}
            />
            <Grid.Row style={{ marginTop: 20, marginBottom: 20 }}>
              <Header
                textAlign="left"
                as="h3"
                style={{ fontSize: 16, marginBottom: 20 }}
              >
                결제 수단
              </Header>
              {/* <Grid columns={3}>
                <Grid.Column style={{ paddingRight: 0 }}>
                  <Button
                    fluid
                    basic
                    onClick={onClickMethodCard}
                    style={style3}
                  >
                    <Icon name="credit card" />
                    카드 결제
                  </Button>
                </Grid.Column>
                <Grid.Column style={{ paddingLeft: 6, paddingRight: 6 }}>
                  <Button
                    fluid
                    basic
                    onClick={onClickMethodPhone}
                    style={style4}
                  >
                    <Icon name="mobile alternate" />
                    핸드폰 결제
                  </Button>
                </Grid.Column>
                <Grid.Column style={{ paddingLeft: 0 }}>
                  <Button
                    fluid
                    basic
                    onClick={onClickMethodToss}
                    style={style5}
                  >
                    <Image
                      src={require("../../img/tossicon.png")}
                      value="toss"
                      style={{
                        width: 60,
                        marginLeft: "auto",
                        marginRight: "auto"
                      }}
                    />
                  </Button>
                </Grid.Column>
              </Grid> */}
              <Grid columns={2}>
                <Grid.Column style={{ paddingRight: 6 }}>
                  <Button
                    fluid
                    basic
                    onClick={onClickMethodCard}
                    style={style3}
                  >
                    <Icon name="credit card" />
                    카드 결제
                  </Button>
                </Grid.Column>
                <Grid.Column style={{ paddingLeft: 6 }}>
                  <Button
                    fluid
                    basic
                    onClick={onClickMethodPhone}
                    style={style4}
                  >
                    <Icon name="mobile alternate" />
                    핸드폰 결제
                  </Button>
                </Grid.Column>
              </Grid>
            </Grid.Row>
            <Grid.Column>
              <Grid.Row
                style={{ marginBottom: 8, marginTop: 40, fontSize: 13 }}
              >
                <label onClick={onClickServiceAgreement}>
                  <Checkbox
                    checked={serviceAgreement}
                    className="payment"
                    style={{ paddingRight: 26, paddingTop: 3 }}
                  ></Checkbox>
                  <AgreementModal />에 동의합니다.(필수)
                </label>
              </Grid.Row>
              <Grid.Row>
                <Checkbox
                  checked={detailAgreement}
                  className="payment"
                  onClick={onClickDetailAgreement}
                  style={{ fontSize: 13 }}
                  label="위 주문의 상품, 가격, 할인정보에 동의합니다. (필수)"
                />
              </Grid.Row>
            </Grid.Column>

            <Query query={MY_PAGE}>
              {({ error, loading, data }) => {
                if (error) return null;
                if (loading) return null;
                return (
                  <PurchaseButton
                    project={projectData}
                    hasPhoneNumber={data.mypage.phoneNumber}
                    history={history}
                    method={payMethod}
                    serviceAgreement={serviceAgreement}
                    detailAgreement={detailAgreement}
                    name={name}
                    birth={birth}
                    gender={gender}
                    phone={phone}
                    quantity={quantity}
                    projectClass={projectClass}
                    coupon={coupon}
                    id={data ? data.mypage.id : null}
                  />
                );
              }}
            </Query>
          </div>
        </Container>
      </Grid>
    </div>
  );
};

export default Payment;
