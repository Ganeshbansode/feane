import "./About.css";
import aboutImg from "../assets/about-img.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function About() {
  const navigate = useNavigate();
  return (
    <section className="about-banner" id="about">
      <div className="about-wrapper">
        
        {/* LEFT – BANNER IMAGE */}
        <div className="about-image">
          <img src={aboutImg} alt="About Feane" />
        </div>

        {/* RIGHT – CONTENT */}
        <div className="about-content">
          <h2>We Are Feane</h2>

          <p>
            There are many variations of passages of Lorem Ipsum available,
            but the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly believable.
          </p>
<Link to="/reviews">
          <button className="about-btn"
          onClick={() => navigate("/reviews")}>Customer Reviews </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
