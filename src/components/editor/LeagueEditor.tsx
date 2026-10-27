'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import EditorModal from '@/components/editor/EditorModal';
import type { LeagueTeam } from '@/lib/data';
import styles from '@/app/panel/page.module.scss';
import { LIMITS } from '@/lib/validation';

interface LeagueEditorProps {
    league: LeagueTeam[];
    onChange: (league: LeagueTeam[]) => void;
    loading: boolean;
    saving: boolean;
}

export default function LeagueEditor({ league, onChange, loading, saving }: LeagueEditorProps) {
    const [teamModal, setTeamModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        index?: number;
        data: LeagueTeam;
    }>({
        isOpen: false,
        mode: 'add',
        data: { rank: 0, team: '', points: 0, played: 0, won: 0, lost: 0 }
    });

    const openAddTeam = () => {
        setTeamModal({
            isOpen: true,
            mode: 'add',
            data: { rank: league.length + 1, team: '', points: 0, played: 0, won: 0, lost: 0 }
        });
    };

    const openEditTeam = (index: number, team: LeagueTeam) => {
        setTeamModal({
            isOpen: true,
            mode: 'edit',
            index,
            data: { ...team }
        });
    };

    const closeTeamModal = () => {
        setTeamModal({ ...teamModal, isOpen: false });
    };

    const saveTeam = () => {
        const { index, mode } = teamModal;
        const data = { ...teamModal.data, team: teamModal.data.team.trim() };
        if (!data.team) return;

        const newLeague = [...league];
        if (mode === 'add') {
            newLeague.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newLeague[index] = data;
        }
        newLeague.sort((a, b) => a.rank - b.rank);
        onChange(newLeague);
        closeTeamModal();
    };

    const deleteTeam = (index: number) => {
        if (confirm('Delete this team?')) {
            const newLeague = league.filter((_, i) => i !== index);
            onChange(newLeague);
        }
    };


    return (
        <div>
            <Button disabled={loading || saving} onClick={openAddTeam} variant="outline" className={styles['add-button']}>Add Team</Button>

            {teamModal.isOpen && (
                <EditorModal title={teamModal.mode === 'add' ? 'Add Team' : 'Edit Team'} onClose={closeTeamModal}>
                    <div className={styles['form-group']}>
                        <label htmlFor="team-rank" className={styles['form-group__label']}>Rank</label>
                        <input
                            id="team-rank"
                            min={0}
                            max={LIMITS.count}
                            type="number"
                            className={styles['form-group__input']}
                            value={teamModal.data.rank}
                            onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, rank: Math.min(LIMITS.count, Math.max(0, parseInt(e.target.value) || 0)) } })}
                        />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="team-team-name" className={styles['form-group__label']}>Team Name</label>
                        <input
                            id="team-team-name"
                            maxLength={LIMITS.title}
                            className={styles['form-group__input']}
                            value={teamModal.data.team}
                            onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, team: e.target.value } })}
                            placeholder="Team Name"
                            autoFocus
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles['form-group']}>
                            <label htmlFor="team-points" className={styles['form-group__label']}>Points</label>
                            <input
                                id="team-points"
                                min={0}
                                max={LIMITS.count}
                                type="number"
                                className={styles['form-group__input']}
                                value={teamModal.data.points}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, points: Math.min(LIMITS.count, Math.max(0, parseInt(e.target.value) || 0)) } })}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="team-played" className={styles['form-group__label']}>Played</label>
                            <input
                                id="team-played"
                                min={0}
                                max={LIMITS.count}
                                type="number"
                                className={styles['form-group__input']}
                                value={teamModal.data.played}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, played: Math.min(LIMITS.count, Math.max(0, parseInt(e.target.value) || 0)) } })}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="team-won" className={styles['form-group__label']}>Won</label>
                            <input
                                id="team-won"
                                min={0}
                                max={LIMITS.count}
                                type="number"
                                className={styles['form-group__input']}
                                value={teamModal.data.won}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, won: Math.min(LIMITS.count, Math.max(0, parseInt(e.target.value) || 0)) } })}
                            />
                        </div>
                        <div className={styles['form-group']}>
                            <label htmlFor="team-lost" className={styles['form-group__label']}>Lost</label>
                            <input
                                id="team-lost"
                                min={0}
                                max={LIMITS.count}
                                type="number"
                                className={styles['form-group__input']}
                                value={teamModal.data.lost}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, lost: Math.min(LIMITS.count, Math.max(0, parseInt(e.target.value) || 0)) } })}
                            />
                        </div>
                    </div>
                    <div className={styles['modal__actions']}>
                        <Button onClick={closeTeamModal} variant="outline">Cancel</Button>
                        <Button onClick={saveTeam}>{teamModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                    </div>
                </EditorModal>
            )}

            <div className={styles['data-table-container']}>
                <table className={styles['data-table']}>
                    <thead>
                        <tr>
                            <th className={styles['data-table__th']} style={{ width: '60px' }}>Rank</th>
                            <th className={styles['data-table__th']}>Team Name</th>
                            <th className={styles['data-table__th']} style={{ width: '80px' }}>Pts</th>
                            <th className={styles['data-table__th']} style={{ width: '80px' }}>P</th>
                            <th className={styles['data-table__th']} style={{ width: '80px' }}>W</th>
                            <th className={styles['data-table__th']} style={{ width: '80px' }}>L</th>
                            <th className={styles['data-table__th']} style={{ width: '120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {league.map((team, index) => (
                            <tr key={index} className={styles['data-table__tr']}>
                                <td className={styles['data-table__td']}>{team.rank}</td>
                                <td className={styles['data-table__td']}>{team.team}</td>
                                <td className={styles['data-table__td']}>{team.points}</td>
                                <td className={styles['data-table__td']}>{team.played}</td>
                                <td className={styles['data-table__td']}>{team.won}</td>
                                <td className={styles['data-table__td']}>{team.lost}</td>
                                <td className={styles['data-table__td']}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            disabled={loading || saving}
                                            onClick={() => openEditTeam(index, team)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-subheading)' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            disabled={loading || saving}
                                            onClick={() => deleteTeam(index)}
                                            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontFamily: 'var(--font-subheading)' }}
                                        >
                                            Del
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
