import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourseDetails } from "../../../redux/slices/courseSlice";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [dispatch, courseId]);

  const totalLectures = useMemo(() => course?.content?.reduce((acc, section) => acc + section.lectures.length, 0), [course]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-red-500">Failed to load course. Please try again.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{course?.title}</h1>
      <p className="text-gray-700 mt-2">{course?.description}</p>
      <p className="text-gray-600 mt-2">Language: {course?.language || "English"}</p>
      <p className="text-gray-600 mt-2">Total Lectures: {totalLectures}</p>
      <CourseDetailsCard course={course} />
    </div>
  );
};

export default CourseDetails;
