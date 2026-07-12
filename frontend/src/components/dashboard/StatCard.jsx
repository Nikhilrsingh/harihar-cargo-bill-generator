function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        <Icon size={34} />
      </div>

      <div className="stat-content">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>

    </div>
  );
}

export default StatCard;