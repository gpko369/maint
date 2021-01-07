import React, { useState, useEffect } from "react";
import { Responsive, Card } from "semantic-ui-react";
import ProjectCard from "./ProjectCard";

const ProjectCardGroup = ({ projectList, history }) => {
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
    return (
      <div>
        <Card.Group className="card-list" maxWidth={1080} itemsPerRow={2}>
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
    return null;
  }
};

export default ProjectCardGroup;
