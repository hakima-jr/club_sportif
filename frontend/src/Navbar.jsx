import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ 
      background: "#2c3e50", 
      padding: "1rem", 
      display: "flex", 
      gap: "30px",
      justifyContent: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)" 
    }}>
      <Link to="/" style={linkStyle}>Accueil</Link>
      <Link to="/sports" style={linkStyle}>Gestion des Sports</Link>
      <Link to="/seances" style={linkStyle}>Séances</Link>
      <Link to="/paiements" style={linkStyle}>Paiements</Link>
    </nav>
  );
};

const linkStyle = { 
  color: "white", 
  textDecoration: "none", 
  fontWeight: "600",
  fontSize: "1.1rem"
};

export default Navbar;