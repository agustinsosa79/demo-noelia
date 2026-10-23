const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export const formatPrice = (amount: number) => ars.format(amount);

export const pluralize = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
