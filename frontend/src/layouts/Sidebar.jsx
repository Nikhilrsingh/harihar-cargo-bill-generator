import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { sidebarMenu } from "../data/sidebarMenu";

function Sidebar() {

    const navigate = useNavigate();

const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
};

    return (
        <aside className="sidebar">

            <div className="logo">
                <h2>CarTransport Pro</h2>
            </div>

            {sidebarMenu.map((group) => (

                <div key={group.section}>

                    <p className="menu-heading">
                        {group.section}
                    </p>

                    {group.items.map((item) => {

                        const Icon = item.icon;

                        const isLogout = item.title === "Logout";

                        return (

                           <NavLink
    key={item.title}
    to={item.path}
    onClick={isLogout ? handleLogout : undefined}
    className={({ isActive }) =>
        isActive ? "menu-item active-menu" : "menu-item"
    }
>
                                <Icon size={20} />
                                <span>{item.title}</span>
                            </NavLink>

                        );

                    })}

                </div>

            ))}

        </aside>
    );
}

export default Sidebar;