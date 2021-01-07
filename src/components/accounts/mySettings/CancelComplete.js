import React, { Component } from "react";
import { Grid, Container, Button } from "semantic-ui-react";
import TitleHeader from "../../common/TitleHeader";

const CancelComplete = ({ history }) => {
  const onClickHome = () => {
    history.push("/");
  };
  return (
    <div>
      <TitleHeader history={history} type={"결제취소완료"} />
      <Container>
        <Grid style={{ margin: 0 }}>
          <Grid.Row
            style={{ padding: "240px 0 0 0", fontSize: 20, fontWeight: 800 }}
          >
            환불신청 완료
          </Grid.Row>
          <Grid.Row style={{ padding: "5px 0 234px 0", fontSize: 14 }}>
            영업일 기준 7일 이내에 환불이 완료됩니다. 마인트 서비스를
            이용해주셔서 감사합니다.
          </Grid.Row>
          <Button onClick={onClickHome} fluid color="red" style={{ margin: 0 }}>
            홈으로 이동
          </Button>
        </Grid>
      </Container>
    </div>
  );
};

export default CancelComplete;
