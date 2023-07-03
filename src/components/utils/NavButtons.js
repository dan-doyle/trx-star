import { useNavigate } from "react-router-dom"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setNavDirection } from "../../redux/slices/selectSlice";
import './utils.scss';


// fade in transition used by navigation buttons
const fadeIn = `
    @keyframes fade-in {
        0%   { opacity: 0; }
        50%  { opacity: 0; }
        100% { opacity: 1; }
    }`;

const NavButtons = ({prev, next}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const navigateHandler = (to, dir) => {
        dispatch(setNavDirection(dir)) // set the navigation direction (used for transitions)
        navigate(to);
    }
    return (

        <div>
            <style children={fadeIn}/> 

            {
                prev
                &&
                <IoIosArrowBack 
                    className="nav-button"
                    onClick={()=>{navigateHandler(prev, "backwards")}} // set the navigation direction (used for transitions)
                />
            }
            {
                next 
                &&
                <IoIosArrowForward 
                    className="nav-button"
                    onClick={()=>{navigateHandler(next, "forwards")}} // set the navigation direction (used for transitions)
                />
            }
        </div>
    )
}

export default NavButtons;