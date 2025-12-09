'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
    { name: 'Communication', score: 85 },
    { name: 'Technical', score: 72 },
    { name: 'Problem Solving', score: 90 },
    { name: 'Culture Fit', score: 88 },
];

const pieData = [
    { name: 'High Match', value: 342, color: '#10b981' },
    { name: 'Medium Match', value: 518, color: '#f59e0b' },
    { name: 'Low Match', value: 120, color: '#ef4444' },
];

export default function AnalyticsCharts() {
    return (
        <div className="analytics-charts">
            <div className="chart-card">
                <h3>Average Candidate Performance</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#000000" fontSize={12} tickLine={false} axisLine={false} tick={false} label={{ value: 'Performance Metrics', position: 'insideBottom', offset: -5, fill: '#000000', fontSize: 12, fontWeight: 600 }} />
                            <YAxis stroke="#000000" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#000000' }}
                                labelStyle={{ color: '#000000' }}
                                cursor={{ fill: '#f1f5f9' }}
                            />
                            <Bar dataKey="score" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-card">
                <h3>Match Distribution</h3>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#000000' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="legend">
                        {pieData.map((entry, index) => (
                            <div key={index} className="legend-item">
                                <div className="dot" style={{ backgroundColor: entry.color }}></div>
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .analytics-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .chart-card {
          border: 1px solid #000000;
          border-radius: var(--radius);
          padding: 1.5rem;
        }

        .chart-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #111827;
        }

        .chart-container {
          width: 100%;
          position: relative;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 0;
          padding-bottom: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #000000;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
        </div>
    );
}
