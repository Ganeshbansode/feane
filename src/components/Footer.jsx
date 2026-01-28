import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="inquiry-footer">
      <div className="footer-container">

        {/* Contact Us */}
        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>➤ Location</p>
          <p>☎ Call +01 1234567890</p>
          <p>✉ feane478@gmail.com</p>
        </div>

        {/* Center Brand */}
        <div className="footer-column center">
          <h2 className="brand">Feane</h2>
          <p>
            Necessary, making this the first true generator on the Internet.
            It uses a dictionary of over 200 Latin words, combined with
          </p>

         <div className="social-icons">
  <span className="icon-box">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="facebook" />
  </span>

  <span className="icon-box">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="twitter" />
  </span>

  <span className="icon-box">
    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="linkedin" />
  </span>

  <span className="icon-box">
    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="instagram" />
  </span>

  <span className="icon-box">
    <img src="https://cdn-icons-png.flaticon.com/512/733/733646.png" alt="pinterest" />
  </span>
</div>

        </div>

        {/* Opening Hours */}
        <div className="footer-column">
          <h3>Opening Hours</h3>
          <p>Everyday</p>
          <p>10.00 Am -10.00 Pm</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 All Rights Reserved By Free Html Templates  
        <br />
        © Distributed By ThemeWagon
      </div>
    </footer>
  );
}
