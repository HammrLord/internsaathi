'use client';

import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import Link from 'next/link';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function AnalyticsPage() {
    const matchScoreData = {
        labels: ['90-100%', '80-90%', '70-80%', '60-70%', '<60%'],
        datasets: [
            {
                label: 'Candidate Distribution',
                data: [342, 410, 108, 250, 130],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(107, 114, 128, 0.8)',
                ],
            },
        ],
    };

    const skillGapData = {
        labels: ['Python', 'Product Strategy', 'Data Analysis', 'Communication', 'Project Mgmt'],
        datasets: [
            {
                label: 'Required Skill Level',
                data: [90, 85, 80, 95, 75],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
                label: 'Average Candidate Level',
                data: [70, 65, 75, 80, 60],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
            },
        ],
    };

    const funnelData = {
        labels: ['Applied', 'Screened', 'Interviewed', 'Shortlisted', 'Hired'],
        datasets: [
            {
                label: 'Conversion Funnel',
                data: [1240, 850, 128, 85, 20],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#10b981',
                    '#f59e0b',
                ],
            },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detailed Analytics</h1>
                        <p className="text-gray-500">Deep dive into recruitment metrics and candidate insights.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        <Download size={18} />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Match Score Distribution</h3>
                    <Bar data={matchScoreData} options={{ responsive: true }} />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Skill Gap Analysis</h3>
                    <Line data={skillGapData} options={{ responsive: true }} />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Recruitment Funnel</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={funnelData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Demographics</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut
                            data={{
                                labels: ['Male', 'Female', 'Other'],
                                datasets: [{
                                    data: [55, 40, 5],
                                    backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6']
                                }]
                            }}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Time to Hire Trend (Days)</h3>
                    <div className="h-48">
                        <Line
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                datasets: [{
                                    label: 'Avg Days to Hire',
                                    data: [45, 42, 38, 35, 30, 28],
                                    borderColor: '#10b981',
                                    tension: 0.4,
                                    fill: true,
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)'
                                }]
                            }}
                            options={{ responsive: true, maintainAspectRatio: false }}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Insights</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <h4 className="font-medium text-green-800 mb-1">High Quality Candidates</h4>
                            <p className="text-sm text-green-700">27% of candidates have a match score above 90%, which is 5% higher than last month.</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-800 mb-1">Location Preference</h4>
                            <p className="text-sm text-blue-700">Bangalore and Mumbai continue to be the top preferred locations for candidates.</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <h4 className="font-medium text-orange-800 mb-1">Skill Shortage</h4>
                            <p className="text-sm text-orange-700">There is a noticeable gap in "Product Strategy" skills among entry-level applicants.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
