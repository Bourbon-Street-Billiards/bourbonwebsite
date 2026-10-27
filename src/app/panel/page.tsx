'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import styles from './page.module.scss';
import type { AppData } from '@/lib/data';
import EditorLoading from '@/components/editor/EditorLoading';
import EventsEditor from '@/components/editor/EventsEditor';
import MenuEditor from '@/components/editor/MenuEditor';
import LeagueEditor from '@/components/editor/LeagueEditor';
import RatesEditor from '@/components/editor/RatesEditor';

type Section = keyof AppData;
type SavingState = Record<Section, boolean>;

const SECTIONS: Section[] = ['events', 'menu', 'league', 'rates'];

export default function AdminDashboard() {
    const [data, setData] = useState<AppData | null>(null);
    const [activeTab, setActiveTab] = useState<Section>('events');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [saving, setSaving] = useState<SavingState>({ events: false, menu: false, league: false, rates: false });
    const [saveError, setSaveError] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const isAdmin = session?.user?.role === 'admin';

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounce timers, one per section
    const saveTimeouts = useRef<Partial<Record<Section, NodeJS.Timeout>>>({});
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/auth/sign-in');
            return;
        }
        if (session && !isAdmin) {
            router.push('/dashboard');
            return;
        }
        // Load once; a refreshed session object must not overwrite unsaved edits.
        if (isAdmin && !hasFetched.current) {
            hasFetched.current = true;
            fetchData();
        }
    }, [router, session, isPending, isAdmin]);

    const isSaving = SECTIONS.some(section => saving[section]);

    // Warn before leaving while a debounced or in-flight save is pending.
    useEffect(() => {
        if (!isSaving) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSaving]);

    const fetchData = async () => {
        try {
            const responses = await Promise.all(SECTIONS.map(section => fetch(`/api/panel/${section}`)));
            if (responses.some(res => !res.ok)) throw new Error('Failed to load panel data');
            const [events, menu, league, rates] = await Promise.all(responses.map(res => res.json()));
            setData({ events, menu, league, rates });
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    const save = async <K extends Section>(section: K, value: AppData[K]) => {
        try {
            const res = await fetch(`/api/panel/${section}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value),
            });
            if (!res.ok) throw new Error(`Save failed with status ${res.status}`);
            setSaveError(false);
            setLastSaved(new Date());
        } catch (error) {
            console.error(`Failed to save ${section}`, error);
            setSaveError(true);
        } finally {
            setSaving(s => ({ ...s, [section]: false }));
        }
    };

    // Debounced change handler shared by all editors
    const handleChange = <K extends Section>(section: K) => (value: AppData[K]) => {
        setData(d => d ? { ...d, [section]: value } : null);
        clearTimeout(saveTimeouts.current[section]);
        setSaving(s => ({ ...s, [section]: true }));
        saveTimeouts.current[section] = setTimeout(() => save(section, value), 1000);
    };

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            router.push('/auth/sign-in');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleTabChange = (tab: Section) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    if (isPending) return null;
    if (!session || !isAdmin) return null;

    return (
        <div className={styles['panel']}>
            <div className={styles['mobile-header']}>
                <h2 className={styles['panel__sidebar-title']}>Bourbon Admin</h2>
                <button
                    type="button"
                    className={styles['mobile-header__button']}
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <aside className={`${styles['panel__sidebar']} ${isScrolled ? styles['panel__sidebar--scrolled'] : ''} ${isMobileMenuOpen ? styles['panel__sidebar--open'] : ''}`}>
                <div className={styles['panel__sidebar-header']}>
                    <h2 className={styles['panel__sidebar-title']}>Bourbon Admin</h2>
                </div>
                <nav className={styles['panel__nav']}>
                    <button className={`${styles['panel__nav-item']} ${activeTab === 'events' ? styles['panel__nav-item--active'] : ''}`} onClick={() => handleTabChange('events')}>Events</button>
                    <button className={`${styles['panel__nav-item']} ${activeTab === 'menu' ? styles['panel__nav-item--active'] : ''}`} onClick={() => handleTabChange('menu')}>Menu</button>
                    <button className={`${styles['panel__nav-item']} ${activeTab === 'league' ? styles['panel__nav-item--active'] : ''}`} onClick={() => handleTabChange('league')}>League</button>
                    <button className={`${styles['panel__nav-item']} ${activeTab === 'rates' ? styles['panel__nav-item--active'] : ''}`} onClick={() => handleTabChange('rates')}>Rates</button>
                    <button onClick={handleLogout} className={styles['panel__nav-logout']}>Logout</button>
                </nav>
            </aside>

            <main className={styles['panel__content']}>
                <div className={styles['panel__top-bar']}>
                    <h1 className={styles['panel__page-title']}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                    </h1>
                    <div className={styles['panel__sync-status']}>
                        Status:
                        {isSaving ? (
                            <span style={{ color: 'var(--color-accent)' }}>Saving...</span>
                        ) : saveError ? (
                            <span role="alert" style={{ color: '#ff4444' }}>Save failed. Your last change was not stored.</span>
                        ) : lastSaved ? (
                            <span style={{ color: 'var(--color-text-muted)' }}>Saved {lastSaved.toLocaleTimeString()}</span>
                        ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>Everything synced</span>
                        )}
                    </div>
                </div>

                {loadError ? (
                    <p role="alert" style={{ color: '#ff4444' }}>Could not load data. Refresh the page to try again.</p>
                ) : loading || !data ? (
                    <EditorLoading />
                ) : (
                    <div className={styles['panel__section']}>
                        {activeTab === 'events' && (
                            <EventsEditor events={data.events} onChange={handleChange('events')} loading={loading} saving={saving.events} />
                        )}
                        {activeTab === 'menu' && (
                            <MenuEditor menu={data.menu} onChange={handleChange('menu')} loading={loading} saving={saving.menu} />
                        )}
                        {activeTab === 'league' && (
                            <LeagueEditor league={data.league} onChange={handleChange('league')} loading={loading} saving={saving.league} />
                        )}
                        {activeTab === 'rates' && (
                            <RatesEditor rates={data.rates} onChange={handleChange('rates')} loading={loading} saving={saving.rates} />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}