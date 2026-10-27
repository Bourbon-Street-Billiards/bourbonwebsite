// Prices are stored as free text ("15", "$15", "12.5", "Market price").
// Plain numbers are shown as "$15.00"; anything else is shown as typed.
export function formatPrice(price: string): string {
    const value = price.trim().replace(/^\$\s*/, '');
    if (/^\d+(\.\d+)?$/.test(value)) return `$${Number(value).toFixed(2)}`;
    return price.trim();
}
