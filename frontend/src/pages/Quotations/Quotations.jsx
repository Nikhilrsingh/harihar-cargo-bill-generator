import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Quotations() {
    const [quotes, setQuotes] = useState([
        { id: 1, quoteNo: "QT-2026-001", customer: "Maruti Suzuki Dealer", amount: "₹1,25,000", date: "2026-07-15", status: "Approved" },
        { id: 2, quoteNo: "QT-2026-002", customer: "Hyundai Showroom", amount: "₹95,000", date: "2026-07-18", status: "Pending" }
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Quotation No', accessor: 'quoteNo' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Estimated Amount', accessor: 'amount' },
        { header: 'Date Created', accessor: 'date' },
        { header: 'Status', accessor: 'status' }
    ];

    const filtered = quotes.filter(q => q.customer.toLowerCase().includes(searchTerm.toLowerCase()) || q.quoteNo.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <PageHeader title="Quotations & Bids" subtitle="Generate, track, and manage official price quotations for commercial vehicle transport." />
            <PageToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddNew={() => alert("New Quote coming soon!")} buttonText="Create Quotation" />
            <DataTable data={filtered} columns={columns} loading={false} onEdit={(q) => alert(`Editing: ${q.quoteNo}`)} onDelete={(id) => setQuotes(prev => prev.filter(q => q.id !== id))} />
        </div>
    );
}
export default Quotations;