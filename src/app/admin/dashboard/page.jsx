"use client";
import React, { useState, useEffect } from "react";
import LinkingWithSidebar from "../components/LinkingWithSidebar";
import Header from "../components/Header";
import {
  FaUsers,
  FaImage,
  FaMicrophone,
  FaPaintBrush,
  FaVolumeUp,
  FaVideo
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

function Page() {
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState([]);

  const token = Cookies.get("access_token");

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await axios.get(`/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data?.data;

        if (!data) {
          toast.error(response.data.message || "Failed to fetch stats.");
          return;
        }

        // Array bana do har card ke liye
        const cards = [
          {
            title: "Total Users",
            value: data.totalUsers,
            icon: <FaUsers />,
          },
          {
            title: "Image to Text Users",
            value: data.totalImageToTextUsers,
            icon: <FaImage />,
          },
          {
            title: "Speech to Text Users",
            value: data.totalSpeechToTextUsers,
            icon: <FaMicrophone />,
          },
          {
            title: "Text to Image Users",
            value: data.totalTextToImageUsers,
            icon: <FaPaintBrush />,
          },
          {
            title: "Text to Speech Users",
            value: data.totalTextToSpeechUsers,
            icon: <FaVolumeUp />,
          },
          {
            title: "Text to Video Users",
            value: data.totalTextToVideoUsers,
            icon: <FaVideo />,
          },
        ];

        setStats(cards);
      } catch (error) {
        console.log("Error fetching stats:", error);
        toast.error(error.response?.data?.message || "Failed to fetch stats.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen">
      <LinkingWithSidebar />
      <Header />
      <div className="flex-1 flex flex-col overflow-auto ml-10 lg:ml-64 mt-6">
        <div className="flex-1 bg-gray-100 mt-12 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((card, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-md text-foreground bg-white ${statsLoading ? "opacity-50" : ""
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{card.icon}</div>
                  <div>
                    <h2 className="text-lg font-bold">{card.title}</h2>
                    <p className="text-2xl font-bold">{card.value ?? "0"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
