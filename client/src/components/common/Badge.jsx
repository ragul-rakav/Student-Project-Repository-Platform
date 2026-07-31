import React from 'react';

export function BadgeType({ type }) {
  if (type === 'Internal') return <span className="badge badge-gray">Internal</span>;
  if (type === 'External') return <span className="badge badge-gray">External</span>;
  if (type === 'Enhancement') return <span className="badge badge-blue">Enhancement</span>;
  return <span className="badge badge-amber">Idea</span>;
}

export function BadgeStatus({ status }) {
  if (status === 'Approved') return <span className="badge badge-green">Approved</span>;
  if (status === 'In Review') return <span className="badge badge-blue">In Review</span>;
  if (status === 'Pending Guide') return <span className="badge badge-amber">Pending Guide</span>;
  if (status === 'Guide Declined') {
    return (
      <span className="badge" style={{ background: 'rgba(244,63,94,0.12)', color: '#fb7185', borderColor: 'rgba(244,63,94,0.25)' }}>
        Guide Declined
      </span>
    );
  }
  return null;
}
