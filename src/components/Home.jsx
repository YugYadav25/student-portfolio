import Header from './Header';
import About from './About';
import Skills from './Skills';

function Home({ name, title, skills, email, socialLinks }) {
  return (
    <div className="home-page">
      <Header name={name} title={title} email={email} socialLinks={socialLinks} />
      <About />
      <Skills skills={skills} />
    </div>
  );
}

export default Home;
