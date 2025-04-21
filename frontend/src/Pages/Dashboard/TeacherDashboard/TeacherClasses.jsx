import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import AddClass from './AddClass';
import ClassCard from '../Components/ClassCard';
import DashboardCard from '../Components/DashboardCard';

function TeacherClasses() {
    const [showPopup, setShowPopup] = useState(false);
    const { ID } = useParams();
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`/api/course/classes/teacher/${ID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const user = await response.json();
                setData(user.data.classes[0]?.liveClasses || []);
            } catch (error) {
                setError(error.message);
            }
        };
        getData();
    }, [showPopup, ID]);

    return (
        <div className="space-y-8">
            {/* Header with Add Class Button */}
            <DashboardCard>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Class Schedule
                    </h1>
                    <button
                        onClick={() => setShowPopup(true)}
                        className="flex items-center px-4 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-lg transition-colors"
                    >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Add Class
                    </button>
                </div>
            </DashboardCard>

            {/* Next Class Card */}
            {data.length > 0 && (
                <DashboardCard>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Next Class
                    </h2>
                    <NavLink to={data[0]?.link} target="_blank">
                        <ClassCard classData={data[0]} showStatus={false} />
                    </NavLink>
                </DashboardCard>
            )}

            {/* Weekly Schedule */}
            <DashboardCard>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Weekly Schedule
                </h2>
                {data.length > 0 ? (
                    <div className="space-y-4">
                        {data.filter(clas => {
                            const classDate = new Date(clas.date.slice(0, 10));
                            const today = new Date();
                            const oneWeekFromNow = new Date(today);
                            oneWeekFromNow.setDate(today.getDate() + 7);
                            return classDate >= today && classDate <= oneWeekFromNow;
                        }).map((clas) => (
                            <NavLink key={clas.timing} to={clas.link} target="_blank" className="block hover:opacity-90 transition-opacity">
                                <ClassCard classData={clas} />
                            </NavLink>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            No upcoming classes scheduled. Click the "Add Class" button to schedule a new class.
                        </p>
                    </div>
                )}
            </DashboardCard>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4">
                    Error: {error}
                </div>
            )}

            {/* Add Class Modal */}
            {showPopup && (
                <AddClass onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
}

export default TeacherClasses;
