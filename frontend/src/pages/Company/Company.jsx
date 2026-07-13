import MainLayout from "../../layouts/MainLayout";
import CompanyForm from "../../components/company/CompanyForm";
import PageHeader from "../../components/common/PageHeader";

function Company() {
    return (
        <MainLayout>

            <div className="dashboard">

                <PageHeader
    title="Company Profile"
    subtitle="Manage your company information."
/>

                <CompanyForm />

            </div>

        </MainLayout>
    );
}

export default Company;