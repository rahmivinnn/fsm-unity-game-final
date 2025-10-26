export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateKWh(powerWatts: number, timeHours: number): number {
  return (powerWatts * timeHours) / 1000;
}

export function calculateBill(kWh: number, pricePerKWh: number = 1500): number {
  return kWh * pricePerKWh;
}
