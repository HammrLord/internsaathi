/**
 * @file page.js (dashboard)
 * @description Main recruiter dashboard with analytics and activity
 * @keywords dashboard, analytics, stats, metrics, report, overview, home
 * 
 * Search tags:
 * - dashboard: main dashboard, home page
 * - analytics: charts, statistics, insights
 * - report: download PDF, recruitment report
 * - stats: candidate count, interview count
 * - allocation: allocation engine, match scores
 * - activity: recent activity, notifications
 * - socket: real-time updates, live notifications
 */
'use client';

import { Users, UserCheck, Clock, Video, TrendingUp, MapPin, Award } from 'lucide-react';
import StatCard from '@/components/StatCard';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import Link from 'next/link';
import { candidates } from '@/data/candidates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server (same host for recruiter portal)
    // In production, this might need dynamic URL handling, but relative path works if served from same origin
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('application_received_notification', (data) => {
      console.log('New application received!', data);
      // Refresh data to show new stats
      router.refresh();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [router]);

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const element = document.getElementById('dashboard-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add Dashboard Screenshot
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Add Top 10 Candidates Page
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Top 10 Candidates Report', 14, 20);

      const topCandidates = [...candidates]
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10)
        .map(c => [
          c.name,
          c.role,
          `${c.matchScore}%`,
          c.location,
          c.education,
          c.status
        ]);

      autoTable(pdf, {
        head: [['Name', 'Role', 'Match', 'Location', 'Education', 'Status']],
        body: topCandidates,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 163, 74] } // Green header
      });

      // Add Job Info Summary
      const finalY = pdf.lastAutoTable.finalY || 30;
      pdf.setFontSize(14);
      pdf.text('Job Statistics Summary', 14, finalY + 20);
      pdf.setFontSize(10);
      pdf.text([
        `Total Active Jobs: 12`,
        `Total Applications: ${candidates.length}`,
        `Average Match Score: ${Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length)}%`,
        `Top Skill in Demand: Product Strategy`
      ], 14, finalY + 30);

      pdf.save('recruitment-report.pdf');
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download report: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="dashboard-container" id="dashboard-content">
      <div className="dashboard-bg"></div>
      <div className="watermark" data-html2canvas-ignore="true"></div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your recruitment activities.</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Generating...' : 'Download Report'}
          </button>
          <Link href="/jobs/new" className="btn btn-primary">Post New Job</Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Candidates"
          value="1,240"
          change="12"
          trend="up"
          icon={Users}
          color="#6366f1"
          href="/candidates"
        />
        <StatCard
          title="Shortlisted"
          value="85"
          change="5"
          trend="up"
          icon={UserCheck}
          color="#10b981"
          href="/candidates?status=Shortlisted"
        />
        <StatCard
          title="Pending Review"
          value="42"
          change="2"
          trend="down"
          icon={Clock}
          color="#f59e0b"
          href="/candidates?status=Pending Review"
        />
        <StatCard
          title="Interviews Done"
          value="128"
          change="8"
          trend="up"
          icon={Video}
          color="#8b5cf6"
          href="/interviews"
        />
      </div>

      <div className="dashboard-grid">
        <div className="card allocation-engine">
          <div className="card-header">
            <h2>Allocation Engine Analytics</h2>
            <Link href="/analytics" className="btn-link text-primary font-medium hover:underline">View Details</Link>
          </div>

          <div className="allocation-stats">
            <div className="stat-row">
              <div className="stat-info">
                <span className="label">High Match Score (&gt;90%)</span>
                <span className="value">342 Candidates</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: '65%', backgroundColor: 'var(--success)' }}></div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-info">
                <span className="label">Medium Match Score (70-90%)</span>
                <span className="value">518 Candidates</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: '45%', backgroundColor: 'var(--warning)' }}></div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-info">
                <span className="label">Location Match</span>
                <span className="value">89% Alignment</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: '89%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          </div>

          <div className="insights-grid">
            <div className="insight-item">
              <MapPin size={20} className="insight-icon" />
              <div>
                <h4>Location Proximity</h4>
                <p>320 candidates within 10km</p>
              </div>
            </div>
            <div className="insight-item">
              <Award size={20} className="insight-icon" />
              <div>
                <h4>Skill Alignment</h4>
                <p>Top skill: Product Strategy</p>
              </div>
            </div>
            <div className="insight-item">
              <TrendingUp size={20} className="insight-icon" />
              <div>
                <h4>Conversion Rate</h4>
                <p>12% from application to interview</p>
              </div>
            </div>
          </div>
          <AnalyticsCharts />
        </div>

        <div className="card recent-activity">
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-list">
            {[
              { id: 1, name: "Aarav Patel", initials: "AP", time: "2 hours ago" },
              { id: 2, name: "Priya Sharma", initials: "PS", time: "3 hours ago" },
              { id: 3, name: "Rohan Gupta", initials: "RG", time: "5 hours ago" },
              { id: 4, name: "Ananya Singh", initials: "AS", time: "1 day ago" }
            ].map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">
                  <span className="initials">{activity.initials}</span>
                </div>
                <div className="activity-content">
                  <p className="activity-text"><strong>{activity.name}</strong> completed AI Interview</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <span className="status-badge success">Passed</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 350px;
          background-image: url('/pm_modi_banner.png');
          background-size: cover;
          background-position: center;
          z-index: 0;
          opacity: 1;
        }

        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
          min-height: 100vh;
          padding: 380px 2rem 2rem 2rem;
        }

        .watermark {
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background-image: url('/assets/gov-india-emblem.svg');
          background-repeat: no-repeat;
          background-position: top right;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #4b5563;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        /* Translucent Button Styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }

        .btn-outline {
          background-color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #000000;
        }
        .btn-outline:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }

        .btn-primary {
          background-color: rgba(255, 153, 51, 0.8); /* Translucent Orange */
          color: white;
          border: 1px solid rgba(255, 153, 51, 0.5);
        }
        .btn-primary:hover {
          background-color: rgba(255, 153, 51, 0.9);
        }


        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .card {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 231, 235, 0.5);
          border-radius: var(--radius);
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000000;
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-weight: 500;
        }

        .allocation-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #374151;
        }

        .progress-bar {
          height: 8px;
          background-color: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          border-radius: 4px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .insight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .insight-icon {
          color: var(--primary);
          margin-top: 2px;
        }

        .insight-item h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #000000;
        }

        .insight-item p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: var(--radius);
          background-color: #f9fafb;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          background-color: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--primary);
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          color: #000000;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .status-badge.success {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }
      `}</style>
    </div>
  );
}
