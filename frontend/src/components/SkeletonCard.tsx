interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`glass-red p-6 rounded-2xl border border-red-500/20 ${className}`}>
      <div className="skeleton h-48 w-full rounded-xl mb-4" />
      <div className="skeleton h-6 w-3/4 rounded mb-3" />
      <div className="skeleton h-4 w-full rounded mb-2" />
      <div className="skeleton h-4 w-5/6 rounded" />
    </div>
  );
}
