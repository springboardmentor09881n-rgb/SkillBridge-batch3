import "./Dashboard.css";

function NgoDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        <div className="profile-card">
          <div className="profile-header">
            <h2>NGO Dashboard</h2>
            <span className="role-badge ngo">NGO</span>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Organization Name</label>
              <p>{user?.fullName}</p>
            </div>

            <div className="detail-item">
              <label>Username</label>
              <p>{user?.username}</p>
            </div>

            <div className="detail-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NgoDashboard;
