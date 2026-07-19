import './Projects.css';

function Projects() {
  return (
    <div className="projects-page section-container">
      <h1 className="section-title projects-title">Projects</h1>
      <div className="projects-grid">
        <div className="project-card">
          <h3>E-commerce Dashboard</h3>
          <p>A responsive admin dashboard built with React and Recharts for data visualization.</p>
          <a href="#" className="view-project-link">View Project</a>
        </div>
        <div className="project-card">
          <h3>Weather App</h3>
          <p>A dynamic weather application using a public API to fetch real-time forecasts.</p>
          <a href="#" className="view-project-link">View Project</a>
        </div>
        <div className="project-card">
          <h3>Task Management System</h3>
          <p>A Kanban-style task management app with drag-and-drop functionality.</p>
          <a href="#" className="view-project-link">View Project</a>
        </div>
      </div>
    </div>
  );
}

export default Projects;
