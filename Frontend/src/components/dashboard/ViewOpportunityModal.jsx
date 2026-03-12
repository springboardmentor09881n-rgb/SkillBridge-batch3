import React, { useState } from 'react';

const ViewOpportunityModal = ({ opportunity, onClose }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);
    const [applyError, setApplyError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const handleApply = async () => {
        if (!user) {
            setApplyError('You must be logged in to apply.');
            return;
        }

        setIsApplying(true);
        setApplyError('');

        try {
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    opportunityId: opportunity._id,
                    volunteerId: user._id || user.id // Depending on what's stored in local storage
                }),
            });

            if (response.ok) {
                setApplySuccess(true);
            } else {
                const data = await response.json();
                setApplyError(data.message || 'Failed to submit application.');
            }
        } catch (error) {
            setApplyError('An error occurred while submitting. Please try again later.');
        } finally {
            setIsApplying(false);
        }
    };

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

                <div className="mb-6">
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

                {/* Apply Button Section */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                    {applyError && <p className="text-red-500 text-sm mb-3">{applyError}</p>}

                    {applySuccess ? (
                        <div className="bg-green-50 text-green-700 px-6 py-3 rounded-lg border border-green-200 text-center w-full font-medium">
                            ✓ Application submitted successfully!
                        </div>
                    ) : (
                        <button
                            onClick={handleApply}
                            disabled={isApplying || opportunity.status === 'Closed'}
                            className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${opportunity.status === 'Closed'
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                } disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                        >
                            {isApplying ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting Application...
                                </>
                            ) : (
                                opportunity.status === 'Closed' ? 'Opportunity Closed' : 'Apply Now'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOpportunityModal;
