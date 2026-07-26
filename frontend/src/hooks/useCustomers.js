import { useState, useEffect } from 'react';

function useCustomers() {
    // Starting with an empty array to prevent "cannot read property map of undefined" bugs
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mock data fallback until your backend API endpoint is active
        const fallbackData = [
            { id: 1, name: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", city: "Nagpur", status: "Active" },
            { id: 2, name: "Priya Patel", phone: "9812345678", email: "priya@gmail.com", city: "Mumbai", status: "Active" }
        ];
        
        setLoading(true);
        try {
            setCustomers(fallbackData);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addCustomer = async (customer) => {
        setCustomers(prev => [...prev, { ...customer, id: Date.now() }]);
    };

    const updateCustomer = async (updatedCustomer) => {
        setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    };

    const deleteCustomer = async (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    return { customers, loading, error, addCustomer, updateCustomer, deleteCustomer };
}

export default useCustomers;