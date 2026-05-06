export function Card({ className = "", children, ...rest }) {
  return (
    <div className={`bg-white ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}
