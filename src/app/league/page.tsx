import styles from './page.module.scss';
import { getData } from '@/lib/data';

export default async function LeaguePage() {
    const { league } = await getData();
    return (

        <main className={styles['league']}>
            <h1 className={styles['league__title']}>League Standings</h1>
            <div className={styles['league__table-wrapper']}>
                <table className={styles['league__table']}>
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
                                <td className={styles['league__rank']}>{team.rank}</td>
                                <td className={styles['league__team']}>{team.team}</td>
                                <td>{team.played}</td>
                                <td>{team.won}</td>
                                <td>{team.lost}</td>
                                <td className={styles['league__points']}>{team.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
