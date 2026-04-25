import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css"; // Had l-import hwa li ghadi i-jib l-alwan li siftti f App.css

// Pages dyal Ilyass
import Sport from "./pages/Sport";
import Seance from "./pages/Seance";
import Paiement from "./pages/Paiement";
import ProfilMembre from "./pages/ProfilMembre";

// Pages dyalk
import Home from "./pages/Home";
import Members from "./pages/Members";
import Abonnements from "./pages/Abonnements";
import Seances from "./pages/Seances";
import Paiements from "./pages/Paiements";
import Presence from "./pages/Presence";
import Rapports from "./pages/Rapports";

import Coach from "./pages/coach";
import Staff from "./pages/staff";
import Club from "./pages/club";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* Style inline hna ghir bach n-khaliw l-espace mzyan l-content */}
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sports" element={<Sport />} />
            <Route path="/seances" element={<Seance />} />
            <Route path="/paiements" element={<Paiement />} />
            <Route path="/profil/:id" element={<ProfilMembre />} />
            <Route path="/members" element={<Members />} />
            <Route path="/abonnements" element={<Abonnements />} />
            <Route path="/mes-seances" element={<Seances />} />
            <Route path="/mes-paiements" element={<Paiements />} />
            <Route path="/presence" element={<Presence />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/coach" element={<Coach />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/club" element={<Club />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;