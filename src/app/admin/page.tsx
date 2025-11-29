'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import styles from './page.module.css';
import { AppData, Event, MenuCategory, LeagueTeam, BilliardRate } from '@/lib/data';

export default function AdminDashboard() {
    const [data, setData] = useState<AppData | null>(null);
    const [activeTab, setActiveTab] = useState<'events' | 'menu' | 'league' | 'rates'>('events');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Debounce ref
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check auth
        const auth = document.cookie.includes('admin_auth=true');
        if (!auth) {
            router.push('/admin/login');
            return;
        }

        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const saveData = async (newData: AppData) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            if (res.ok) {
                setLastSaved(new Date());
            } else {
                console.error('Failed to save data');
            }
        } catch (error) {
            console.error('Failed to save data', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDataChange = (newData: AppData) => {
        setData(newData);

        // Debounce save
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSaving(true); // Show saving immediately for better UX
        timeoutRef.current = setTimeout(() => {
            saveData(newData);
        }, 1000);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleTabChange = (tab: 'events' | 'menu' | 'league' | 'rates') => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false); // Close menu on selection
    };

    if (loading) return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Skeleton width={150} height={32} />
                </div>
                <nav className={styles.nav}>
                    <Skeleton width="100%" height={40} style={{ marginBottom: '0.5rem' }} />
                    <Skeleton width="100%" height={40} style={{ marginBottom: '0.5rem' }} />
                    <Skeleton width="100%" height={40} style={{ marginBottom: '0.5rem' }} />
                    <Skeleton width="100%" height={40} style={{ marginBottom: '0.5rem' }} />
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <div className={styles.topBar}>
                    <Skeleton width={200} height={40} />
                    <Skeleton width={120} height={40} />
                </div>
                <div className={styles.section}>
                    <div className={styles.cardGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} width="100%" height={200} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );

    if (!data) return <div className={styles.loading}>Error loading data.</div>;

    return (
        <div className={styles.container}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <h2 className={styles.sidebarTitle}>Bourbon Admin</h2>
                <button className={styles.menuButton} onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Bourbon Admin</h2>
                </div>
                <nav className={styles.nav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'events' ? styles.active : ''}`}
                        onClick={() => handleTabChange('events')}
                    >
                        Events
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'menu' ? styles.active : ''}`}
                        onClick={() => handleTabChange('menu')}
                    >
                        Menu
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'league' ? styles.active : ''}`}
                        onClick={() => handleTabChange('league')}
                    >
                        League
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'rates' ? styles.active : ''}`}
                        onClick={() => handleTabChange('rates')}
                    >
                        Rates
                    </button>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <div className={styles.topBar}>
                    <h1 className={styles.pageTitle}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {saving ? (
                            <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>Saving...</span>
                        ) : lastSaved ? (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className={styles.section}>
                    {activeTab === 'events' && (
                        <EventsEditor events={data.events} onChange={(events) => handleDataChange({ ...data, events })} />
                    )}
                    {activeTab === 'menu' && (
                        <MenuEditor menu={data.menu} onChange={(menu) => handleDataChange({ ...data, menu })} />
                    )}
                    {activeTab === 'league' && (
                        <LeagueEditor league={data.league} onChange={(league) => handleDataChange({ ...data, league })} />
                    )}
                    {activeTab === 'rates' && (
                        <RatesEditor rates={data.rates} onChange={(rates) => handleDataChange({ ...data, rates })} />
                    )}
                </div>
            </main>
        </div>
    );
}

