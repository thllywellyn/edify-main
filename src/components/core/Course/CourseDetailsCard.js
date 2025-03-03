import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CourseDetailsCard = ({ course }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const isInstructor = useMemo(() => user?.accountType === "Instructor", [user]);
  const isEnrolled = useMemo(() => course?.studentsEnrolled?.includes(user?._id), [course, user]);

  const handleAddToCart = useCallback(() => {
    if (!user) return toast.error("Please login to add to cart");
    dispatch(addToCart(course));
    toast.success("Added to cart");
  }, [dispatch, user, course]);

  const handleBuyNow = useCallback(() => {
    if (!user) return toast.error("Please login to purchase");
    navigate(`/checkout/${course._id}`);
  }, [navigate, user, course]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Course link copied!");
  }, []);

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <img src={course?.thumbnail} alt="Course Thumbnail" className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-xl font-semibold mt-2">{course?.title}</h3>
      <p className="text-lg font-bold mt-2">₹ {course?.price}</p>
      {isEnrolled ? (
        <button onClick={() => navigate("/dashboard/enrolled-courses")} className="w-full bg-green-500 text-white py-2 mt-3 rounded-md">
          Go to Course
        </button>
      ) : !isInstructor ? (
        <>
          <button onClick={handleBuyNow} className="w-full bg-blue-600 text-white py-2 mt-3 rounded-md">
            Buy Now
          </button>
          <button onClick={handleAddToCart} className="w-full bg-gray-200 text-black py-2 mt-2 rounded-md">
            Add to Cart
          </button>
        </>
      ) : null}
      <button onClick={handleCopyLink} className="w-full bg-gray-100 text-black py-2 mt-2 rounded-md">
        {copied ? "Copied!" : "Share"}
      </button>
    </div>
  );
};

export default CourseDetailsCard;
