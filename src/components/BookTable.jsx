import { useState } from "react";
import "./BookTable.css";

export default function BookTable() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    persons: "",
    date: "",
  });

  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =====================
  // VALIDATION
  // =====================
  const validate = () => {
    if (form.name.trim().length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Enter valid 10 digit mobile number");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Enter valid email");
      return false;
    }

    if (!form.persons) {
      alert("Please select number of persons");
      return false;
    }

    if (!form.date) {
      alert("Please select date and time");
      return false;
    }

    const selectedDate = new Date(form.date);
    const hours = selectedDate.getHours();

    if (hours < 10 || hours > 24) {
      alert("Booking time must be between 10 AM and 12 PM");
      return false;
    }

    return true;
  };

  // =====================
  // SEND OTP
  // =====================
  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      alert(data.message);
    } catch {
      alert("Backend not reachable");
    }
  };

  // =====================
  // VERIFY OTP
  // =====================
  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsEmailVerified(true);
        alert("Email verified successfully");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Backend not reachable");
    }
  };

  // =====================
  // CHECK AVAILABILITY
  // =====================
  const checkAvailability = async (date) => {
    if (!date) return;

    try {
      const res = await fetch(
        `http://localhost:5000/check-availability?date=${date}`
      );
      const data = await res.json();
      setAvailabilityMsg(data.message);
    } catch {
      setAvailabilityMsg("");
    }
  };

  // =====================
  // BOOK TABLE
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (!isEmailVerified) {
      alert("Please verify email before booking");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/book-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message === "Table booked successfully") {
        alert("Table booked successfully ✅");
        checkAvailability(form.date); 
      } else {
        alert(data.message);
      }
    } catch {
      alert("Backend not reachable");
    }
  };

  // =====================
  // CANCEL BOOKING
  // =====================
  const handleCancelBooking = async () => {
    if (!form.email || !form.date) {
      alert("Please enter email and date to cancel booking");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/cancel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          date: form.date,
        }),
      });

      const data = await res.json();
      alert(data.message);
      checkAvailability(form.date); // refresh availability
    } catch {
      alert("Backend not reachable");
    }
  };

  return (
    <section className="book-table-section" id="book-table">
      <h2 className="book-title">Book A Table</h2>

      <div className="book-wrapper">
        <form className="book-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
          />

          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="button" onClick={verifyOtp}>
            Verify OTP
          </button>

          <select
            name="persons"
            value={form.persons}
            onChange={handleChange}
          >
            <option value="">How many persons?</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>

          <input
            type="datetime-local"
            name="date"
            min={new Date().toISOString().slice(0, 16)}
            value={form.date}
            onChange={(e) => {
              handleChange(e);
              checkAvailability(e.target.value);
            }}
          />

          {availabilityMsg && (
            <p className="availability-msg">{availabilityMsg}</p>
          )}

          <div className="action-buttons">
            <button className="book-btn" type="submit">
              BOOK NOW
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </button>
          </div>
        </form>

        <div className="map-box">
         <iframe
  src="https://www.google.com/maps?q=Swargate%20Bus%20Stand%20Pune&output=embed"
  width="100%"
  height="250"
  style={{ border: 0, borderRadius: "12px" }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
        </div>
      </div>
    </section>
  );
}
