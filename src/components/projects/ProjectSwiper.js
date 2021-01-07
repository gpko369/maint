import React, { useEffect, useState } from "react";
import { Card, Container, Grid, Header, Image } from "semantic-ui-react";
import ProjectCard from "./ProjectCard";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";

const ProjectSwiper = ({ projectList, history, swiperParams }) => {
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    if (projectList && projectList[0]) {
      if (projectList[0].node) {
        setProjects(projectList.filter(project => project.node.status !== "0"));
      } else {
        setProjects(projectList.filter(project => project.status !== "0"));
      }
    }
  }, [projectList]);
  if (projects) {
    if (projects.length > 2) {
      return (
        <Swiper {...swiperParams}>
          {projects.map((project, i) => {
            return (
              <div key={i}>
                <ProjectCard
                  history={history}
                  style={{ marginRight: 12 }}
                  project={project.node ? project.node : project}
                />
              </div>
            );
          })}
        </Swiper>
      );
    } else if (projects.length <= 2 && projects.length >= 1) {
      return (
        <div style={{ paddingLeft: 25, paddingRight: 25 }}>
          <Card.Group className="card-list" itemsPerRow={2}>
            {projects.map((project, i) => {
              return (
                <ProjectCard
                  history={history}
                  key={i}
                  project={project.node ? project.node : project}
                />
              );
            })}
          </Card.Group>
        </div>
      );
    } else {
      return (
        <Container>
          <div style={{ paddingLeft: 25, paddingRight: 25 }}>
            해당하는 프로젝트가 아직 없습니다.
            <Image
              style={{ marginTop: 16 }}
              src={require("../../img/noprojectenrolled.png")}
            />
          </div>
        </Container>
      );
    }
  } else
    return (
      <Container>
        <div style={{ paddingLeft: 25, paddingRight: 25 }}>
          해당하는 프로젝트가 아직 없습니다.
          <Image
            style={{ marginTop: 16 }}
            src={require("../../img/noprojectenrolled.png")}
          />
        </div>
      </Container>
    );
};

export default ProjectSwiper;
