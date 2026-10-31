// Campus Pulse - iCalendar (.ics) Generator
// Generates standard .ics files for Google Calendar, Apple Calendar, and Outlook

export function generateICS(notice) {
  const sanitize = (str) => (str || "").replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  
  // Format date to YYYYMMDD
  const dateStr = (notice.date || "2026-11-01").replace(/-/g, '');
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${notice.id || 'notice'}@campuspulse.edu`;

  // Basic time parsing if available
  let dtStart = `${dateStr}T090000Z`;
  let dtEnd = `${dateStr}T110000Z`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Pulse//Campus Announcements Hub//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${sanitize(notice.title)}`,
    `DESCRIPTION:${sanitize(notice.description)} [Organized by: ${sanitize(notice.organizer || "Campus Cell")}]`,
    `LOCATION:${sanitize(notice.venue || "Campus")}`,
    `STATUS:CONFIRMED`,
    `CATEGORIES:${notice.category || "General"}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${sanitize(notice.title)} in 2 hours`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(icsBlob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = (notice.title || "notice").toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  link.download = `event-${fileName}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

