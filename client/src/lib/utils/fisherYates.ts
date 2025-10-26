export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
}

export function calculateKWh(powerWatts: number, timeHours: number): number {
  return (powerWatts * timeHours) / 1000;
}

export function calculateBill(kWh: number, pricePerKWh: number = 1500): number {
  return kWh * pricePerKWh;
}
