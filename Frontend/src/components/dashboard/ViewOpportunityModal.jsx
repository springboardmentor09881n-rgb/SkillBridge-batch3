import React from 'react';

const ViewOpportunityModal = ({ opportunity, onClose }) => {
    if (!opportunity) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{opportunity.title}</h2>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full mb-6 inline-block ${opportunity.status === 'Open' || opportunity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {opportunity.status}
                </span>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Description</h3>
                    <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {opportunity.description}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Duration</span>
                        <span className="font-medium text-gray-900">{opportunity.duration}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">Location</span>
                        <span className="font-medium text-gray-900">{opportunity.location}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                        {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 ? (
                            opportunity.skillsRequired.map(skill => (
                                <span key={skill} className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500 italic">No skills required</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOpportunityModal;
