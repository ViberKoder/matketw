// Telegram WebApp utilities
export function getTelegramUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return null;
    
    return tg.initDataUnsafe?.user?.id?.toString() || null;
}

export function getTelegramUser(): any {
    if (typeof window === 'undefined') return null;
    
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return null;
    
    return tg.initDataUnsafe?.user || null;
}

export function expandMiniApp(): void {
    if (typeof window === 'undefined') return;
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
        tg.expand();
    }
}

export function readyMiniApp(): void {
    if (typeof window === 'undefined') return;
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
        tg.ready();
    }
}
