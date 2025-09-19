// src/utils/formatDateIndo.ts

/**
 * Format a JS Date object to Indonesian date string for chat grouping.
 * - "Hari ini" if today
 * - "Kemarin" if yesterday
 * - "DD Month YYYY" (e.g. 19 September 2025) otherwise
 */
export function formatDateIndo(date: Date | string): string {
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string') {
    d = new Date(date);
    if (isNaN(d.getTime())) {
      return '-';
    }
  } else {
    return '-';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hari ini';
  } else if (diffDays === 1) {
    return 'Kemarin';
  } else {
    // Format: DD Month YYYY (Indonesian)
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
}
