import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminApprovals = () => {
  const { data } = useParams();
  const navigator = useNavigate();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [adminID, setAdminID] = useState(null);
  const [error, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const Approval = async (ID, type, approve) => {
    try {
      const data = {
        Isapproved: approve,
      };

      const response = await fetch(`/api/admin/${adminID}/approve/${type}/${ID}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": window.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Approval failed');
      }

      // Move the user to appropriate list or remove if rejected
      if (type === "student") {
        if (approve === "approved") {
          const student = pendingStudents.find(s => s._id === ID);
          if (student) {
            setPendingStudents(prev => prev.filter(s => s._id !== ID));
            setApprovedStudents(prev => [...prev, { ...student, Isapproved: "approved" }]);
          }
        } else {
          setPendingStudents(prev => prev.filter(s => s._id !== ID));
        }
      } else if (type === "teacher") {
        if (approve === "approved") {
          const teacher = pendingTeachers.find(t => t._id === ID);
          if (teacher) {
            setPendingTeachers(prev => prev.filter(t => t._id !== ID));
            setApprovedTeachers(prev => [...prev, { ...teacher, Isapproved: "approved" }]);
          }
        } else {
          setPendingTeachers(prev => prev.filter(t => t._id !== ID));
        }
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  const docDetails = async (type, ID) => {
    navigator(`/VarifyDoc/${type}/${adminID}/${ID}`);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/${data}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": window.csrfToken
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data");
        }

        const result = await response.json();
        
        // Separate students into pending and approved
        const students = result.data.students || [];
        setPendingStudents(students.filter(s => s.Studentdetails && (!s.Isapproved || s.Isapproved === "pending")));
        setApprovedStudents(students.filter(s => s.Studentdetails && s.Isapproved === "approved"));

        // Separate teachers into pending and approved
        const teachers = result.data.teachers || [];
        setPendingTeachers(teachers.filter(t => t.Teacherdetails && (!t.Isapproved || t.Isapproved === "pending")));
        setApprovedTeachers(teachers.filter(t => t.Teacherdetails && t.Isapproved === "approved"));

        setAdminID(result.data.admin._id);
        setErrors("");
      } catch (err) {
        setErrors("Failed to load approval requests. Please try again later.");
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4E84C1]"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium hover:text-red-700 dark:hover:text-red-300"
        >
          Try Again →
        </button>
      </div>
    );
  }

  const noPendingRequests = pendingStudents.length === 0 && pendingTeachers.length === 0;
  const noApprovedRequests = approvedStudents.length === 0 && approvedTeachers.length === 0;

  const renderUserCard = (user, type, isPending = true) => (
    <div
      key={user._id}
      className="bg-gray-50 dark:bg-[#042439] p-4 rounded-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-medium text-gray-900 dark:text-white">
            {user.Firstname} {user.Lastname}
          </h4>
          <p className="text-sm text-[#4E84C1]">{user.Email}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => docDetails(type, user._id)}
            className="px-4 py-2 text-sm font-medium text-[#4E84C1] hover:bg-[#4E84C1]/10 rounded-md transition-colors"
          >
            View Documents
          </button>
          {isPending && (
            <>
              <button
                onClick={() => Approval(user._id, type, "approved")}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => Approval(user._id, type, "rejected")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pending Approvals Section */}
      <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Pending Approvals
          </h2>

          {noPendingRequests ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No pending approval requests at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Student Requests */}
              {pendingStudents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Student Requests
                  </h3>
                  <div className="grid gap-4">
                    {pendingStudents.map(student => renderUserCard(student, "student", true))}
                  </div>
                </div>
              )}

              {/* Pending Teacher Requests */}
              {pendingTeachers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Teacher Requests
                  </h3>
                  <div className="grid gap-4">
                    {pendingTeachers.map(teacher => renderUserCard(teacher, "teacher", true))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recently Approved Section */}
      <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recently Approved
          </h2>

          {noApprovedRequests ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recently approved requests.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Approved Student Requests */}
              {approvedStudents.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Approved Students
                  </h3>
                  <div className="grid gap-4">
                    {approvedStudents.map(student => renderUserCard(student, "student", false))}
                  </div>
                </div>
              )}

              {/* Approved Teacher Requests */}
              {approvedTeachers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Approved Teachers
                  </h3>
                  <div className="grid gap-4">
                    {approvedTeachers.map(teacher => renderUserCard(teacher, "teacher", false))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;