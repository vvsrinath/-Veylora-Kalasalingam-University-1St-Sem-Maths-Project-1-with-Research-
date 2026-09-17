export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonTheme = 'dark' | 'light';
export type ButtonSize = 'md' | 'lg' | 'sm';

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base'
};

export function buttonClasses(variant: ButtonVariant = 'primary', theme: ButtonTheme = 'dark', size: ButtonSize = 'md') {
  const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-navy hover:bg-accent/90 active:bg-accent/80',
    danger: 'bg-danger text-white hover:bg-danger/90 active:bg-danger/80',
    outline:
    theme === 'dark' ?
    'border border-white/20 text-soft hover:bg-white/5 active:bg-white/10' :
    'border border-lightborder text-lighttext hover:bg-black/5 active:bg-black/10',
    ghost:
    theme === 'dark' ?
    'text-soft hover:bg-white/5 active:bg-white/10' :
    'text-lighttext hover:bg-black/5 active:bg-black/10'
  };

  return `${base} ${SIZE[size]} ${variants[variant]}`;
}