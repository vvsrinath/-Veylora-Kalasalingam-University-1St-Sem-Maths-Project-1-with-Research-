import React from 'react';
import { buttonClasses, ButtonVariant, ButtonTheme, ButtonSize } from './buttonStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  size?: ButtonSize;
}

export function Button({ variant = 'primary', theme = 'dark', size = 'md', className = '', ...props }: ButtonProps) {
  return <button className={`${buttonClasses(variant, theme, size)} ${className}`} {...props} />;
}