import Card from "../common/Card";

function UserTable() {
    return (
        <Card>

            <h2>Users</h2>

            <table className="data-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td colSpan="6" align="center">
                            No users found
                        </td>

                    </tr>

                </tbody>

            </table>

        </Card>
    );
}

export default UserTable;