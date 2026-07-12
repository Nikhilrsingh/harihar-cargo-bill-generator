import {
  MdDescription,
  MdReceiptLong,
  MdLocalShipping,
  MdAssignment,
} from "react-icons/md";

const actions = [
  {
    title: "New Bilty",
    icon: MdDescription,
  },
  {
    title: "New Invoice",
    icon: MdReceiptLong,
  },
  {
    title: "New Loading",
    icon: MdLocalShipping,
  },
  {
    title: "New Booking",
    icon: MdAssignment,
  },
];

function QuickActions() {
  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="action-grid">

        {actions.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.title}
              className="action-btn"
            >
              <Icon size={24} />
              <span>{item.title}</span>
            </button>

          );

        })}

      </div>

    </div>
  );
}

export default QuickActions;