function EventsEditor({ events, onChange }: { events: Event[]; onChange: (events: Event[]) => void }) {
    // ... (existing EventsEditor code)
    const [eventModal, setEventModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        index?: number;
        data: Event;
    }>({
        isOpen: false,
        mode: 'add',
        data: { id: 0, title: '', date: '', description: '' }
    });

    const openAddEvent = () => {
        setEventModal({
            isOpen: true,
            mode: 'add',
            data: { id: Math.floor(Math.random() * 1000000000), title: '', date: '', description: '' }
        });
    };

    const openEditEvent = (index: number, event: Event) => {
        setEventModal({
            isOpen: true,
            mode: 'edit',
            index,
            data: { ...event }
        });
    };

    const closeEventModal = () => {
        setEventModal({ ...eventModal, isOpen: false });
    };

    const saveEvent = () => {
        const { index, mode, data } = eventModal;
        if (!data.title || !data.date) return;

        const newEvents = [...events];
        if (mode === 'add') {
            newEvents.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newEvents[index] = data;
        }
        onChange(newEvents);
        closeEventModal();
    };

    const removeEvent = (index: number) => {
        if (confirm('Delete this event?')) {
            const newEvents = events.filter((_, i) => i !== index);
            onChange(newEvents);
        }
    };

    return (
        <div>
            <Button onClick={openAddEvent} variant="outline" className={styles.addButton}>+ Add New Event</Button>

            {eventModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>{eventModal.mode === 'add' ? 'Add Event' : 'Edit Event'}</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={eventModal.data.title}
                                onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, title: e.target.value } })}
                                placeholder="Event Title"
                                autoFocus
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Date</label>
                            <input
                                className={styles.input}
                                value={eventModal.data.date}
                                onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, date: e.target.value } })}
                                placeholder="e.g., Oct 12, 8PM"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={eventModal.data.description}
                                onChange={(e) => setEventModal({ ...eventModal, data: { ...eventModal.data, description: e.target.value } })}
                                placeholder="Event details..."
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button onClick={closeEventModal} variant="outline">Cancel</Button>
                            <Button onClick={saveEvent}>{eventModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.cardGrid}>
                {events.map((event, index) => (
                    <div key={event.id} className={styles.compactItem}>
                        <div className={styles.compactInfo}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                <span className={styles.compactName}>{event.title}</span>
                                <span className={styles.compactPrice} style={{ fontSize: '1rem' }}>{event.date}</span>
                            </div>
                            <span className={styles.compactDesc}>{event.description}</span>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <Button onClick={() => openEditEvent(index, event)} variant="outline" className={styles.smallButton}>Edit</Button>
                            <Button onClick={() => removeEvent(index)} variant="outline" className={styles.smallButton + ' ' + styles.deleteBtn}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MenuEditor({ menu, onChange }: { menu: MenuCategory[]; onChange: (menu: MenuCategory[]) => void }) {
    // ... (existing MenuEditor code)
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');

    // Item Modal State
    const [itemModal, setItemModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        catIndex: number;
        itemIndex?: number;
        data: { name: string; price: string; description: string };
    }>({
        isOpen: false,
        mode: 'add',
        catIndex: -1,
        data: { name: '', price: '', description: '' }
    });

    const openAddItem = (catIndex: number) => {
        setItemModal({
            isOpen: true,
            mode: 'add',
            catIndex,
            data: { name: '', price: '', description: '' }
        });
    };

    const openEditItem = (catIndex: number, itemIndex: number, item: any) => {
        setItemModal({
            isOpen: true,
            mode: 'edit',
            catIndex,
            itemIndex,
            data: { ...item }
        });
    };

    const closeItemModal = () => {
        setItemModal({ ...itemModal, isOpen: false });
    };

    const saveItem = () => {
        const { catIndex, itemIndex, mode, data } = itemModal;
        if (!data.name || !data.price) return; // Basic validation

        const newMenu = [...menu];
        if (mode === 'add') {
            newMenu[catIndex].items.push(data);
        } else if (mode === 'edit' && itemIndex !== undefined) {
            newMenu[catIndex].items[itemIndex] = data;
        }
        onChange(newMenu);
        closeItemModal();
    };

    const addCategory = () => {
        if (!newCategoryTitle.trim()) return;
        const newMenu = [...menu, { title: newCategoryTitle, items: [] }];
        onChange(newMenu);
        setNewCategoryTitle('');
        setIsAddingCategory(false);
    };

    const deleteCategory = (index: number) => {
        if (confirm('Are you sure you want to delete this category and all its items?')) {
            const newMenu = menu.filter((_, i) => i !== index);
            onChange(newMenu);
        }
    };

    const deleteItem = (catIndex: number, itemIndex: number) => {
        if (confirm('Delete this item?')) {
            const newMenu = [...menu];
            newMenu[catIndex].items = newMenu[catIndex].items.filter((_, i) => i !== itemIndex);
            onChange(newMenu);
        }
    };

    return (
        <div>
            <Button onClick={() => setIsAddingCategory(true)} variant="outline" className={styles.addButton}>+ Add Category</Button>

            {/* Category Modal */}
            {isAddingCategory && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>New Category</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category Title</label>
                            <input
                                className={styles.input}
                                value={newCategoryTitle}
                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                placeholder="e.g., Starters"
                                autoFocus
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button onClick={() => setIsAddingCategory(false)} variant="outline">Cancel</Button>
                            <Button onClick={addCategory}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Item Modal */}
            {itemModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>{itemModal.mode === 'add' ? 'Add Item' : 'Edit Item'}</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name</label>
                            <input
                                className={styles.input}
                                value={itemModal.data.name}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, name: e.target.value } })}
                                placeholder="Item Name"
                                autoFocus
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Price</label>
                            <input
                                className={styles.input}
                                value={itemModal.data.price}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, price: e.target.value } })}
                                placeholder="$0.00"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={itemModal.data.description}
                                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, description: e.target.value } })}
                                placeholder="Description..."
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button onClick={closeItemModal} variant="outline">Cancel</Button>
                            <Button onClick={saveItem}>{itemModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {menu.map((category, catIndex) => (
                <div key={catIndex} className={styles.categoryBlock}>
                    <div className={styles.categoryHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', margin: 0 }}>
                            {category.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button onClick={() => openAddItem(catIndex)} variant="outline" className={styles.smallButton}>+ Add Item</Button>
                            <Button onClick={() => deleteCategory(catIndex)} variant="outline" className={styles.smallButton + ' ' + styles.deleteBtn}>Delete Category</Button>
                        </div>
                    </div>
                    <div className={styles.cardGrid}>
                        {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles.compactItem}>
                                <div className={styles.compactInfo}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <span className={styles.compactName}>{item.name}</span>
                                        <span className={styles.compactPrice}>${item.price}</span>
                                    </div>
                                    <span className={styles.compactDesc}>{item.description}</span>
                                </div>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <Button
                                        onClick={() => openEditItem(catIndex, itemIndex, item)}
                                        variant="outline"
                                        className={styles.smallButton}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => deleteItem(catIndex, itemIndex)}
                                        variant="outline"
                                        className={styles.smallButton + ' ' + styles.deleteBtn}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function LeagueEditor({ league, onChange }: { league: LeagueTeam[]; onChange: (league: LeagueTeam[]) => void }) {
    // ... (existing LeagueEditor code)
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
        const { index, mode, data } = teamModal;
        if (!data.team) return;

        const newLeague = [...league];
        if (mode === 'add') {
            newLeague.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newLeague[index] = data;
        }
        // Sort by rank automatically
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
            <Button onClick={openAddTeam} variant="outline" className={styles.addButton}>+ Add Team</Button>

            {teamModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>{teamModal.mode === 'add' ? 'Add Team' : 'Edit Team'}</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rank</label>
                            <input
                                type="number"
                                className={styles.input}
                                value={teamModal.data.rank}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, rank: parseInt(e.target.value) || 0 } })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Team Name</label>
                            <input
                                className={styles.input}
                                value={teamModal.data.team}
                                onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, team: e.target.value } })}
                                placeholder="Team Name"
                                autoFocus
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Points</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={teamModal.data.points}
                                    onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, points: parseInt(e.target.value) || 0 } })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Played</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={teamModal.data.played}
                                    onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, played: parseInt(e.target.value) || 0 } })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Won</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={teamModal.data.won}
                                    onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, won: parseInt(e.target.value) || 0 } })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Lost</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={teamModal.data.lost}
                                    onChange={(e) => setTeamModal({ ...teamModal, data: { ...teamModal.data, lost: parseInt(e.target.value) || 0 } })}
                                />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <Button onClick={closeTeamModal} variant="outline">Cancel</Button>
                            <Button onClick={saveTeam}>{teamModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th} style={{ width: '60px' }}>Rank</th>
                            <th className={styles.th}>Team Name</th>
                            <th className={styles.th} style={{ width: '80px' }}>Pts</th>
                            <th className={styles.th} style={{ width: '80px' }}>P</th>
                            <th className={styles.th} style={{ width: '80px' }}>W</th>
                            <th className={styles.th} style={{ width: '80px' }}>L</th>
                            <th className={styles.th} style={{ width: '120px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {league.map((team, index) => (
                            <tr key={index} className={styles.tr}>
                                <td className={styles.td}>{team.rank}</td>
                                <td className={styles.td}>{team.team}</td>
                                <td className={styles.td}>{team.points}</td>
                                <td className={styles.td}>{team.played}</td>
                                <td className={styles.td}>{team.won}</td>
                                <td className={styles.td}>{team.lost}</td>
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => openEditTeam(index, team)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontFamily: 'var(--font-subheading)' }}
                                        >
                                            Edit
                                        </button>
                                        <button
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

