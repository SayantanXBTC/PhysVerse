interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = 'or continue with email' }: AuthDividerProps) {
  return (
    <div className="relative my-6" aria-hidden={false}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-700/60"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 text-xs uppercase tracking-widest text-gray-500 bg-transparent">
          {label}
        </span>
      </div>
    </div>
  );
}
