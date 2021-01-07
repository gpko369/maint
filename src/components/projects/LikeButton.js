import React, { useState, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

import ALL_PROJECT_QUERY from "../common/Main";
import MY_PAGE from "../common/MyProjects";
import LIKE_PROJECTS from "../accounts/MyProject";

const LIKE_QUERY = gql`
  query {
    likeProjects {
      id
      like
    }
  }
`;

const CREATE_LIKE = gql`
  mutation CreateLike($id: ID!) {
    createLike(id: $id) {
      isLike
      project {
        id
        title
        like
      }
    }
  }
`;

const Temp = props => {
  const [createLike, { data }] = useMutation(CREATE_LIKE);
  const [isLike, setIsLike] = useState(props.like);

  const onClickLike = () => {
    createLike({
      variables: { id: props.project },
      refetchQueries: [{ query: LIKE_QUERY }]
    });
    props.onChangeLike(!props.like);
  };

  return (
    <Button fluid onClick={onClickLike}>
      {props.like ? (
        <i
          class="ri-heart-fill ri-lg"
          style={{
            color: "#eb4c2a",
            verticalAlign: "middle",
            marginRight: 10,
            lineHeight: "14px",
            paddingTop: 5
          }}
        ></i>
      ) : (
        <i
          class="ri-heart-line ri-lg"
          style={{
            color: "#eb4c2a",
            verticalAlign: "middle",
            marginRight: 10,
            lineHeight: "14px",
            paddingTop: 5
          }}
        ></i>
      )}
      좋아요
    </Button>
  );
};

const LikeButton = props => {
  const { data, error } = useQuery(LIKE_QUERY);

  const onClickLogin = () => {
    props.history.push("/login");
  };

  if (data) {
    return (
      <Temp
        onChangeLike={props.onChangeLike}
        like={props.like}
        project={props.project}
      />
    );
  } else {
    return (
      <Button onClick={onClickLogin} fluid>
        <i
          class="ri-heart-line ri-lg"
          style={{
            color: "#eb4c2a",
            verticalAlign: "middle",
            marginRight: 10,
            lineHeight: "14px",
            marginBottom: -10
          }}
        ></i>
        좋아요
      </Button>
    );
  }
};

export default LikeButton;
