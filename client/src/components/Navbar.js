// frontend/src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
    // const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Redirect to login page after logout
    };

    return (
        <nav className={styles.navbar}>
            <h2 className = {styles.sitename}> BUY-SELL@IIITH </h2>
            <ul>
                <li>
                    <Link to="/">Profile</Link>
                </li>
                <li>
                    <Link to="/upload-item">Upload Item</Link> {/* New Link */}
                </li>
                <li>
                    <Link to="/items">Items</Link>
                </li>
                <li>
                    <Link to="/cart">My cart</Link>
                </li>
                <li>
                    <Link to="/orders">Order History</Link>
                </li>
                <li>
                    <Link to="/deliver">Delivery</Link>
                </li>
            </ul>
            <button className={styles.logout_btn} onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
