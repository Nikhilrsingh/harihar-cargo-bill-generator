import { auth } from "../../firebase/firebaseConfig";

function DashboardHeader() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";
    let emoji = "🌙";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        emoji = "🌅";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        emoji = "☀️";
    }

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const userName =
        auth.currentUser?.displayName ||
        "Nikhil Singh";

    return (

        <div className="dashboard-header">

            <div>

                <h1>
                    {emoji} {greeting},
                    <span className="user-name"> {userName}</span>
                </h1>

                <p>
                    Manage your transport operations from one place.
                </p>

            </div>

            <div className="dashboard-date">

                <h2>Today's Summary</h2>

                <p>{formattedDate}</p>

            </div>

        </div>

    );

}

export default DashboardHeader;