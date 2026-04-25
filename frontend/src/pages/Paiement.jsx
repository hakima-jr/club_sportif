import { useState } from "react";
import API from "../api/api";
import styles from "../styles/paiement.module.css";

function Paiement() {
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    cardHolder: "",
    country: "Morocco"
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateNow = new Date().toISOString().slice(0, 10);
    API.post("/paiements", {
      montant: 150,
      date_paiement: dateNow,
      mode_paiement: "Carte",
      statut: "Payé",
      id_abonnement: 2
    })
      .then(() => {
        setStatus("success");
        setFormData({ email: "", cardNumber: "", cardExpiry: "", cardCVC: "", cardHolder: "", country: "Morocco" });
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  };

  // --- STYLE FIXES (Hadu homa li khassna n-appliquiw) ---
  const labelStyle = { 
    display: "block", 
    color: "#333333", // Lawn k7al
    marginBottom: "5px", 
    fontWeight: "bold", 
    textAlign: "left"
  };

  const inputStyle = { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "8px", 
    border: "1px solid #ddd", 
    color: "#000000", 
    backgroundColor: "#ffffff" 
  };

  return (
    <div className={styles.stripeBody}>
      <div className={styles.paymentWrapper}>
        <div className={styles.paymentCard}>
          
          {status === "success" ? (
            <div className={styles.statusContainer}>
              <div style={{ fontSize: "50px", color: "#2ecc71" }}>✓</div>
              <h2>Paiement réussi !</h2>
              <button onClick={() => setStatus("idle")} className={styles.payBtn}>Retour</button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#333" }}>Subscribe</h2>
                <p style={{ color: "#141010" }}><strong>MAD 150.00</strong> per month</p>
              </div>

              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={inputStyle} 
                    placeholder="email@example.com" 
                    required 
                  />
                </div>

                <div>
                  <label style={labelStyle}>Card Information</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    value={formData.cardNumber} 
                    onChange={handleChange} 
                    style={inputStyle} 
                    placeholder="1234 5678 9012 3456" 
                    required 
                  />
                  <div className={styles.rowPayment} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <input type="text" id="cardExpiry" value={formData.cardExpiry} onChange={handleChange} style={inputStyle} placeholder="MM / YY" required />
                    <input type="text" id="cardCVC" value={formData.cardCVC} onChange={handleChange} style={inputStyle} placeholder="CVC" required />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Cardholder Name</label>
                  <input 
                    type="text" 
                    id="cardHolder" 
                    value={formData.cardHolder} 
                    onChange={handleChange} 
                    style={inputStyle} 
                    placeholder="Nom complet" 
                    required 
                  />
                </div>

                <button type="submit" className={styles.payBtn}>Pay Now</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Paiement;