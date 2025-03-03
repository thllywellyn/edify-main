import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourseDetails = createAsyncThunk("course/fetchDetails", async (courseId, { getState }) => {
  const existingCourse = getState().course.course;
  if (existingCourse?._id === courseId) return existingCourse;
  
  const response = await axios.get(`/api/courses/${courseId}`);
  return response.data;
});

const courseSlice = createSlice({
  name: "course",
  initialState: {
    course: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
