import { Link } from "react-router-dom";

const Navbar = () => {
  return (
   <nav style={{
     background: "#2c3e50",
     padding: "1rem",
     display: "flex",
     gap: "20px",
     justifyContent: "center",
     flexWrap: "wrap",
     boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
   }}>
    <Link to="/" style={linkStyle}>Accueil</Link>
    <Link to="/sports" style={linkStyle}>Gestion des Sports</Link>
    <Link to="/seances" style={linkStyle}>Seances</Link>
    <Link to="/paiements" style={linkStyle}>Paiements</Link>
    <Link to="/mes-paiements" style={linkStyle}>Mes Paiements</Link>
    <Link to="/members" style={linkStyle}>Membres</Link>
    <Link to="/abonnements" style={linkStyle}>Abonnements</Link>
    <Link to="/presence" style={linkStyle}>Presence</Link>

    <Link to="/rapports" style={linkStyle}>Rapports</Link>
    
 </nav>
);
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1rem"
};

export default Navbar;    