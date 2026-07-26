import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useCompany } from '../../hooks/useCompany';

function Company() {
    const { companyDetails, loading, error, updateCompanyDetails } = useCompany();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstin: '',
        pan: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (companyDetails) {
            setFormData(companyDetails);
        }
    }, [companyDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        try {
            await updateCompanyDetails(formData);
            setSuccessMessage('Company profiles updated successfully.');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Company Settings" 
                subtitle="Configure your legal entity details, billing information, and tax registration identifiers."
            />

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                    Error loading company information: {error.message}
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                    {successMessage}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Trade Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Official Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Contact Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN Identification</label>
                            <input
                                type="text"
                                name="gstin"
                                value={formData.gstin || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Permanent Account Number (PAN)</label>
                            <input
                                type="text"
                                name="pan"
                                value={formData.pan || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address Office</label>
                        <textarea
                            name="address"
                            rows="3"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={loading || isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving Updates...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Company;