import React from "react";
import { Card, Image, Label } from "semantic-ui-react";

const ProjectCard = props => {
  const onClickProjectLink = link => {
    props.history.push(link);
  };

  return (
    <Card
      className="mobile"
      onClick={() => onClickProjectLink("/project/" + props.project.id)}
      style={{ display: "inline", borderRadius: 0 }}
    >
      <Image
        src={
          "https://s3.ap-northeast-2.amazonaws.com/test.maint/media/" +
          props.project.titleImage
        }
        wrapped
        ui={false}
        style={{ borderRadius: 0 }}
      />
      <Card.Content style={{ padding: 0 }}>
        <Card.Meta
          style={{
            paddingTop: 3.5,
            paddingBottom: 3.5,
            fontSize: 10,
            opacity: 0.7
          }}
        >
          <span
            style={{
              color: "#eb4c2a",
              fontWeight: "bold"
            }}
          >
            {props.project.category.category}
          </span>
          <span style={{ fontWeight: "bold" }}>
            {props.project.projectTerm}주플랜
          </span>
        </Card.Meta>

        <Card.Header style={{ fontSize: 14 }}>
          {props.project.title}
        </Card.Header>
      </Card.Content>
    </Card>
  );
};

export default ProjectCard;
