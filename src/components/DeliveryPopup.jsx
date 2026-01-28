import { useState } from "react";
import "./DeliveryPopup.css";

export default function DeliveryPopup({ onClose }) {
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");

  const [available, setAvailable] = useState(false);

  const handleStartOrdering = () => {
  onClose(); // popup close
  setTimeout(() => {
    document.getElementById("menu")?.scrollIntoView({
      behavior: "smooth",
    });
  }, 200);
};

const punePincodes = [
  "411001", // Camp 
  "411002", // Budhwar Peth
  "411030", // Sadashiv Peth
  "411009", // Parvati
  "411037", // Bibwewadi
  "411042", // Swargate
];

 const checkPincode = () => {
  if (pincode.length !== 6) {
    setMessage("❌ Please enter valid 6 digit pincode");
    setAvailable(false);
    return;
  }

  if (punePincodes.includes(pincode)) {
    setMessage("✅ Delivery available in your area");
    setAvailable(true);
  } else {
    setMessage("❌ We are not providing service to this area");
    setAvailable(false);
  }
};

  return (
     
    <div className="popup-overlay">
      <div className="popup-box">
        {/* HEADER */}
        <div className="popup-header">
          <h2>FEANE</h2>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
      
 

        {/* CONTENT */}

        <p className="popup-text">
         <b> We Deliver Orders In Pune Only.</b>
        </p>
        <p className="popup-text">
         <b> Please Enter Your Pincode To Check Delivery Availability.</b>
        </p>

        <div className="popup-input-row">
          <input
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <button onClick={checkPincode}>CHECK</button>
        </div>

 {/* {available && ( */}
           <button className="start-btn" onClick={handleStartOrdering}>
            START ORDERING
           </button>
{/* )} */}

       {message && (
  <div className={`popup-message ${available ? "success" : "error"}`}>
    {message}
  </div>
)}
      </div>
    </div>
  );
}
