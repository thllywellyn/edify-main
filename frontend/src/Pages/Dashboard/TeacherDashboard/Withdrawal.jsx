import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Components/Modal';

function Withdrawal({ onClose, TA }) {
  const { ID } = useParams();
  const [amount, setamount] = useState(0);

  const withdraw = async () => {
    if (amount <= 0) {
      alert('Enter valid amount!');
      return;
    }

    if (amount > TA) {
      alert('Insufficient balance!');
      return;
    }

    try {
      const response = await fetch(`/api/payment/teacher/${ID}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to process withdrawal');
      }

      alert(res.message);
      if (res.statusCode === 200) {
        onClose();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal title="Withdraw Balance" onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Available Balance
          </label>
          <div className="px-4 py-3 bg-gray-50 dark:bg-[#042439] rounded-lg text-xl font-semibold text-gray-900 dark:text-white">
            ₹{TA}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Withdrawal Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setamount(Number(e.target.value))}
            placeholder="Enter amount to withdraw"
            className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={withdraw}
            className="px-6 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-lg transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Withdrawal;