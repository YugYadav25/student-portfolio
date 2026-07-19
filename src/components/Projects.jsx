import './Projects.css';

function Projects() {
  return (
    <div className="projects-page section-container">
      <h1 className="section-title">My Projects</h1>
      <div className="projects-grid">
        <div className="project-card">
          <h3>E-Commerce Platform</h3>
          <p>A full-stack e-commerce application built with React and Node.js.</p>
        </div>
        <div className="project-card">
          <h3>Portfolio Website</h3>
          <p>A responsive portfolio website to showcase my skills and projects.</p>
        </div>
        <div className="project-card">
          <h3>Task Manager</h3>
          <p>A productivity app for managing daily tasks and projects.</p>
        </div>
      </div>
    </div>
  );
}

export default Projects;
