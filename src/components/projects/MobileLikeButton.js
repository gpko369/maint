import React, { useState, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

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
    <Button
      circular
      onClick={onClickLike}
      icon={props.like ? "red heart" : "heart outline"}
      style={{ height: 43, width: 43 }}
    />
  );
};

const MobileLikeButton = props => {
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
      <Button
        circular
        onClick={onClickLogin}
        icon="heart outline"
        style={{ height: 43, width: 43 }}
      />
    );
  }
};

export default MobileLikeButton;
