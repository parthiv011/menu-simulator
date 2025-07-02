import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'small';

export const Button = ({
  children,
  disabled,
  to,
  type = 'primary',
}: {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type?: ButtonVariant;
}) => {
  const base =
    'inline-block rounded-full bg-yellow-400 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed ';

  const styles: Record<ButtonVariant, string> = {
    primary: base + 'px-4 py-3 sm:px-6 sm:py-4',
    small: base + 'py-2 md:px-5 md:py-2.5 text-xs',
  };

  const className = styles[type] || styles.primary;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} disabled={disabled}>
      {children}
    </button>
  );
};
