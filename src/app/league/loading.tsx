import styles from './page.module.css';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>League Standings</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Lost</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                                <td className={styles.rank}><Skeleton width={30} height={20} /></td>
                                <td className={styles.team}><Skeleton width={150} height={20} /></td>
                                <td><Skeleton width={40} height={20} /></td>
                                <td><Skeleton width={40} height={20} /></td>
                                <td><Skeleton width={40} height={20} /></td>
                                <td className={styles.points}><Skeleton width={40} height={20} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
