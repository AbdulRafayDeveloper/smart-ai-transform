"use client";
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Loading from "../../components/Loading";
import LinkingWithSidebar from "../../components/LinkingWithSidebar";
import Header from "../../components/Header";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 5;
    const token = Cookies.get("access_token");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async (query = "", page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `/api/speech-to-text?search=${query}&pageNumber=${page}&pageSize=${perPage}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const apiData = res.data?.data;
            if (apiData?.users) {
                setData(apiData.users);
                setTotalPages(Math.ceil(apiData.totalUsersCount / perPage));
                setCurrentPage(apiData.pageNumber);
            } else {
                setData([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilter = () => {
        fetchData(searchQuery, 1);
    };

    const handleClear = () => {
        setSearchQuery("");
        fetchData("", 1);
    };

    const handlePageChange = ({ selected }) => {
        const newPage = selected + 1;
        fetchData(searchQuery, newPage);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await axios.delete(`/api/speech-to-text/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data?.status === 200) {
                toast.success(res.data?.message || "User deleted successfully!");
                fetchData(searchQuery, currentPage);
            } else {
                toast.error(res.data?.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting");
        } finally {
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <ToastContainer />
            <LinkingWithSidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Header />
                <div className="flex-1 mt-[68px] lg:ml-64 ml-20 p-6">
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-3xl font-semibold text-gray-800">Voice-to-Text Makers</h2>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground transition w-full sm:w-60"
                                />
                                <button
                                    onClick={handleFilter}
                                    className="bg-foreground text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                                >
                                    Search
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                <div className="overflow-x-auto rounded-lg shadow">
                                    <table className="min-w-full text-sm text-gray-700 bg-white rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                            <tr>
                                                <th className="py-3 px-4 text-left">#</th>
                                                <th className="py-3 px-4 text-left">Email</th>
                                                <th className="py-3 px-4 text-left">Created At</th>
                                                <th className="py-3 px-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length > 0 ? (
                                                data.map((user, index) => (
                                                    <tr
                                                        key={user._id}
                                                        className="border-b hover:bg-gray-50 transition"
                                                    >
                                                        <td className="py-3 px-4">{(currentPage - 1) * perPage + index + 1}</td>
                                                        <td className="py-3 px-4 break-all">{user.email}</td>
                                                        <td className="py-3 px-4">
                                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <button
                                                                onClick={() => openDeleteModal(user._id)}
                                                                className="text-red-600 hover:text-red-800 transition"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-gray-500">
                                                        No records found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-6 flex justify-center">
                                        <ReactPaginate
                                            previousLabel={"←"}
                                            nextLabel={"→"}
                                            breakLabel={"..."}
                                            pageCount={totalPages}
                                            forcePage={currentPage - 1}
                                            marginPagesDisplayed={1}
                                            pageRangeDisplayed={2}
                                            onPageChange={handlePageChange}
                                            containerClassName="flex gap-2"
                                            pageClassName="px-3 py-1 rounded border hover:bg-gray-200 transition"
                                            activeClassName="bg-foreground text-white"
                                            previousClassName="px-3 py-1 rounded border hover:bg-gray-200 transition"
                                            nextClassName="px-3 py-1 rounded border hover:bg-gray-200 transition"
                                            breakClassName="px-3 py-1 rounded border"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modern Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Delete User</h2>
                        <p className="text-gray-600 mb-5">Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
