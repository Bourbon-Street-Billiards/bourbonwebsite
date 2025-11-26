import styles from './Skeleton.module.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    style?: React.CSSProperties;
}

export default function Skeleton({ width, height, className = '', variant = 'rect', style = {} }: SkeletonProps) {
    const combinedStyle = {
        width: width,
        height: height,
        ...style,
    };

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={combinedStyle}
        />
    );
}
