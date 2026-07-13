import MainLayout from "../../layouts/MainLayout";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";
import PageHeader from "../../components/common/PageHeader";

function Users() {

    return (

        <MainLayout>

            <div className="dashboard">

                <PageHeader
    title="User Management"
    subtitle="Create and manage users."
/>

                <UserForm />
                <UserTable />

            </div>

        </MainLayout>

    );

}

export default Users;