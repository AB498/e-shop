'use client';

export default function PageHeader({ title }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}
