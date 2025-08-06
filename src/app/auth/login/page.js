"use client";

import { useState } from "react";
import { FaLock } from "react-icons/fa";
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

  // 🟢 Professional & clear state names
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // 🟢 Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // 🟢 Validation function
  const validateInputs = (data) => {
    const errors = {};

    if (!data.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Please enter a valid email format.";
    }

    if (!data.password) {
      errors.password = "Please enter your password.";
    } else if (data.password.length < 8) {
      errors.password = "Password must have at least 8 characters.";
    }

    return errors;
  };

  // 🟢 Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = validateInputs(credentials);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      toast.error("Please fix the errors in the form.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/signin",
        credentials
      );

      if (response.data.status === 200) {
        toast.success(response.data.message || "Login successful!");
        const { token, user } = response.data.data;

        Cookies.set("access_token", token, { expires: 9999, sameSite: "Strict" });
        Cookies.set("user_id", user._id, { expires: 9999, sameSite: "Strict" });
        Cookies.set("user_role", user.role, { expires: 9999, sameSite: "Strict" });
        Cookies.set("full_name", user.fullName, { expires: 9999, sameSite: "Strict" });

        console.log("Token:", token);
        console.log("User Role:", user.role);

        setCredentials({
          email: "",
          password: "",
        });

        setTimeout(() => {
          if (user.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 3000);
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen  bg-green-50 bg-cover bg-center">
        <ToastContainer position="top-right" />
        <div className="w-full max-w-md p-5 space-y-6 bg-foreground rounded-lg shadow-lg mt-28 mb-12 sm:mt-10 sm:mb-10 m-10 custom-margin-top-AuthForm">
          <h2 className="text-2xl font-bold text-center text-background">Login</h2>

          <form onSubmit={handleFormSubmit} className="space-y-4 grid">
            <div className="relative">
              <MdEmail className="absolute left-3 top-3 text-background" />
              <input
                type="email"
                name="email"
                value={credentials.email}
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
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-20 py-2 border rounded-lg bg-foreground border-background text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="text-white absolute right-3 top-2 text-sm hover:underline focus:outline-none"
              >
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-12 font-semibold justify-self-center py-2 text-background hover:text-background bg-foreground border hover:border-white rounded-lg hover:bg-foreground focus:outline-none"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-background">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-white hover:underline focus:outline-none">
                <strong>Register</strong>
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
