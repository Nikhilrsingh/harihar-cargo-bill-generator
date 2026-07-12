import MainLayout from "../../layouts/MainLayout";

import StatCard from "../../components/dashboard/StatCard";

import { dashboardStats } from "../../data/dashboardStats";

import QuickActions from "../../components/dashboard/QuickActions";

import RecentActivity from "../../components/dashboard/RecentActivity";

function Dashboard() {
  return (
    <MainLayout>

      <div className="dashboard">

        <div className="welcome-banner">

          <div>

            <h1>Welcome Back 👋</h1>

            <p>
              Manage your transport business from one place.
            </p>

          </div>

        </div>

        <div className="stats-grid">

          {dashboardStats.map((item) => (

            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />

          ))}

        </div>

        <div className="dashboard-bottom">

    <QuickActions />

    <RecentActivity />

</div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;