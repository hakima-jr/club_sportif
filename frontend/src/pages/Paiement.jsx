import { useState } from "react";
import API from "../api/api";
import "../styles/interface_paiement.css";

function Paiement() {
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    cardHolder: "",
    country: "Morocco"
  });

  // زدنا هاد الحالة باش نعرفو واش دفع داز أولا لا
  const [status, setStatus] = useState("idle"); // idle, success, error

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
      .then((res) => {
        // عوض alert، غادين نطلعو صفحة النجاح
        setStatus("success");
        setFormData({ email: "", cardNumber: "", cardExpiry: "", cardCVC: "", cardHolder: "", country: "Morocco" });
      })
      .catch((err) => {
        console.error("Détail de l'erreur:", err.response?.data || err.message);
        setStatus("error");
      });
  };

  return (
    <div className="stripe-body">
      <div className="payment-wrapper">
        <div className="payment-card">
          
          {/* الحالة 1: نجاح الدفع */}
          {status === "success" ? (
            <div className="status-container success">
              <div className="icon-circle">✓</div>
              <h2>Paiement réussi !</h2>
              <p>Merci pour votre confiance. Votre abonnement est actif.</p>
              <button onClick={() => setStatus("idle")} className="pay-btn">Retour</button>
            </div>
          ) : status === "error" ? (
            /* الحالة 2: فشل الدفع */
            <div className="status-container error">
              <div className="icon-circle">!</div>
              <h2>Échec du paiement</h2>
              <p>Une erreur est survenue. Veuillez réessayer.</p>
              <button onClick={() => setStatus("idle")} className="pay-btn" style={{backgroundColor: "#e03131"}}>Réessayer</button>
            </div>
          ) : (
            /* الحالة 3: الفورم العادية ديالك بلا تغيير */
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2>Subscribe</h2>
                <p><strong>MAD 150.00</strong> per month</p>
              </div>

              <form onSubmit={handleSubmit} className="payment-form">
                <div>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                </div>

                <div>
                  <label>Card Information</label>
                  <div className="card-input-container">
                    <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" required />
                    <div className="small-logos">
                      <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                      <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
                      <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" />
                    </div>
                  </div>
                  <div className="row-payment">
                    <input type="text" id="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM / YY" required />
                    <input type="text" id="cardCVC" value={formData.cardCVC} onChange={handleChange} placeholder="CVC" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="cardHolder">Cardholder name</label>
                  <input type="text" id="cardHolder" value={formData.cardHolder} onChange={handleChange} placeholder="Nom complet" required />
                </div>

                <div>
                  <label htmlFor="country">Country or region</label>
                  <select id="country" value={formData.country} onChange={handleChange}>
                    <option>Morocco</option>
                    <option>France</option>
                    <option>Spain</option>
                  </select>
                </div>

                <button type="submit" className="pay-btn">Subscribe</button>

                <div className="separator">
                  <p>By subscribing, you agree to our Terms and Privacy Policy.</p>
                  <p>● Powered by <strong>Stripe</strong></p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Paiement;
