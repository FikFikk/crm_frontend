// src/utils/dayNameIndo.ts
/**
 * Get Indonesian day name from a Date object.
 * @param date Date object
 * @returns Day name in Indonesian (e.g. 'Senin')
 */
export function getDayNameIndo(date: Date): string {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return dayNames[date.getDay()];
}
