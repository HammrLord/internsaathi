'use client';

import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, trend, trendValue, icon: Icon, color, href }) {
  const isPositive = trend === 'up';

  const CardContent = () => (
    <div className={`stat-card ${href ? 'clickable' : ''}`}>
      <div className="card-ribbon"></div>
      <div className="card-header">
        <div className="icon-wrapper" style={{ backgroundColor: `var(--${color}-light, rgba(5, 74, 145, 0.1))` }}>
          <Icon size={20} color={`var(--${color}, var(--chakra))`} />
        </div>
        {trend && (
          <div className={`trend-badge ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>

      <style jsx>{`
        .stat-card {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 231, 235, 0.5);
          border-radius: var(--radius);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          height: 100%;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .stat-card.clickable {
          cursor: pointer;
        }

        .card-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary), var(--secondary));
          opacity: 0.8;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trend-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .trend-badge.positive {
          background-color: rgba(19, 136, 8, 0.1);
          color: var(--success);
        }

        .trend-badge.negative {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-title {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }
      `}</style>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none' }}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
