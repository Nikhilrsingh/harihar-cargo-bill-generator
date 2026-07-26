import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Vehicles() {
    const [vehicles, setVehicles] = useState([
        { id: 1, plateNumber: "MH-31-DV-1234", model: "Tata Signa", type: "Open Body", status: "On Route" },
        { id: 2, plateNumber: "MH-40-AK-5678", model: "Ashok Leyland Dost", type: "Closed Container", status: "Available" }
    ]);
    const [loading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Plate Number', accessor: 'plateNumber' },
        { header: 'Vehicle Model', accessor: 'model' },
        { header: 'Type', accessor: 'type' },
        { header: 'Status', accessor: 'status' }
    ];

    const filteredVehicles = vehicles.filter(v =>
        v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Fleet Management" 
                subtitle="Track carrier configurations, registration information, and maintenance states."
            />
            <PageToolbar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={() => alert("Add Vehicle form coming soon!")}
                buttonText="Add Vehicle"
            />
            <DataTable 
                data={filteredVehicles} 
                columns={columns}
                loading={loading}
                onEdit={(v) => alert(`Editing: ${v.plateNumber}`)}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Vehicles;