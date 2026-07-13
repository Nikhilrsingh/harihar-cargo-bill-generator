import {
    Search,
    Bell,
    Settings,
    Building2,
    ChevronDown,
} from "lucide-react";

import { auth } from "../firebase/firebaseConfig";
import useCompany from "../hooks/useCompany";

function Topbar() {

    const userName =
        auth.currentUser?.displayName ||
        "Nikhil Singh";

        const { company } = useCompany();

    const initials = userName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    return (

        <header className="topbar">

            {/* Company */}

            <div className="company-info">

               <div className="company-icon">

    {company?.logo ? (

        <img
            src={company.logo}
            alt="Company Logo"
        />

    ) : (

        <Building2 size={22} />

    )}

</div>

                <div>

                    <h3>
    {company?.companyName || "Company Name"}
</h3>

                    <p>
    {company?.tagline || "Transport Management System"}
</p>

                </div>

            </div>

            {/* Search */}

            <div className="topbar-search">

                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search customers, bookings..."
                />

            </div>

            {/* Right */}

            <div className="topbar-right">

                <button className="topbar-icon">
                    <Bell size={19} />
                </button>

                <button className="topbar-icon">
                    <Settings size={19} />
                </button>

                <div className="profile">

                    <div className="user-avatar">
                        {initials}
                    </div>

                    <div>

                        <h4>{userName}</h4>

                        <span>Super Admin</span>

                    </div>

                    <ChevronDown size={18} />

                </div>

            </div>

        </header>

    );

}

export default Topbar;