function RatesEditor({ rates, onChange }: { rates: BilliardRate[]; onChange: (rates: BilliardRate[]) => void }) {
    const [rateModal, setRateModal] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        index?: number;
        data: BilliardRate;
    }>({
        isOpen: false,
        mode: 'add',
        data: { id: 0, title: '', price: '', description: '' }
    });

    const openAddRate = () => {
        setRateModal({
            isOpen: true,
            mode: 'add',
            data: { id: Math.floor(Math.random() * 1000000000), title: '', price: '', description: '' }
        });
    };

    const openEditRate = (index: number, rate: BilliardRate) => {
        setRateModal({
            isOpen: true,
            mode: 'edit',
            index,
            data: { ...rate }
        });
    };

    const closeRateModal = () => {
        setRateModal({ ...rateModal, isOpen: false });
    };

    const saveRate = () => {
        const { index, mode, data } = rateModal;
        if (!data.title || !data.price) return;

        const newRates = [...rates];
        if (mode === 'add') {
            newRates.push(data);
        } else if (mode === 'edit' && index !== undefined) {
            newRates[index] = data;
        }
        onChange(newRates);
        closeRateModal();
    };

    const removeRate = (index: number) => {
        if (confirm('Delete this rate?')) {
            const newRates = rates.filter((_, i) => i !== index);
            onChange(newRates);
        }
    };

    return (
        <div>
            <Button onClick={openAddRate} variant="outline" className={styles.addButton}>+ Add Rate</Button>

            {rateModal.isOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modalTitle}>{rateModal.mode === 'add' ? 'Add Rate' : 'Edit Rate'}</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input}
                                value={rateModal.data.title}
                                onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, title: e.target.value } })}
                                placeholder="e.g., Hourly Rate"
                                autoFocus
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Price</label>
                            <input
                                className={styles.input}
                                value={rateModal.data.price}
                                onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, price: e.target.value } })}
                                placeholder="$0.00"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={rateModal.data.description}
                                onChange={(e) => setRateModal({ ...rateModal, data: { ...rateModal.data, description: e.target.value } })}
                                placeholder="Details..."
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <Button onClick={closeRateModal} variant="outline">Cancel</Button>
                            <Button onClick={saveRate}>{rateModal.mode === 'add' ? 'Add' : 'Save'}</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.cardGrid}>
                {rates.map((rate, index) => (
                    <div key={rate.id} className={styles.compactItem}>
                        <div className={styles.compactInfo}>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
                                <span className={styles.compactName}>{rate.title}</span>
                                <span className={styles.compactPrice}>{rate.price}</span>
                            </div>
                            <span className={styles.compactDesc}>{rate.description}</span>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <Button onClick={() => openEditRate(index, rate)} variant="outline" className={styles.smallButton}>Edit</Button>
                            <Button onClick={() => removeRate(index)} variant="outline" className={styles.smallButton + ' ' + styles.deleteBtn}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
