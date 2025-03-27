"use client";
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Loading from '../../components/Loading';
import LinkingWithSidebar from '../../components/LinkingWithSidebar';
import Header from '../../components/Header';

import PaginationComponent from '../../components/PaginationComponent';

function Page() {
    const [data, setData] = useState([]); // Mock data for demonstration
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 12;

    // Mock data for simplicity
    useEffect(() => {
        const mockData = [
            { _id: 1, email: "example1@mail.com", createdAt: new Date() },
            { _id: 2, email: "example2@mail.com", createdAt: new Date() },
            { _id: 3, email: "example3@mail.com", createdAt: new Date() }
        ];
        setData(mockData);
        setTotalPages(1);
    }, []);

    const handleFilter = () => {};
    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="flex h-screen">
            <LinkingWithSidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Header />
                <div className="flex-1 bg-gray-100 mt-[68px] lg:ml-64 ml-20">
                    <div className="bg-white mt-3 rounded-lg shadow-lg mr-2 mb-2">
                        <div className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-4 sm:px-0">
                                <h2 className="text-2xl font-medium text-black mb-2 sm:mb-0">List of Users</h2>
                                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search Email"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white px-3 py-1 w-full sm:w-52 border border-black text-gray-700 mb-2 sm:mb-0 sm:mr-2"
                                    />
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={handleFilter}
                                            className="bg-foreground text-white px-3 py-1 rounded-md flex-1"
                                        >
                                            Search
                                        </button>
                                        <button
                                            onClick={handleClear}
                                            className="bg-foreground text-white px-3 py-1 rounded-md flex-1"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-[500px] bg-white rounded-sm shadow-lg overflow-hidden">
                                    <thead className="font-bold">
                                        <tr>
                                            <th className="py-3 p-1 border border-gray-300 w-[4%]"  style={{ width: "4%" }}>Sr#</th>
                                            <th className="py-3 p-1 border border-gray-300 w-[15%]" style={{ width: "15%" }}>Email</th>
                                            <th className="py-3 p-1 border border-gray-300 w-[10%]" style={{ width: "15%" }}>Date</th>
                                            <th className="py-3 p-1 border border-gray-300 w-[10%]" style={{ width: "15%" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((element, index) => (
                                                <tr className="hover:bg-gray-100" key={element._id}>
                                                    <td className="text-center border border-gray-300 text-foreground py-3 p-1">{index + 1}</td>
                                                    <td className="text-center border border-gray-300 text-foreground py-3 p-1">{element.email}</td>
                                                    <td className="text-center border border-gray-300 text-foreground py-3 p-1">
                                                        {new Date(element.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="text-center border border-gray-300 p-1">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button className="text-foreground hover:text-blue-800">
                                                                <FaEdit />
                                                            </button>
                                                            <button className="text-foreground hover:text-red-800">
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center border border-gray-300 text-foreground p-1">
                                                    No records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationComponent count={totalPages} page={currentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;
