import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Grid, Card, Container } from "semantic-ui-react";
import ProjectCard from "./ProjectCard";

const PROJECT_QUERY = gql`
  query {
    allProjects {
      edges {
        node {
          id
          status
          title
          titleImageUrl
          titleImage
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

//프로젝트 전체 노출용 컴포넌트(검색용)
const Projects = () => {
  return (
    <Grid style={{ margin: 0 }} textAlign="center" verticalAlign="middle">
      <Grid.Row>
        <Container style={{ margin: 100 }}>
          <Card.Group itemsPerRow={4}>
            <Query query={PROJECT_QUERY}>
              {({ error, loading, data }) => {
                if (loading) return null;
                if (error) return null;
                return data.allProjects.edges.map((project, i) => {
                  return <ProjectCard key={i} project={project.node} />;
                });
              }}
            </Query>
          </Card.Group>
        </Container>
      </Grid.Row>
    </Grid>
  );
};

export default Projects;
