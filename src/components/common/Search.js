import React, { useEffect } from "react";
import queryString from "query-string";
import { Grid, Container, Header, Responsive, Card } from "semantic-ui-react";

import BottomFixedMenu from "./BottomFixedMenu";
import SearchBar from "./SearchBar";
import ProjectCard from "../projects/ProjectCard";
import ProjectCardGroup from "../projects/ProjectCardGroup";
import { useLazyQuery } from "@apollo/react-hooks";
import { Query } from "react-apollo";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import gql from "graphql-tag";

const PROJECT_QUERY = gql`
  query SearchProject($title_Icontains: String) {
    allProjects(title_Icontains: $title_Icontains) {
      edges {
        node {
          id
          status
          category {
            id
            category
          }
          title
          titleImageUrl
          titleImage
          earlybirdDue
          projectShortintro
          projectTerm
          minCapacity
          coach {
            name
          }
        }
      }
    }
  }
`;

const HOT_PROJECT_QUERY = gql`
  query {
    allProjects(isHot: true) {
      edges {
        node {
          id
          status
          title
          titleImageUrl
          titleImage
          category {
            id
            category
          }
          projectShortintro
          projectTerm
          minCapacity
          coach {
            name
          }
        }
      }
    }
  }
`;

const Search = ({ location, history }) => {
  const query = queryString.parse(location.search);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SearchBar history={history} />
      <Grid style={{ margin: 0, marginTop: 40 }}>
        {query.search ? (
          <Grid.Row>
            <Container className="search" style={{ width: "100%" }}>
              <Header>"{query.search}"에 대한 검색 결과</Header>
              <Query
                query={PROJECT_QUERY}
                variables={{ title_Icontains: query.search }}
              >
                {({ error, loading, data }) => {
                  if (loading)
                    return (
                      <Container style={{ height: 300 }}>
                        <Loader
                          className="search-loader"
                          style={{
                            textAlign: "center",
                            alignItems: "center"
                          }}
                          type="Oval"
                          color="#EB4C2A"
                          height={35}
                          width={35}
                        />
                      </Container>
                    );
                  if (error) return null;
                  return (
                    <ProjectCardGroup
                      projectList={data.allProjects.edges}
                      history={history}
                    />
                  );
                }}
              </Query>
            </Container>
          </Grid.Row>
        ) : (
          <Grid.Row>
            <Container>
              <Header>마감 임박 프로젝트</Header>
              <Query query={HOT_PROJECT_QUERY}>
                {({ error, loading, data }) => {
                  if (loading)
                    return (
                      <Container style={{ height: 300 }}>
                        <Loader
                          className="search-loader"
                          style={{
                            textAlign: "center",
                            alignItems: "center",
                            marginTop: 100
                          }}
                          type="Oval"
                          color="#EB4C2A"
                          height={35}
                          width={35}
                        />
                      </Container>
                    );
                  if (error) return null;
                  return (
                    <ProjectCardGroup
                      projectList={data.allProjects.edges}
                      history={history}
                    />
                  );
                }}
              </Query>
            </Container>
          </Grid.Row>
        )}
      </Grid>
      <BottomFixedMenu history={history} option="검색" />
    </div>
  );
};

export default Search;
