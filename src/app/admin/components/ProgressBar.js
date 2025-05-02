'use client';

export default function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  size = 'md',
  showLabel = true,
  labelPosition = 'right',
  className = ''
}) {
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Define colors based on the provided color
  const colors = {
    blue: 'bg-[#006B51]',
    green: 'bg-[#006B51]',
    purple: 'bg-[#006B51]',
    amber: 'bg-[#006B51]',
    red: 'bg-red-500',
    primary: 'bg-[#006B51]',
    // Add gradient versions
    'blue-gradient': 'bg-gradient-to-r from-[#006B51] to-[#008B6A]',
    'green-gradient': 'bg-gradient-to-r from-[#006B51] to-[#008B6A]',
    'purple-gradient': 'bg-gradient-to-r from-[#006B51] to-[#008B6A]',
    'amber-gradient': 'bg-gradient-to-r from-[#006B51] to-[#008B6A]',
    'red-gradient': 'bg-gradient-to-r from-red-600 to-red-400',
    'primary-gradient': 'bg-gradient-to-r from-[#006B51] to-[#008B6A]',
  };

  // Define sizes
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  // Get the appropriate color and size classes
  const colorClass = colors[color] || colors.blue;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center ${className}`}>
      {showLabel && labelPosition === 'left' && (
        <span className="mr-2 text-xs font-medium text-gray-700">{percentage.toFixed(0)}%</span>
      )}

      <div className={`flex-grow overflow-hidden rounded-full bg-gray-200 ${sizeClass}`}>
        <div
          className={`${sizeClass} rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {showLabel && labelPosition === 'right' && (
        <span className="ml-2 text-xs font-medium text-gray-700">{percentage.toFixed(0)}%</span>
      )}
    </div>
  );
}
