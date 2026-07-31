import React from 'react';
import Icon from './Icons';

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <Icon name="check" size={16} /> {message}
    </div>
  );
}

export function EmptyState({ msg, ic = 'search2' }) {
  return (
    <div className="empty">
      <Icon name={ic} size={30} />
      <div>{msg}</div>
    </div>
  );
}
