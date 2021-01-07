import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Menu,
  Button,
  Form,
  Rating,
  Header,
  Message
} from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const CREATE_REVIEW = gql`
  mutation CreateReview($id: ID, $content: String, $rate: Int) {
    createReview(id: $id, content: $content, rate: $rate) {
      message
    }
  }
`;

const ReviewCreate = ({ match, history }) => {
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [createReview, { error, loading, data }] = useMutation(CREATE_REVIEW);

  const handleRate = (e, { rating, maxRating }) => {
    setRating(rating);
  };

  const onChangeReviewContent = e => {
    setReviewContent(e.target.value);
  };

  const onClickGoBack = () => {
    history.goBack();
  };

  const onClickCreateReview = () => {
    if (reviewContent.length < 10) {
      alert("10자 이상 작성해주셔야 합니다.");
    } else {
      createReview({
        variables: { id: match.params.id, content: reviewContent, rate: rating }
      });
    }
  };

  useEffect(() => {
    if (data) {
      if (data.createReview.message) {
        alert(data.createReview.message);
        history.goBack();
      }
    }
  }, [data]);

  return (
    <div>
      <Menu
        borderless
        style={{ height: 64, border: "none", boxShadow: "none" }}
      >
        <Menu.Menu position="left">
          <Menu.Item onClick={onClickGoBack} style={{ paddingLeft: 25 }}>
            <i class="ri-arrow-go-back-line ri-xl"></i>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Container>
        <Grid centered style={{ margin: 0 }}>
          <Grid.Row style={{ paddingBottom: 8 }}>
            <Header style={{ fontSize: 26, lineHeight: 1.2 }}>
              당신의 도전은
              <br />
              어떠셨나요?
            </Header>
          </Grid.Row>
          <Grid.Row style={{ fontSize: 12, lineHeight: 1.3, paddingTop: 8 }}>
            마인트와 함께했던 당신을 응원합니다.
            <br />
            서비스 개선을 위해 솔직한 후기를 남겨주세요.
          </Grid.Row>
          <Grid.Row style={{ paddingTop: 6 }}>
            <Message style={{ width: "100%" }}>
              <Message.Header style={{ paddingBottom: 22, fontSize: 14 }}>
                수강 평점
              </Message.Header>
              <Rating
                icon="heart"
                defaultRating={5}
                maxRating={5}
                size="massive"
                onRate={handleRate}
              />
              <Message.Content style={{ paddingTop: 5 }}>
                {rating}
              </Message.Content>
            </Message>
          </Grid.Row>
          <Grid.Row
            style={{
              paddingBottom: 3,
              paddingTop: 10,
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "left",
              justifyContent: "left"
            }}
          >
            리뷰 작성
          </Grid.Row>
          <Grid.Row>
            <Form style={{ width: "100%" }}>
              <Form.TextArea
                onChange={onChangeReviewContent}
                style={{ minHeight: 165 }}
              ></Form.TextArea>
            </Form>
          </Grid.Row>
          <Grid.Row style={{ paddingTop: 0 }}>
            <Button
              onClick={onClickCreateReview}
              fluid
              color="red"
              style={{ fontSize: 15, marginRight: 0 }}
            >
              리뷰 작성하기
            </Button>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default ReviewCreate;
