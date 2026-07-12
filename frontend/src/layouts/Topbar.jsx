import {
  MdSearch,
  MdNotificationsNone,
  MdAccountCircle,
} from "react-icons/md";

function Topbar() {
  return (
    <header className="topbar">

      <div className="topbar-left">

        <h2>Dashboard</h2>

      </div>

      <div className="topbar-right">

        <div className="search-box">

          <MdSearch size={20} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        <button className="icon-btn">
          <MdNotificationsNone size={24} />
        </button>

        <div className="profile">

          <MdAccountCircle size={38} />

          <div>

            <h4>Nikhil Singh</h4>

            <span>Super Admin</span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;