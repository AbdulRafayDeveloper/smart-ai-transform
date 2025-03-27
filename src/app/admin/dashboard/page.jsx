"use client";
import React, { useState } from "react";
import LinkingWithSidebar from "../components/LinkingWithSidebar";
import Header from "../components/Header";
import { FaUsers, FaCamera, FaTicketAlt, FaDatabase } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components with ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Page() {
  const [data, setData] = useState([]);

  const cardData = [
    {
      title: "User",
      count: "500",
      percentage: "60%",
      icon: <FaUsers />,
      color: "bg-foreground",
    },
    {
      title: "Camera",
      count: "600",
      percentage: "60%",
      icon: <FaCamera />,
      color: "bg-foreground",
    },
    {
      title: "Submitted Ticket",
      count: "400",
      percentage: "60%",
      icon: <FaTicketAlt />,
      color: "bg-foreground",
    },
  ];

  // Generate random user data for the graph
  const generateRandomData = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 500) + 100); // Random data between 100 and 600
  };

  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Users per Month",
        data: generateRandomData(), 
        borderColor: "#22405c", 
        backgroundColor: "rgba(34, 64, 92, 0.2)", 
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex h-screen">
      <LinkingWithSidebar />
      <Header />
      <div className="flex-1 flex flex-col overflow-auto ml-10 lg:ml-64 mt-6">
        <div className="flex-1 bg-gray-100 mt-12 p-8">
          <h1 className="text-3xl font-bold mb-8 ">Dashboard</h1>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-md ${card.color} text-white`}
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-4xl">{card.icon}</div>
                    <h2 className="text-lg font-bold">{card.title}</h2>
                    <p className="text-2xl font-bold">{card.count}</p>
                    <p className="text-sm">Present user {card.percentage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Line Chart */}
        </div>
          <div className=" mb-4 pl-7 pr-[5px] md:px-10 ">
            <h2 className="text-xl font-bold py-1">Users per Month</h2>
            <div className="bg-white rounded-lg shadow-md w-full max-w-6xl min-w-[277px] min-h-[120px] p-0 md:p-3">
              <Line data={chartData} height={130}  /> 
            </div>
          </div>
      </div>
    </div>
  );
}

export default Page;
