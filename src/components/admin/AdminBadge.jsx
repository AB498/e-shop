'use client';

export default function AdminBadge({ color, text, size = 'md' }) {
  // Define color classes
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#E6F2EF] text-[#006B51]'
  };

  // Define size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const colorClass = colorClasses[color] || colorClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {text}
    </span>
  );
}
