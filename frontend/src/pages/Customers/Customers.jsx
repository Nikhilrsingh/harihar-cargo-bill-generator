import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Customers() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", city: "Nagpur", status: "Active" },
        { id: 2, name: "Priya Patel", phone: "9812345678", email: "priya@gmail.com", city: "Mumbai", status: "Active" }
    ]);
    const [loading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Customer Name', accessor: 'name' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'City', accessor: 'city' },
        { header: 'Status', accessor: 'status' }
    ];

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Customer Directory" 
                subtitle="Manage your corporate accounts and client shipping profiles."
            />
            <PageToolbar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddNew={() => alert("Add Customer form coming soon!")}
                buttonText="Add Customer"
            />
            <DataTable 
                data={filteredCustomers} 
                columns={columns}
                loading={loading}
                onEdit={(c) => alert(`Editing: ${c.name}`)}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default Customers;