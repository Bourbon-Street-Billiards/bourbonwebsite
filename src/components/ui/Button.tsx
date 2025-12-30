import styles from './Button.module.scss';
import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline' | 'disabled' | 'delete';
    className?: string;
    disabled?: boolean;
}

export default function Button({ children, href, onClick, variant = 'primary', className = '', disabled }: ButtonProps) {
    const rootClassName = `${styles.button} ${styles[`button--${variant}`]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={rootClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={rootClassName + (disabled ? ' ' + styles['button--disabled'] : '')} disabled={disabled}>
            {children}
        </button>
    );
}
