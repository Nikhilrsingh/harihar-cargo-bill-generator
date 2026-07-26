import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Drivers() {
    const [drivers, setDrivers] = useState([
        { id: 1, name: "Amit Kumar", license: "DL-IND312024", phone: "9855512345", status: "Active" },
        { id: 2, name: "Rajesh Yadav", license: "DL-IND402025", phone: "9855567890", status: "On Leave" }
    ]);
    const [loading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Driver Name', accessor: 'name' },
        { header: 'License Number', accessor: 'license' },
        { header: 'Phone Number', accessor: 'phone' },
        { header: 'Status', accessor: 'status' }
    ];

    const filteredDrivers = drivers.filter(d =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        setDrivers(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Driver Register" 
                subtitle="Manage operator assignments, verification records, and availability logs."
            />
            <PageToolbar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={() => alert("Add Driver form coming soon!")}
                buttonText="Add Driver"
            />
            <DataTable 
                data={filteredDrivers} 
                columns={columns}
                loading={loading}
                onEdit={(d) => alert(`Editing: ${d.name}`)}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Drivers;