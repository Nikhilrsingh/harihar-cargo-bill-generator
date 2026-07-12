function RecentActivity() {

  const activities = [
    "No recent activity",
    "Create your first Bilty",
    "Create your first Invoice",
    "Create your first Loading",
  ];

  return (
    <div className="recent-activity">

      <h2>Recent Activity</h2>

      <ul>

        {activities.map((item, index) => (

          <li key={index}>{item}</li>

        ))}

      </ul>

    </div>
  );
}

export default RecentActivity;