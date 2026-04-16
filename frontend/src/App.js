import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Sport from "./pages/Sport";
import Seance from "./pages/Seance"; // عيطنا لصفحة الحصص
import Paiement from "./pages/Paiement"; // عيطنا لصفحة الأداء

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<h1 style={{textAlign: 'center'}}>Bienvenue au Club Sportif 👋</h1>} />
            <Route path="/sports" element={<Sport />} />
            <Route path="/seances" element={<Seance />} />
            <Route path="/paiements" element={<Paiement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;