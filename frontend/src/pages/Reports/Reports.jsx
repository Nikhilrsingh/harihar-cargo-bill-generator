import React from 'react';
import PageHeader from '../../components/common/PageHeader';

function Reports() {
    const reportCategories = [
        { name: "Fleet Fuel & Triplog Analytics", desc: "Evaluate operational fuel efficiences, tracking expenses against specific lorry routes." },
        { name: "Profitability Breakdown", desc: "Analyze customer revenue channels versus maintenance and driver payout obligations." },
        { name: "Consignment & Delivery Timelines", desc: "Monitor service level agreement performance rates across national delivery destinations." }
    ];

    return (
        <div className="space-y-6">
            <PageHeader title="Business Intelligence Reports" subtitle="Generate system performance matrixes, audit logs, and operational overhead summaries." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportCategories.map((rep, idx) => (
                    <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{rep.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{rep.desc}</p>
                        <button onClick={() => alert(`Compiling ${rep.name}...`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                            Generate Report (PDF/Excel)
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Reports;