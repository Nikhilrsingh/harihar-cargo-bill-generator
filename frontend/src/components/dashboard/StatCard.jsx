function StatCard({
    title,
    value,
    icon: Icon,
    color,
    bg
}) {

    return (

        <div className="stat-card">

            <div
                className="stat-icon"
                style={{
                    background:bg,
                    color:color
                }}
            >

                <Icon size={30} />

            </div>

            <div className="stat-content">

                <h2>{value}</h2>

                <p>{title}</p>

            </div>

        </div>

    );

}

export default StatCard;