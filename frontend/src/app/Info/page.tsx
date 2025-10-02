"use client";

import { useEffect, useState } from "react";

interface ReportData {
    totalUsers: number;
    totalMovies: number;
    totalReservations: number;
    totalTransactions: number;
    totalRevenue: number;
}

export default function AdminReports() {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("token");
            if (!token) return alert("You are not authorized");

            try {
                const res = await fetch("https://moviesbooking-8.onrender.com/api/admin/reports", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Failed to fetch reports");

                const data = await res.json();
                setReport(data);
            } catch (err) {
                console.error(err);
                alert("Error fetching reports");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <Loader />;

    if (!report) return <p className="text-white text-center mt-20">No data found</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
            <h1 className="text-4xl font-bold text-center mb-8">📊 Admin Reports Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ReportCard title="👤 Total Users" value={report.totalUsers} />
                <ReportCard title="🎬 Total Movies" value={report.totalMovies} />
                <ReportCard title="🎟️ Reservations" value={report.totalReservations} />
                <ReportCard title="💳 Transactions" value={report.totalTransactions} />
                <ReportCard title="💰 Revenue" value={`₹ ${report.totalRevenue}`} highlight />
            </div>
        </div>
    );
}

function ReportCard({ title, value, highlight = false }: { title: string; value: string | number; highlight?: boolean }) {
    return (

        <div>
            <div
                className={`p-6 rounded-xl shadow-lg text-center backdrop-blur-md bg-white/10 border ${highlight ? "border-yellow-400" : "border-white/20"
                    } hover:scale-105 transition-transform`}
            >
                <h2 className="text-lg font-semibold opacity-90">{title}</h2>
                <p className={`text-3xl font-bold mt-2 ${highlight ? "text-yellow-400" : "text-white"}`}>{value}</p>
            </div>
        </div>);
}

function Loader() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
}
