import React, { useState } from 'react';

const RatingFeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [recommend, setRecommend] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const data = { rating, feedback, recommend };
        onSubmit(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Rate & Feedback</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Rating (1-5):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Feedback:</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full border rounded p-2"
                        rows="4"
                    ></textarea>
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        checked={recommend}
                        onChange={(e) => setRecommend(e.target.checked)}
                        className="mr-2"
                    />
                    <label className="text-gray-700">Recommend this plan</label>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-4 px-4 py-2 bg-gray-300 rounded text-gray-700 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingFeedbackModal;
