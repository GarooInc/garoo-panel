function Dashboard() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Dashboard</h1>
                    <div className="row">
                        <div className="col-md-6 col-lg-3 mb-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <i className="bi bi-people-fill fs-1 text-primary"></i>
                                    <h5 className="card-title mt-2">Users</h5>
                                    <p className="card-text">Manage users</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <i className="bi bi-graph-up fs-1 text-success"></i>
                                    <h5 className="card-title mt-2">Analytics</h5>
                                    <p className="card-text">View statistics</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <i className="bi bi-gear-fill fs-1 text-warning"></i>
                                    <h5 className="card-title mt-2">Settings</h5>
                                    <p className="card-text">Configure app</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 mb-4">
                            <div className="card text-center">
                                <div className="card-body">
                                    <i className="bi bi-bell-fill fs-1 text-info"></i>
                                    <h5 className="card-title mt-2">Notifications</h5>
                                    <p className="card-text">View alerts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;