import React, { Fragment } from "react";
import { Header, Icon, Image, Menu, Segment, Sidebar } from "semantic-ui-react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const FIND_USER = gql`
  query {
    mypage {
      id
      name
    }
  }
`;

const Test = () => {
  return null;
};
export default Test;
