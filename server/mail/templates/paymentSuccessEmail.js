exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
    return `<html>
    <body>
        <h2>Payment Confirmation</h2>
        <p>Dear ${name},</p>
        <p>We have received your payment of ₹${amount}.</p>
        <p>Your Payment ID: <b>${paymentId}</b></p>
        <p>Your Order ID: <b>${orderId}</b></p>
    </body>
    </html>`;
};
