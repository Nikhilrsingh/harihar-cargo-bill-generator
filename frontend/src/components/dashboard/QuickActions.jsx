import {
  MdDescription,
  MdReceiptLong,
  MdLocalShipping,
  MdAssignment,
} from "react-icons/md";

const actions = [

    {
        title:"New Booking",
        icon:MdAssignment,
    },

    {
        title:"New Pickup",
        icon:MdLocalShipping,
    },

    {
        title:"New Loading",
        icon:MdLocalShipping,
    },

    {
        title:"Generate Bilty",
        icon:MdDescription,
    },

    {
        title:"Create Invoice",
        icon:MdReceiptLong,
    },

    {
        title:"Add Customer",
        icon:MdAssignment,
    }

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