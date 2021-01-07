import React from "react";
import { Grid, Responsive } from "semantic-ui-react";

const LoginBannerText = () => {
  return (
    <div>
      <Responsive as={Grid.Row} minWidth={1345} style={{ marginTop: 550 }}>
        <p
          style={{
            color: "white",
            fontSize: 35,
            fontWeight: 800,
            marginBottom: 5
          }}
        >
          목표달성 자기계발 프로젝트
        </p>
        <p>
          <span style={{ color: "white", fontSize: 35, fontWeight: "bold" }}>
            함께 도전하는
          </span>{" "}
          <span style={{ color: "#eb4c2a", fontSize: 35, fontWeight: "bold" }}>
            마인트
          </span>
        </p>

        <p style={{ color: "white", fontSize: 18 }}>
          내 꿈을 함께 이루기 위한 확실한 기회
        </p>
      </Responsive>
      <Responsive as={Grid.Row} maxWidth={1345} style={{ marginTop: 550 }}>
        <p
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 5
          }}
        >
          목표달성 자기계발 프로젝트
        </p>
        <p>
          <span style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
            함께 도전하는
          </span>{" "}
          <span style={{ color: "#eb4c2a", fontSize: 30, fontWeight: "bold" }}>
            마인트
          </span>
        </p>

        <p style={{ color: "white", fontSize: 15 }}>
          내 꿈을 함께 이루기 위한 확실한 기회
        </p>
      </Responsive>
    </div>
  );
};

export default LoginBannerText;
