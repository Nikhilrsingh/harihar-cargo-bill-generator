import React from 'react';
import PageHeader from '../../components/common/PageHeader';

function Settings() {
    return (
        <div className="space-y-6">
            <PageHeader title="Global ERP Configuration" subtitle="Configure tenant data parameters, set base taxation thresholds, and manage layout presets." />
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-2xl">
                <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Operational System Toggles</h3>
                <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between items-center py-2">
                        <div>
                            <p className="font-medium text-gray-700">Automatic LR to E-Way Linkage</p>
                            <p className="text-xs text-gray-400">Attempt connection to Government E-Way portals directly upon saving bilties.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                        <div>
                            <p className="font-medium text-gray-700">SMS Driver Allocation Dispatches</p>
                            <p className="text-xs text-gray-400">Ping drivers with loading slip specifics and transit checkpoints automatically.</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Settings;