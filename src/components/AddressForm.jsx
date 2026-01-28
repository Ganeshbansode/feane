import { useState } from "react";

export default function AddressForm() {
  const [address, setAddress] = useState(
    localStorage.getItem("verifiedAddress") || ""
  );

  const handleSave = () => {
    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    localStorage.setItem("verifiedAddress", address);
    alert("Address saved successfully");
  };

  return (
    <div className="address-form">
      <h3>Delivery Address</h3>

      <textarea
        rows="4"
        placeholder="Enter your delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleSave}>Save Address</button>
    </div>
  );
}
