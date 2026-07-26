import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import PageToolbar from '../../components/common/PageToolbar';
import DataTable from '../../components/common/DataTable';

function Payments() {
    const [payments, setPayments] = useState([
        { id: 1, txnId: "TXN-998231", reference: "INV-2026-8802", method: "NEFT / Bank Transfer", amount: "₹3,20,000", date: "2026-07-18" },
        { id: 2, txnId: "TXN-998254", reference: "Driver Advance - Amit", method: "UPI / Cash", amount: "₹15,000", date: "2026-07-19" }
    ]);
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { header: 'Transaction ID', accessor: 'txnId' },
        { header: 'Account Allocation / Ref', accessor: 'reference' },
        { header: 'Payment Channel', accessor: 'method' },
        { header: 'Amount Transferred', accessor: 'amount' },
        { header: 'Payment Date', accessor: 'date' }
    ];

    const filtered = payments.filter(p => p.txnId.toLowerCase().includes(searchTerm.toLowerCase()) || p.reference.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <PageHeader title="Financial Ledger & Advances" subtitle="Record inbound client settlements, clear carrier balances, and monitor out-of-pocket driver advances." />
            <PageToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddNew={() => alert("Log payment workflow coming soon!")} buttonText="Record Transaction Ledger" />
            <DataTable data={filtered} columns={columns} loading={false} onEdit={(p) => alert(`Txn Trace: ${p.txnId}`)} onDelete={(id) => setPayments(prev => prev.filter(p => p.id !== id))} />
        </div>
    );
}
export default Payments;