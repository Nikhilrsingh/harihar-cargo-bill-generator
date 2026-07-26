import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Trailers() {
    const [trailers, setTrailers] = useState([
        { id: 1, trailerNumber: "TR-31-AA-9991", type: "Car Carrier (8-Car)", capacity: "12 Tons", status: "Active" },
        { id: 2, trailerNumber: "TR-40-BB-9992", type: "Car Carrier (10-Car)", capacity: "15 Tons", status: "Maintenance" }
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Trailer Number', accessor: 'trailerNumber' },
        { header: 'Type / Deck Configuration', accessor: 'type' },
        { header: 'Load Capacity', accessor: 'capacity' },
        { header: 'Status', accessor: 'status' }
    ];

    const filtered = trailers.filter(t => 
        t.trailerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader title="Trailer Management" subtitle="Manage car carrier trailers, trailer dimensions, and fleet maintenance records." />
            <PageToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddNew={() => alert("Add Trailer coming soon!")} buttonText="Add Trailer" />
            <DataTable data={filtered} columns={columns} loading={false} onEdit={(t) => alert(`Editing: ${t.trailerNumber}`)} onDelete={(id) => setTrailers(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
}
export default Trailers;