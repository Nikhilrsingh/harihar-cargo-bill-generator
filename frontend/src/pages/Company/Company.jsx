import MainLayout from "../../layouts/MainLayout";
import CompanyForm from "../../components/company/CompanyForm";

function Company() {
    return (
        <MainLayout>

            <div className="dashboard">

                <h1>Company Profile</h1>

                <CompanyForm />

            </div>

        </MainLayout>
    );
}

export default Company;