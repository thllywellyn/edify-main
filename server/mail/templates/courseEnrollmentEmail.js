exports.courseEnrollmentEmail = (courseName, name) => {
    return `<html>
    <body>
        <h2>Course Registration Confirmation</h2>
        <p>Dear ${name},</p>
        <p>You have successfully registered for the course <strong>${courseName}</strong>.</p>
        <p>Please log in to your learning dashboard to access the course materials.</p>
        <a href="https://edify.lsanalab.xyz/dashboard">Go to Dashboard</a>
    </body>
    </html>`;
};
