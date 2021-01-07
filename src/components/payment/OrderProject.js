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
  Label,
  Responsive,
  GridColumn,
  Checkbox,
  Dropdown,
  Radio
} from "semantic-ui-react";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import numberFormat from "../utility/numberFormat";
import OrderButton from "./OrderButton";
import TestHeader from "../common/TestHeader";
import TitleHeader from "../common/TitleHeader";

import ReactPixel from "react-facebook-pixel";
import ReactGA from "react-ga";
import Test from "../common/Test";

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

const PROJECT_INFO = gql`
  query projectInfo($id: ID!) {
    project(id: $id) {
      id
      title
      coach {
        name
      }
      price
      salePrice
      classes {
        id
        name
        startDate
      }
      place
      projectintro {
        id
        projectSpecial
        projectProcess
        projectTolearn
      }
      projectTime
      projectTerm
      maxCapacity
      difficulty
      projectGoal
      titleImageUrl
      titleImage
      curriculum {
        id
        week
        content
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

function toDate(date) {
  var t = new Date(date); // Epoch
  t = t.getMonth() + 1 + "/" + t.getDate();
  return t;
}

const quantityOptions = [];
for (var i = 1; i < 5; i++) {
  quantityOptions.push({ key: i, value: i, text: String(i) + "인" });
}

const OrderProject = ({ match, location, history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [projectData, setProjectData] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [projectClass, setProjectClass] = useState(-1);
  const { error, loading, data } = useQuery(PROJECT_INFO, {
    variables: { id: match.params.id }
  });

  const onChangeClass = (e, { value }) => {
    setProjectClass(value);
  };

  const onChangeQuantity = (e, { value }) => {
    setQuantity(value);
  };

  useEffect(() => {
    if (data) {
      setProjectData(data.project);
    }
  }, [data]);

  return (
    <div>
      <TitleHeader history={history} type={"주문"} />
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
                (projectData ? projectData.titleImage : null)
              }
            />
            <Grid.Row>
              <Grid columns={2}>
                <Grid.Column
                  textAlign="left"
                  verticalAlign="middle"
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10
                  }}
                >
                  수량
                </Grid.Column>
                <Responsive
                  as={Grid.Column}
                  minWidth={1080}
                  textAlign="right"
                  style={{ paddingBottom: 5, paddingTop: 5 }}
                >
                  <Dropdown
                    placeholder="인원"
                    fluid
                    selection
                    defaultValue={1}
                    options={quantityOptions}
                    onChange={onChangeQuantity}
                  />
                </Responsive>
              </Grid>
            </Grid.Row>
            <Responsive as={Grid.Row} maxWidth={1080} style={{ marginTop: 15 }}>
              <Grid.Row>
                <Dropdown
                  placeholder="인원"
                  fluid
                  selection
                  options={quantityOptions}
                  onChange={onChangeQuantity}
                  defaultValue={1}
                />
              </Grid.Row>
            </Responsive>
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
            <Grid.Row>수강반</Grid.Row>

            <Grid.Row style={{ paddingTop: 10 }}>
              {projectData
                ? projectData.classes.map((classes, i) => {
                    return (
                      <Grid.Row style={{ paddingTop: 4, paddingBottom: 4 }}>
                        <Label
                          onClick={onChangeClass}
                          value={classes.id}
                          basic
                          size="large"
                          style={{ width: "100%" }}
                        >
                          <Grid style={{ margin: 0 }} columns={2}>
                            <Grid.Column width={12} style={{ padding: 0 }}>
                              <Radio
                                label={classes.name}
                                value={classes.id}
                                checked={projectClass === classes.id}
                                onChange={onChangeClass}
                                style={{
                                  paddingTop: 4,
                                  paddingBottom: 4,
                                  fontWeight: "normal"
                                }}
                              />
                            </Grid.Column>
                            <Grid.Column
                              width={4}
                              textAlign="right"
                              style={{
                                padding: 0,
                                fontWeight: "normal",
                                paddingRight: 4
                              }}
                            >
                              <div style={{ paddingTop: 6, paddingBottom: 5 }}>
                                {toDate(classes.startDate) + " 시작"}
                              </div>
                            </Grid.Column>
                          </Grid>
                        </Label>
                      </Grid.Row>
                    );
                  })
                : null}
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
                  상품 금액
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
                    총 상품 금액{""}{" "}
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
                              togetherSale(projectData.price, quantity)
                          )
                        : numberFormat(projectData.price)
                      : null}
                    원
                  </Header>
                </Grid.Column>
              </Grid>
            </Grid.Row>

            <Query query={MY_PAGE}>
              {({ error, loading, data }) => {
                if (error) return null;
                if (loading) return null;
                return (
                  <OrderButton
                    quantity={quantity}
                    project={projectData}
                    history={history}
                    projectClass={projectClass}
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

export default OrderProject;
