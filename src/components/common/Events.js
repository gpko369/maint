import React, { Component } from "react";
import parse from "html-react-parser";
import { Container } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import MainHeader from "./MainHeader";
import FixHeader from "./FixHeader";
import BottomFixedMenu from "./BottomFixedMenu";

const EVENT_QUERY = gql`
  query EventQuery($urlId: String!) {
    event(urlId: $urlId) {
      id
      title
      content
    }
  }
`;

const Events = ({ match, history }) => {
  const { error, loading, data } = useQuery(EVENT_QUERY, {
    variables: { urlId: match.params.id }
  });

  if (error) return null;
  if (loading) return null;
  if (data && data.event)
    return (
      <>
        <FixHeader />
        {/* <MainHeader history={history} /> */}
        <Container className="event-page">
          {parse(data.event.content)}
        </Container>
        <BottomFixedMenu history={history} />
      </>
    );
};

export default Events;
