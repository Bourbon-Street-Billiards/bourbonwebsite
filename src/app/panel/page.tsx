'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import styles from './page.module.scss';
import { AppData, Event, MenuCategory, LeagueTeam, BilliardRate } from '@/lib/data';
import EditorLoading from '@/components/editor/EditorLoading';
import EventsEditor from '@/components/editor/EventsEditor';
import MenuEditor from '@/components/editor/MenuEditor';
import LeagueEditor from '@/components/editor/LeagueEditor';
import RatesEditor from '@/components/editor/RatesEditor';

type SavingState = {
    events: boolean;
    menu: boolean;
    league: boolean;
    rates: boolean;
};

export default function AdminDashboard() {
    const [data, setData] = useState<AppData | null>(null);
    const [activeTab, setActiveTab] = useState<'events' | 'menu' | 'league' | 'rates'>('events');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<SavingState>({ events: false, menu: false, league: false, rates: false });
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounce refs for each data type
    const eventsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const leagueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ratesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/auth/sign-in');
            return;
        }
        if (session && session.user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        if (session && session.user?.role === 'admin') {
            fetchData();
        }
    }, [router, session, isPending]);

    const fetchData = async () => {
        try {
            const [eventsRes, menuRes, leagueRes, ratesRes] = await Promise.all([
                fetch('/api/panel/events'),
                fetch('/api/panel/menu'),
                fetch('/api/panel/league'),
                fetch('/api/panel/rates'),
            ]);
            const [events, menu, league, rates] = await Promise.all([
                eventsRes.json(),
                menuRes.json(),
                leagueRes.json(),
                ratesRes.json(),
            ]);
            setData({ events, menu, league, rates });
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    // Individual save functions
    const saveEvents = async (events: Event[]) => {
        setSaving(s => ({ ...s, events: true }));
        try {
            const res = await fetch('/api/panel/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events),
            });
            if (res.ok) setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save events', error);
        } finally {
            setSaving(s => ({ ...s, events: false }));
        }
    };

    const saveMenu = async (menu: MenuCategory[]) => {
        setSaving(s => ({ ...s, menu: true }));
        try {
            const res = await fetch('/api/panel/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menu),
            });
            if (res.ok) setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save menu', error);
        } finally {
            setSaving(s => ({ ...s, menu: false }));
        }
    };

    const saveLeague = async (league: LeagueTeam[]) => {
        setSaving(s => ({ ...s, league: true }));
        try {
            const res = await fetch('/api/panel/league', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(league),
            });
            if (res.ok) setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save league', error);
        } finally {
            setSaving(s => ({ ...s, league: false }));
        }
    };

    const saveRates = async (rates: BilliardRate[]) => {
        setSaving(s => ({ ...s, rates: true }));
        try {
            const res = await fetch('/api/panel/rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rates),
            });
            if (res.ok) setLastSaved(new Date());
        } catch (error) {
            console.error('Failed to save rates', error);
        } finally {
            setSaving(s => ({ ...s, rates: false }));
        }
    };

    // Debounced change handlers
    const handleEventsChange = (events: Event[]) => {
        setData(d => d ? { ...d, events } : null);
        if (eventsTimeoutRef.current) clearTimeout(eventsTimeoutRef.current);
        setSaving(s => ({ ...s, events: true }));
        eventsTimeoutRef.current = setTimeout(() => saveEvents(events), 1000);
    };

    const handleMenuChange = (menu: MenuCategory[]) => {
        setData(d => d ? { ...d, menu } : null);
        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
        setSaving(s => ({ ...s, menu: true }));
        menuTimeoutRef.current = setTimeout(() => saveMenu(menu), 1000);
    };

    const handleLeagueChange = (league: LeagueTeam[]) => {
        setData(d => d ? { ...d, league } : null);
        if (leagueTimeoutRef.current) clearTimeout(leagueTimeoutRef.current);
        setSaving(s => ({ ...s, league: true }));
        leagueTimeoutRef.current = setTimeout(() => saveLeague(league), 1000);
    };

    const handleRatesChange = (rates: BilliardRate[]) => {
        setData(d => d ? { ...d, rates } : null);
        if (ratesTimeoutRef.current) clearTimeout(ratesTimeoutRef.current);
        setSaving(s => ({ ...s, rates: true }));
        ratesTimeoutRef.current = setTimeout(() => saveRates(rates), 1000);
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
    const handleTabChange = (tab: 'events' | 'menu' | 'league' | 'rates') => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    const isSaving = saving.events || saving.menu || saving.league || saving.rates;

    if (isPending) return null;
    if (!session) return null;
    if (session.user?.role !== 'admin') return null;

    return (
        <div className={styles['panel']}>
            <div className={styles['mobile-header']}>
                <h2 className={styles['panel__sidebar-title']}>Bourbon Admin</h2>
                <button className={styles['mobile-header__button']} onClick={toggleMobileMenu}>
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
                            <span style={{ color: 'var(--color-text-accent)' }}>Saving...</span>
                        ) : lastSaved ? (
                            <span style={{ color: 'var(--color-text-muted)' }}>Saved {lastSaved.toLocaleTimeString()}</span>
                        ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>Everything synced</span>
                        )}
                    </div>
                </div>

                {loading || !data ? (
                    <EditorLoading />
                ) : (
                    <div className={styles['panel__section']}>
                        {activeTab === 'events' && (
                            <EventsEditor events={data.events} onChange={handleEventsChange} loading={loading} saving={saving.events} />
                        )}
                        {activeTab === 'menu' && (
                            <MenuEditor menu={data.menu} onChange={handleMenuChange} loading={loading} saving={saving.menu} />
                        )}
                        {activeTab === 'league' && (
                            <LeagueEditor league={data.league} onChange={handleLeagueChange} />
                        )}
                        {activeTab === 'rates' && (
                            <RatesEditor rates={data.rates} onChange={handleRatesChange} />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}