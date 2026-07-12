import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function MainLayout({ children }) {
    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-wrapper">

                <Topbar />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;