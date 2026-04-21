import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

// صفحات إلياس
import Sport from "./pages/Sport";
import Seance from "./pages/Seance";
import Paiement from "./pages/Paiement";
import ProfilMembre from "./pages/ProfilMembre";

// صفحاتك نتي
import Home from "./pages/Home";
import Members from "./pages/Members";
import Abonnements from "./pages/Abonnements";
import Seances from "./pages/Seances";
import Paiements from "./pages/Paiements";
import Presence from "./pages/Presence";
import Rapports from "./pages/Rapports";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* صفحاتي */}
            <Route path="/sports" element={<Sport />} />
            <Route path="/seances" element={<Seance />} />
            <Route path="/paiements" element={<Paiement />} />
            <Route path="/profil/:id" element={<ProfilMembre />} />

            {/* صفحات إلياس */}
            <Route path="/members" element={<Members />} />
            <Route path="/abonnements" element={<Abonnements />} />
            <Route path="/mes-seances" element={<Seances />} />
            <Route path="/mes-paiements" element={<Paiements />} />
            <Route path="/presence" element={<Presence />} />
            <Route path="/rapports" element={<Rapports />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
