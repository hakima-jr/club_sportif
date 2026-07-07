import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  style = {},
  fullWidth = false,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-fast)',
    border: '1px solid transparent',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    ...style,
  };

  // Size variations
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 18px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '16px' },
  };

  // Variant variations
  const variantStyles = {
    primary: {
      background: 'var(--primary)',
      color: '#ffffff',
      borderColor: 'var(--primary)',
    },
    secondary: {
      background: 'var(--bg-surface-hover)',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-color)',
    },
    danger: {
      background: 'var(--danger)',
      color: '#ffffff',
      borderColor: 'var(--danger)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
  };

  // Hover state handling (using a simple inline style approach since we are migrating from inline styles, 
  // but preferably this should be handled by a CSS module or global classes. We will use onMouseEnter/Leave for pure inline)
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => !disabled && setIsHovered(false);

  let hoverStyle = {};
  if (isHovered) {
    if (variant === 'primary') hoverStyle = { background: 'var(--primary-hover)', borderColor: 'var(--primary-hover)', transform: 'translateY(-1px)', boxShadow: 'var(--shadow-md)' };
    if (variant === 'secondary') hoverStyle = { background: 'var(--border-color)', transform: 'translateY(-1px)', boxShadow: 'var(--shadow-sm)' };
    if (variant === 'danger') hoverStyle = { background: 'var(--danger-hover)', borderColor: 'var(--danger-hover)', transform: 'translateY(-1px)', boxShadow: 'var(--shadow-md)' };
    if (variant === 'ghost') hoverStyle = { background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' };
  }

  const combinedStyle = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...hoverStyle,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyle}
      className={`ll-btn ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
