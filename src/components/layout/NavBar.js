import { useNavigate, useLocation } from "react-router-dom";
import './NavBar.scss';

const withoutSidebarRoutes = ["/youtube"];


const NavBar = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    if (withoutSidebarRoutes.some((item) => pathname.includes(item))) return null;
    return (
        <div 
            id="navbar-container"
            className="nav-bar__container">
            <div 
                id="navbar-logo" 
                onClick={() => { navigate("/") }}
                style={{
                    cursor: "pointer"
                }}>
                <img
                    style={{
                        paddingLeft: "1rem",
                        height: "2.5rem",
                        width: "3.5rem"
                    }}
                    src={"/logo.png"}
                    alt={"logo"}/>
            </div>
            <div className = 'nav-bar__links-div'>
                <div className = 'nav-bar__link' onClick={() => { navigate("/about")}} > About </div>
                <div className = 'nav-bar__link'onClick={() => { navigate("/development")}}>Development</div>
            </div>
        </div>
    )
}

export default NavBar;
