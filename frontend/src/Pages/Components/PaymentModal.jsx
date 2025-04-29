import React, { useState } from 'react';

const PaymentModal = ({ onClose, amount, courseName, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Call the success handler with fake payment details
    onPaymentSuccess({
      paymentId: 'demo_' + Date.now(),
      orderId: 'order_' + Date.now(),
      signature: 'demo_signature'
    });

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0E3A59] p-6 rounded-lg shadow-xl max-w-md w-full border border-[#9433E0]/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[#4E84C1] font-medium mb-2">Course</p>
          <p className="text-white">{courseName}</p>
          <p className="text-[#4E84C1] font-medium mt-4 mb-2">Amount</p>
          <p className="text-white">₹{(amount / 100).toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#4E84C1] text-sm font-medium mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              className="w-full px-4 py-2 bg-[#042439] border border-[#9433E0]/20 rounded-md text-white placeholder-gray-400"
              placeholder="1234 5678 9012 3456"
              required
              pattern="[0-9]{16}"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#4E84C1] text-sm font-medium mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 2) {
                    setExpiryDate(value);
                  } else {
                    setExpiryDate(value.slice(0, 2) + '/' + value.slice(2, 4));
                  }
                }}
                className="w-full px-4 py-2 bg-[#042439] border border-[#9433E0]/20 rounded-md text-white placeholder-gray-400"
                placeholder="MM/YY"
                required
                pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
              />
            </div>

            <div>
              <label className="block text-[#4E84C1] text-sm font-medium mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full px-4 py-2 bg-[#042439] border border-[#9433E0]/20 rounded-md text-white placeholder-gray-400"
                placeholder="123"
                required
                pattern="[0-9]{3}"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9433E0] text-white py-3 rounded-md hover:bg-[#7928b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;