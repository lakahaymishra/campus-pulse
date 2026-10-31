// Campus Pulse - Persistent Storage & Duplicate Detection Service

import { SAMPLE_ANNOUNCEMENTS } from '../data/sampleAnnouncements.js';

const STORAGE_KEYS = {
  NOTICES: 'campus_pulse_notices_v1',
  SETTINGS: 'campus_pulse_settings_v1',
  REMINDERS: 'campus_pulse_reminders_v1',
  BOOKMARKS: 'campus_pulse_bookmarks_v1'
};

const DEFAULT_SETTINGS = {
  geminiApiKey: '',
  aiModel: 'gemini-1.5-flash',
  universityName: 'Apex Institute of Technology',
  studentName: 'Alex Morgan',
  studentProgram: 'B.Tech CSE - Semester 5',
  soundEnabled: true,
  desktopNotifications: false,
  themeMode: 'dark-navy',
  themeBackground: 'aurora'
};

/**
 * Initialize storage with default sample notices if not already present
 */
export function initStorage() {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(SAMPLE_ANNOUNCEMENTS));
    }
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  } catch (e) {
    console.error("Storage initialization error:", e);
  }
}

/**
 * Get all announcements from LocalStorage
 */
export function getAnnouncements() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(SAMPLE_ANNOUNCEMENTS));
      return SAMPLE_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse announcements:", e);
    return SAMPLE_ANNOUNCEMENTS;
  }
}

/**
 * Save all announcements back to LocalStorage
 */
export function saveAnnouncements(announcements) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(announcements));
    return true;
  } catch (e) {
    console.error("Failed to save announcements:", e);
    return false;
  }
}

/**
 * Add a new announcement
 */
export function addAnnouncement(notice) {
  const announcements = getAnnouncements();
  const newNotice = {
    ...notice,
    id: notice.id || `notice-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: notice.createdAt || new Date().toISOString(),
    reminderSet: notice.reminderSet || false,
    isBookmarked: notice.isBookmarked || false
  };
  announcements.unshift(newNotice);
  saveAnnouncements(announcements);
  return newNotice;
}

/**
 * Update an existing announcement
 */
export function updateAnnouncement(id, updatedFields) {
  const announcements = getAnnouncements();
  const index = announcements.findIndex(n => n.id === id);
  if (index === -1) return null;
  announcements[index] = { ...announcements[index], ...updatedFields };
  saveAnnouncements(announcements);
  return announcements[index];
}

/**
 * Delete an announcement by ID
 */
export function deleteAnnouncement(id) {
  const announcements = getAnnouncements();
  const filtered = announcements.filter(n => n.id !== id);
  saveAnnouncements(filtered);
  return filtered;
}

/**
 * Toggle reminder for an announcement
 */
export function toggleReminder(id) {
  const announcements = getAnnouncements();
  const target = announcements.find(n => n.id === id);
  if (!target) return null;
  target.reminderSet = !target.reminderSet;
  saveAnnouncements(announcements);
  return target;
}

/**
 * Toggle bookmark for an announcement
 */
export function toggleBookmark(id) {
  const announcements = getAnnouncements();
  const target = announcements.find(n => n.id === id);
  if (!target) return null;
  target.isBookmarked = !target.isBookmarked;
  saveAnnouncements(announcements);
  return target;
}

/**
 * Duplicate Prevention Check:
 * Checks if an announcement with similar title (Levenshtein / word overlap)
 * and matching date already exists.
 */
export function checkForDuplicates(title, date, currentId = null) {
  if (!title || !title.trim()) return null;
  const announcements = getAnnouncements();
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const titleWords = cleanTitle.split(/\s+/).filter(w => w.length > 2);

  for (const item of announcements) {
    if (currentId && item.id === currentId) continue;
    
    // Check date match
    const dateMatch = date && item.date && item.date === date;
    
    // Check title similarity
    const itemTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const itemWords = itemTitle.split(/\s+/).filter(w => w.length > 2);
    
    // Calculate Jaccard word overlap
    const intersection = titleWords.filter(w => itemWords.includes(w));
    const union = new Set([...titleWords, ...itemWords]);
    const similarity = union.size > 0 ? intersection.length / union.size : 0;

    // Direct substring or high word similarity
    if (itemTitle === cleanTitle || similarity > 0.65 || (dateMatch && similarity > 0.4)) {
      return {
        matchedNotice: item,
        similarityScore: Math.round(similarity * 100),
        reason: dateMatch 
          ? `Same date (${date}) and ${Math.round(similarity * 100)}% title similarity.` 
          : `High title similarity (${Math.round(similarity * 100)}%) with an existing notice.`
      };
    }
  }
  return null;
}

/**
 * Reset storage to default college samples
 */
export function resetToSampleData() {
  saveAnnouncements(SAMPLE_ANNOUNCEMENTS);
  return SAMPLE_ANNOUNCEMENTS;
}

/**
 * Clear all announcements
 */
export function clearAllAnnouncements() {
  saveAnnouncements([]);
  return [];
}

/**
 * Export data as JSON file for download
 */
export function exportDataAsJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    announcements: getAnnouncements(),
    settings: getSettings()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `campus-pulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON string
 */
export function importDataFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      saveAnnouncements(parsed);
      return { success: true, count: parsed.length };
    } else if (parsed.announcements && Array.isArray(parsed.announcements)) {
      saveAnnouncements(parsed.announcements);
      if (parsed.settings) {
        saveSettings(parsed.settings);
      }
      return { success: true, count: parsed.announcements.length };
    }
    return { success: false, error: "Invalid backup file format" };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Settings CRUD
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    const merged = { ...getSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  } catch (e) {
    console.error("Failed to save settings:", e);
    return null;
  }
}

