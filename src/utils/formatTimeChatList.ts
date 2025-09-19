// src/utils/formatTimeChatList.ts
import { formatDateIndo } from './formatDateIndo';
import { getDayNameIndo } from './dayNameIndo';

/**
 * Format a date string for chat list display:
 * - Today: show time (AM/PM)
 * - Yesterday: 'Kemarin'
 * - 2-7 days ago: day name (Senin, Selasa, ...)
 * - >7 days: DD Month YYYY (Indonesian)
 */
export function formatTimeChatList(dateStr: string): string {
  const messageDate = new Date(dateStr);
  if (isNaN(messageDate.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

  const diffTime = today.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today - show time with AM/PM
    return messageDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffDays === 1) {
    // Yesterday
    return 'Kemarin';
  } else if (diffDays >= 2 && diffDays <= 7) {
    // Show day name for 2-7 days ago
    return getDayNameIndo(messageDate);
  } else {
    // More than 7 days - use formatDateIndo (will show DD Month YYYY)
    return formatDateIndo(messageDate);
  }
}
