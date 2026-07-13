import MainLayout from "../../layouts/MainLayout";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";

import { dashboardStats } from "../../data/dashboardStats";

function Dashboard() {
    return (
        <MainLayout>

            <div className="dashboard">

                <DashboardHeader />

                <div className="stats-grid">

                    {dashboardStats.map((item) => (

                        <StatCard
                            key={item.title}
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                            color={item.color}
                            bg={item.bg}
                        />

                    ))}

                </div>

                <div className="dashboard-row">

                    <div className="dashboard-main">

                        {/* Revenue Chart */}

                        {/* Recent Bookings */}

                    </div>

                    <div className="dashboard-side">

                        <QuickActions />

                        <RecentActivity />

                    </div>

                </div>

                <div className="dashboard-footer">

                    {/* Pending Deliveries */}

                </div>

            </div>

        </MainLayout>
    );
}

export default Dashboard;