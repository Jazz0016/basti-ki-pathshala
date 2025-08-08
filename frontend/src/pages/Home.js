import "./Home.css";
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <header className="home-header">
        <img src={logo} alt="Logo" className="logo" />
         <button
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>

      <div className="background-section">
        <div className="content-box">
          <h1>Basti Ki Pathshala</h1>
          <p>
            At Basti Ki Pathshala Foundation, collaboration is at the heart of
            everything we do. Under the banner of 'We Work Together,’ we embrace
            the power of unity, recognizing that real change comes from
            collective action. Our dedicated team, passionate volunteers,
            generous donors, and supportive community members all play integral
            roles in our mission to break the barriers of education in
            underserved communities.
          </p>
        </div>
      </div>
    </div>
  );
}
