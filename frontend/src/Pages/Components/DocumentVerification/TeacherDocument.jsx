import React, { useState, useEffect } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import FileUpload from '../FileUpload/FileUpload';
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../Images/logo.svg";

const TeacherDocument = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/teacher/TeacherDocument/${Data}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setData(user.data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, []);

  const [formData, setFormData] = useState({
    Phone: data.Phone || "",
    Address: data.Address || "",
    Experience: data.Experience || "",
    SecondarySchool: data.SecondarySchool || "",
    SecondaryMarks: data.SecondaryMarks || "",
    HigherSchool: data.HigherSchool || "",
    HigherMarks: data.HigherMarks || "",
    UGcollege: data.UGcollege || "",
    UGmarks: data.UGmarks || "",
    PGcollege: data.PGcollege || "",
    PGmarks: data.PGmarks || "",
    Aadhaar: '',
    Secondary: '',
    Higher: '',
    UG: '',
    PG: '',
  });

  const handleFileChange = (field, url) => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await fetch(`/api/teacher/verification/${Data}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      setLoader(false);
      
      if (!response.ok) {
        setError(responseData.message);
      } else {
        navigate("/pending");
      }
    } catch (e) {
      console.error("Error:", e);
      setLoader(false);
    }
  };

  return (
    <>
      {loader && (
        <div className="absolute top-[40%] left-[45%] translate-x-[50%] translate-y-[50%]">
          <RotatingLines
            visible={true}
            height="100"
            width="100"
            color="#0D286F"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />{" "}
          <span className="text-white text-xl ml-1">Uploading ...</span>
        </div>
      )}
      <div className="flex items-center gap-[20rem] px-32 py-2 bg-[#0D286F]">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-14" alt="" />
          <h1 className="text-2xl text-[#4E84C1] font-bold">Edify</h1>
        </div>
        <h2 className="text-white text-xl">Document Verification (Teacher) </h2>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <p className="text-[#4E84C1] p-5 px-10">Personal Information</p>
        <div className="flex flex-wrap gap-20 px-36 mb-10">
          <Input
            label={"First Name"}
            placeholder={"First Name"}
            value={data.Firstname}
            readonly
          />
          <Input
            label={"Last Name"}
            placeholder={"Last Name"}
            value={data.Lastname}
            readonly
          />
          <Input
            label={"Phone No."}
            placeholder={"Phone No."}
            value={formData.Phone}
            onChange={(e) => handleInputChange("Phone", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-20 px-36">
          <Input
            label={"Home Address"}
            placeholder={"Home Address"}
            value={formData.Address}
            onChange={(e) => handleInputChange("Address", e.target.value)}
          />
          <Input
            label={"Experience (years)"}
            placeholder={"Experience (years)"}
            value={formData.Experience}
            onChange={(e) => handleInputChange("Experience", e.target.value)}
          />
          <FileUpload
            label="Upload Aadhar Card"
            value={formData.Aadhaar}
            onFileChange={(url) => handleFileChange('Aadhaar', url)}
          />
        </div>

        <p className="text-[#4E84C1] p-5 px-10 pt-10">
          Educational Information
        </p>
        <div className="border h-full mx-36 relative">
          <div className="flex flex-row gap-7 ">
            <div className=" bg-[#0D286F] p-[1rem] m-3 rounded-sm">
              <p className=" text-white text-sm">Secondary</p>
            </div>
            <Input
              placeholder={"10th Board Name"}
              value={formData.SecondarySchool}
              onChange={(e) =>
                handleInputChange("SecondarySchool", e.target.value)
              }
            />
            <Input
              placeholder={"Total Marks (%)"}
              value={formData.SecondaryMarks}
              onChange={(e) =>
                handleInputChange("SecondaryMarks", e.target.value)
              }
            />
            <div className=" mt-[-1.5rem]">
              <FileUpload
                label="Upload 10th Result"
                value={formData.Secondary}
                onFileChange={(url) => handleFileChange('Secondary', url)}
              />
            </div>
          </div>
          <hr />

          <div className="flex flex-row gap-7 items-center">
            <div className=" bg-[#0D286F] p-[1rem] m-1 rounded-sm">
              <p className=" text-white text-sm">Higher Secondary</p>
            </div>
            <Input
              placeholder={"12th Board Name"}
              value={formData.HigherSchool}
              onChange={(e) =>
                handleInputChange("HigherSchool", e.target.value)
              }
            />
            <Input
              placeholder={"Total Marks (%)"}
              value={formData.HigherMarks}
              onChange={(e) => handleInputChange("HigherMarks", e.target.value)}
            />
            <div className=" mt-[-1.5rem]">
              <FileUpload
                label="Upload 12th Result"
                value={formData.Higher}
                onFileChange={(url) => handleFileChange('Higher', url)}
              />
            </div>
          </div>
          <hr />

            <div className="flex flex-row gap-7">
              <div className=" bg-[#0D286F] p-[1rem] m-3 rounded-sm">
                <p className=" text-white text-sm">Graduation</p>
              </div>
              <Input
                placeholder={"Graduation University Name"}
                value={formData.UGcollege}
                onChange={(e) => handleInputChange("UGcollege", e.target.value)}
              />
              <Input
                placeholder={"UGmarks/SGP out of 10"}
                value={formData.UGmarks}
                onChange={(e) => handleInputChange("UGmarks", e.target.value)}
              />
              <div className=" mt-[-1.5rem]">
                <FileUpload
                  label="Upload Graduation .."
                  value={formData.UG}
                  onFileChange={(url) => handleFileChange('UG', url)}
                />
              </div>
            </div>
          
          <hr />
            <div className="flex flex-row gap-7">
              <div className=" bg-[#0D286F] p-[1rem] m-1 rounded-sm px-4">
                <p className=" text-white text-sm">Post Graduation</p>
              </div>
              <Input
                placeholder={"P.G. University Name"}
                value={formData.PGcollege}
                onChange={(e) => handleInputChange("PGcollege", e.target.value)}
              />
              <Input
                placeholder={"CGPA out of 10"}
                value={formData.PGmarks}
                onChange={(e) => handleInputChange("PGmarks", e.target.value)}
              />
              <div className=" mt-[-1.5rem]">
                <FileUpload
                  label="Upload P.G. Result"
                  value={formData.PG}
                  onFileChange={(url) => handleFileChange('PG', url)}
                />
              </div>
            </div>
        </div>

        {error && <p className=" text-white text-xl m-5 text-center">!! {error}</p>}
        <div className=" bg-[#0D286F] p-3 m-6 rounded-md w-[7rem] ml-[85%] cursor-pointer">
          <button className=" text-white text-sm" type="submit">
            Submit ▶️
          </button>
        </div>
      </form>
    </>
  );
};

export default TeacherDocument;
