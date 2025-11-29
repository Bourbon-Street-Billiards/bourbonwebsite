import styles from './Button.module.css';
import Link from 'next/link';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline';
    className?: string;
    disabled?: boolean;
}

export default function Button({ children, href, onClick, variant = 'primary', className = '', disabled }: ButtonProps) {
    const rootClassName = `${styles.button} ${styles[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={rootClassName}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={rootClassName} disabled={disabled}>
            {children}
        </button>
    );
}
