import Header from './Header';
import About from './About';
import Skills from './Skills';
import Footer from './Footer';

function Home({ name, title, skills, email, socialLinks }) {
  return (
    <div className="home-page">
      <Header name={name} title={title} />
      <About />
      <Skills skills={skills} />
      <Footer email={email} socialLinks={socialLinks} />
    </div>
  );
}

export default Home;
