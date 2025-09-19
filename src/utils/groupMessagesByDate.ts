// src/utils/groupMessagesByDate.ts
import { formatDateIndo } from './formatDateIndo';

/**
 * Group chat messages by formatted date string (for ChatBox grouping UI)
 * @param messages Array of chat messages (must have .created and .body)
 * @param enrichMessagesWithStatus Optional function to enrich messages with status
 * @param searchMessage Optional search string to filter messages by body
 * @returns Array of groups: { date: string, messages: any[] }
 */
export function groupMessagesByDate(messages: any[], enrichMessagesWithStatus?: (msgs: any[]) => any[], searchMessage?: string): { date: string; messages: any[] }[] {
  let filtered = messages;
  if (searchMessage) {
    const q = searchMessage.toLowerCase();
    filtered = filtered.filter(msg => msg.body && msg.body.toLowerCase().includes(q));
  }
  const enrichedMessages = enrichMessagesWithStatus ? enrichMessagesWithStatus(filtered) : filtered;
  const groups: { date: string; messages: any[] }[] = [];
  let currentDate = '';
  let currentGroup: any[] = [];
  enrichedMessages.forEach(msg => {
    const messageDate = new Date(msg.created);
    const dateStr = formatDateIndo(messageDate);
    if (dateStr !== currentDate) {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate, messages: currentGroup });
      }
      currentDate = dateStr;
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  });
  if (currentGroup.length > 0) {
    groups.push({ date: currentDate, messages: currentGroup });
  }
  return groups;
}
