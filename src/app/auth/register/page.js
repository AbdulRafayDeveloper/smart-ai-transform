"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import "../../components/css/selectionRecolor.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = () => {
  const router = useRouter();

  // 🟢 Professional state names
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 🟢 Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      const updated = { ...prev, [name]: value };
      const newErrors = { ...formErrors };

      delete newErrors[name];

      if (name === "password") {
        if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters.";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) {
          newErrors.password = "Must include uppercase, lowercase, number & special character.";
        } else {
          delete newErrors.password;
        }

        if (updated.confirmPassword && updated.confirmPassword !== value) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      if (name === "confirmPassword") {
        if (value !== updated.password) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      setFormErrors(newErrors);
      return updated;
    });
  };

  // 🟢 Form validation
  const validateForm = () => {
    const errors = {};

    if (!userData.fullName || userData.fullName.trim() === "") {
      errors.name = "Please enter your name.";
    } else if (userData.fullName.length < 3) {
      errors.name = "Name must be at least 3 characters.";
    } else if (userData.fullName.length > 20) {
      errors.name = "Name cannot exceed 20 characters.";
    }

    if (!userData.email) {
      errors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!userData.password) {
      errors.password = "Please enter your password.";
    } else if (userData.password.length < 8) {
      errors.password = "Password must have at least 8 characters.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(userData.password)) {
      errors.password = "Password must include uppercase, lowercase, number & special character.";
    }

    if (!userData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (userData.confirmPassword !== userData.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  };

  // 🟢 Form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
      };

      const res = await axios.post("/api/signup",
        payload
      );

      console.log("Response:", res);

      if (res.data.status === 200) {
        toast.success(res.data.message || "Registration successful!");

        setUserData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setFormErrors({});

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-background bg-[url('/img/background.jpg')] bg-cover bg-center">
        <ToastContainer position="top-right" />
        <div className="w-full max-w-md p-5 space-y-6 bg-foreground rounded-lg shadow-lg mt-28 mb-12 m-10 custom-margin-top-AuthForm">
          <h2 className="text-2xl font-bold text-center text-background">Register</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4 grid">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-background" />
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-foreground border-background text-white placeholder-gray-400"
                placeholder="Enter your full name"
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-background" />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-foreground border-background text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-background" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-20 py-2 border rounded-lg bg-foreground border-background text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-2 text-sm text-white hover:underline focus:outline-none"
              >
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-background" />
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-20 py-2 border rounded-lg bg-foreground border-background text-white placeholder-gray-400"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                className="absolute right-3 top-2 text-sm text-white hover:underline focus:outline-none"
              >
                {isConfirmPasswordVisible ? "Hide" : "Show"}
              </button>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 font-semibold justify-self-center py-2 text-background hover:text-background bg-foreground border hover:border-white rounded-lg hover:bg-foreground focus:outline-none"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-background">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white hover:underline focus:outline-none">
                <strong>Login</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthForm;
