"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/selectionRecolor.css";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (isRegister) {
      if (!formData.name) errors.name = "Name is required.";
      if (!formData.email)
        errors.email = "Email is required.";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
        errors.email = "Invalid email address.";

      if (!formData.password) errors.password = "Password is required.";
      else if (formData.password.length < 6)
        errors.password = "Password must be at least 6 characters.";

      if (!formData.confirmPassword)
        errors.confirmPassword = "Please confirm your password.";
      else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "Passwords do not match.";
    } else {
      if (!formData.email)
        errors.email = "Email is required.";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
        errors.email = "Invalid email address.";
      if (!formData.password) errors.password = "Password is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-background bg-[url('/img/background.jpg')] bg-cover bg-center">
        <div className="w-full max-w-md p-5 space-y-6 bg-foreground rounded-lg shadow-lg sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3 mt-28 mb-12 sm:mt-10 sm:mb-10 m-10 sm:mt-36 md:28 lg:36 xl:28 2xl:28 custom-margin-top-AuthForm">
          <h2 className="text-2xl font-bold text-center text-background">
            {isRegister ? "Register" : "Login"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 grid">
            {isRegister && (
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-background" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none selected text-background bg-foreground border-background"
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
            )}

            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-background" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-foreground border-background"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-500 ">{errors.email}</p>}
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-background" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg bg-foreground border-background"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {isRegister && (
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-background" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg bg-foreground border-background"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="px-12 font-semibold justify-self-center py-2 text-background hover:text-background bg-foreground border hover:border-white rounded-lg hover:bg-foreground focus:outline-none"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-background">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-white hover:underline focus:outline-none"
              >
                <strong>{isRegister ? "Login" : "Register"}</strong>
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthForm;
