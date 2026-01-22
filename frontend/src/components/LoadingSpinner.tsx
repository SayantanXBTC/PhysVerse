interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 gpu-accelerated">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin gpu-accelerated`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-red-400 rounded-full animate-spin gpu-accelerated`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-red-500/10 rounded-full blur-xl animate-pulse`}></div>
      </div>
      {text && (
        <p className="text-gray-400 text-sm animate-pulse smooth-opacity">{text}</p>
      )}
    </div>
  );
}
