import styles from './page.module.css';
import { getData } from '@/lib/data';

export default async function LeaguePage() {
    const { league } = await getData();
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
                        {league.map((team) => (
                            <tr key={team.rank}>
                                <td className={styles.rank}>{team.rank}</td>
                                <td className={styles.team}>{team.team}</td>
                                <td>{team.played}</td>
                                <td>{team.won}</td>
                                <td>{team.lost}</td>
                                <td className={styles.points}>{team.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
