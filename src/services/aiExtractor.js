// Campus Pulse - AI Extraction Service
// Supports Google Gemini Flash API + Built-in Smart Heuristic Engine for Offline / Demo Mode

export const SAMPLE_INPUTS = {
  whatsapp: `📢 *CRITICAL NOTICE - EXAMINATION CELL* 📢
Hey everyone, please note that the Mid-Semester Examination timetable for B.Tech 5th Sem and MCA 3rd Sem has been released.
📅 *Date*: 05 November 2026
⏰ *Time*: 09:30 AM to 12:30 PM
📍 *Venue*: Examination Hall Blocks A, B and Central Block
⚠️ *Deadline for Hall Tickets*: 03 November 2026, 4:00 PM. No student will be allowed to sit for exams without signed hall ticket and physical College ID card!
Contact Controller of Exams: coe@apexuniv.edu.in for discrepancies.`,

  placement: `Fwd: Campus Recruitment Drive 2026-27 | Google & Microsoft
To: All Pre-Final Year B.Tech (CSE, IT, ECE) Students
Greetings from Training & Placement Cell!
We are pleased to inform that Google & Microsoft will be conducting their joint summer internship hiring drive on 7th November 2026 from 10:00 AM at Main Audi & CS Labs.
Stipend: ₹1,25,000/month.
Eligibility: Minimum CGPA 7.5, zero active backlogs.
Registration closes on 2nd November 2026 at 11:59 PM on the T&P portal.
Formal dress code mandatory. Carry 3 hard copies of your resume.`,

  hackathon: `🚀 HACKPULSE 2026 - Central India's Largest 36-Hour Hackathon!
Are you passionate about AI, Web3, and building impactful products?
Join 500+ student developers at Innovation & Incubation Hub, 4th Floor.
Event Kickoff: 14th November 2026 at 8:00 AM.
Last Date to Register Team: 8th November 2026.
Cash Prizes: ₹3,50,000 + Internship fast-tracks. Free food, stickers, and overnight sleeping pods.
Register at hackpulse.apexuniv.edu or reach out to dsc@apexuniv.edu.in`,

  sports: `🏆 Intra-College Badminton & Football Selections
Calling all athletes! Trials for the All-India Inter-University Tournament will take place on November 10, 2026, starting at 4:00 PM at the Central Sports Stadium.
Please submit your team roster and physical fitness certificate to Coach Rajesh Singh before Nov 4th, 2026.
Jerseys will be provided for shortlisted players.`,

  minimal: `Quick reminder that the CS302 Assignment 3 on Neural Networks is due on 2nd Nov 2026 before midnight. Submit your Jupyter notebooks on GitHub Classroom. Late submissions lose 10% per 12 hours.`
};

/**
 * Clean and normalize text from WhatsApp forwards, emails, and notices
 */
function cleanRawText(text) {
  if (!text) return "";
  return text
    .replace(/^(\*|~|_)+|(\*|~|_)+$/g, '')
    .replace(/\r\n/g, '\n')
    .trim();
}

/**
 * Built-in Smart Heuristic Rule-Based NLP Parser
 * Extracts Title, Date, Time, Venue, Category, Description, Deadline, Priority
 * Gracefully flags missing fields instead of inventing details.
 */
export function extractWithHeuristics(rawText) {
  const text = cleanRawText(rawText);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const missingFields = [];
  
  // 1. Determine Category
  const lower = text.toLowerCase();
  let category = "General";
  
  if (/exam|midsem|endsem|hall ticket|admit card|coe|re-evaluation|marksheet|grades|semester examination/i.test(lower)) {
    category = "Examination";
  } else if (/placement|internship|ctc|lpa|stipend|interview|t&p|recruitment|hiring|job drive|resume/i.test(lower)) {
    category = "Placement";
  } else if (/sports|football|badminton|cricket|basketball|tournament|athletics|jersey|coach|trials/i.test(lower)) {
    category = "Sports";
  } else if (/cultural|fest|band|music|dance|singing|drama|amphitheatre|spandan|audition/i.test(lower)) {
    category = "Cultural";
  } else if (/hackathon|workshop|seminar|webinar|conference|techfest|summit|bootcamp/i.test(lower)) {
    category = "Events";
  } else if (/assignment|lecture|syllabus|professor|course|homework|lab manual|quiz|submission/i.test(lower)) {
    category = "Academic";
  }

  // 2. Determine Priority
  let priority = "Normal";
  if (/urgent|critical|mandatory|strict|penalty|today only|last date today|suspended|immediate/i.test(lower)) {
    priority = "Urgent";
  } else if (/deadline|important|registration closes|last date|examination|internship|shortlisting/i.test(lower)) {
    priority = "High";
  } else if (/notice|fyi|optional|reminder/i.test(lower)) {
    priority = "Normal";
  }

  // 3. Extract Title
  let title = "";
  // Look for bold header or first informative line without generic headers
  const firstInformativeLine = lines.find(line => {
    const l = line.replace(/^[🚨📢🚀🏆🎸⚠️\s*#_-]+/, '').trim();
    return l.length > 5 && !/^(fwd:|to:|from:|subject:|greetings|hey everyone)/i.test(l);
  });

  if (firstInformativeLine) {
    title = firstInformativeLine
      .replace(/^[🚨📢🚀🏆🎸⚠️\s*#_-]+/, '')
      .replace(/[🚨📢🚀🏆🎸⚠️\s*#_-]+$/, '')
      .replace(/^\*(.*?)\*$/, '$1')
      .trim();
    if (title.length > 80) {
      title = title.substring(0, 77) + "...";
    }
  } else {
    title = lines[0] ? lines[0].substring(0, 60) : "Campus Announcement";
  }

  // 4. Extract Date
  let date = null;
  // Patterns like "05 November 2026", "Nov 5, 2026", "2026-11-05", "5th Nov 2026", "November 10, 2026"
  const dateRegex = /(?:(\d{1,2})(?:st|nd|rd|th)?\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s*,?\s*(\d{4}))?)|(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?)|(\d{4}-\d{2}-\d{2})/i;
  
  const dateMatch = text.match(dateRegex);
  const monthMap = {
    jan: "01", january: "01", feb: "02", february: "02", mar: "03", march: "03",
    apr: "04", april: "04", may: "05", jun: "06", june: "06", jul: "07", july: "07",
    aug: "08", august: "08", sep: "09", september: "09", oct: "10", october: "10",
    nov: "11", november: "11", dec: "12", december: "12"
  };

  if (dateMatch) {
    if (dateMatch[7]) {
      date = dateMatch[7];
    } else if (dateMatch[1] && dateMatch[2]) {
      const day = dateMatch[1].padStart(2, '0');
      const mName = dateMatch[2].toLowerCase();
      const month = monthMap[mName] || "11";
      const year = dateMatch[3] || "2026";
      date = `${year}-${month}-${day}`;
    } else if (dateMatch[4] && dateMatch[5]) {
      const day = dateMatch[5].padStart(2, '0');
      const mName = dateMatch[4].toLowerCase();
      const month = monthMap[mName] || "11";
      const year = dateMatch[6] || "2026";
      date = `${year}-${month}-${day}`;
    }
  } else if (/today/i.test(text)) {
    date = "2026-10-31";
  } else if (/tomorrow/i.test(text)) {
    date = "2026-11-01";
  }

  if (!date) {
    missingFields.push("Date");
    date = ""; // Left empty for user to edit, gracefully
  }

  // 5. Extract Time
  let time = null;
  const timeRegex = /(\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)(?:\s*(?:to|-|–)\s*\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))?|\b\d{1,2}:\d{2}\s*(?:hrs|hours|IST)?)/i;
  const timeMatch = text.match(timeRegex);
  if (timeMatch) {
    time = timeMatch[0].trim();
  } else {
    missingFields.push("Time");
    time = "";
  }

  // 6. Extract Venue
  let venue = null;
  const venueRegex = /(?:venue|location|place|held at|at:?)\s*[:\-]?\s*([^\n,.]+)|(?:in\s+(?:the\s+)?([A-Z][a-zA-Z0-9\s&]+(?:Hall|Auditorium|Audi|Block|Lab|Room|Stadium|Complex|Hub|Center|Amphitheatre|Campus)))/i;
  const venueMatch = text.match(venueRegex);
  if (venueMatch) {
    venue = (venueMatch[1] || venueMatch[2] || "").trim();
    // remove leading bullet or asterisks
    venue = venue.replace(/^[*_~:\s]+|[*_~:\s]+$/g, '');
  } else if (/github classroom|lms portal|online|zoom|google meet/i.test(text)) {
    venue = "LMS / Online Portal";
  } else {
    missingFields.push("Venue");
    venue = "";
  }

  // 7. Extract Deadline
  let deadline = null;
  const deadlineRegex = /(?:deadline|last date|register(?:ation)? closes?(?: on)?|submit by|due (?:on)?)\s*[:\-]?\s*([^\n.]+)/i;
  const deadlineMatch = text.match(deadlineRegex);
  if (deadlineMatch) {
    const rawDeadline = deadlineMatch[1];
    const dlMatch = rawDeadline.match(dateRegex);
    if (dlMatch) {
      if (dlMatch[7]) {
        deadline = dlMatch[7];
      } else if (dlMatch[1] && dlMatch[2]) {
        const day = dlMatch[1].padStart(2, '0');
        const month = monthMap[dlMatch[2].toLowerCase()] || "11";
        const year = dlMatch[3] || "2026";
        deadline = `${year}-${month}-${day}`;
      } else if (dlMatch[4] && dlMatch[5]) {
        const day = dlMatch[5].padStart(2, '0');
        const month = monthMap[dlMatch[4].toLowerCase()] || "11";
        const year = dlMatch[6] || "2026";
        deadline = `${year}-${month}-${day}`;
      }
    } else if (/today/i.test(rawDeadline)) {
      deadline = "2026-10-31";
    }
  }

  // 8. Description Clean-up
  // Remove messy header and keep the core message
  let description = lines
    .filter(l => !l.startsWith("📢") && !l.startsWith("Fwd:") && !l.toLowerCase().startsWith("to: all"))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (description.length > 300) {
    description = description.substring(0, 297) + "...";
  }
  if (!description) {
    description = text.substring(0, 200);
  }

  // 9. Organizer / Contact Info
  let contactInfo = "";
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(?:\+91[-\s]?)?[6-9]\d{9}/);
  if (emailMatch || phoneMatch) {
    contactInfo = [emailMatch ? emailMatch[0] : null, phoneMatch ? phoneMatch[0] : null].filter(Boolean).join(" | ");
  }

  let organizer = "";
  if (/examination cell|coe/i.test(text)) organizer = "Examination Cell";
  else if (/training & placement|t&p/i.test(text)) organizer = "Training & Placement Cell";
  else if (/developer student club|csi/i.test(text)) organizer = "Developer Student Club";
  else if (/sports council|physical education/i.test(text)) organizer = "Sports Council";
  else if (/cultural society|music club/i.test(text)) organizer = "Cultural Society";
  else if (/library/i.test(text)) organizer = "Central Library";

  return {
    title: title || "New Announcement",
    category,
    date: date || "",
    time: time || "",
    venue: venue || "",
    description,
    deadline: deadline || "",
    priority,
    organizer: organizer || "",
    contactInfo: contactInfo || "",
    missingFields,
    engineUsed: "Smart Rule-Based NLP Engine (Demo Mode)",
    isLiveLLM: false
  };
}

/**
 * Call Gemini API if API key is provided, otherwise fallback smoothly to extractWithHeuristics
 */
export async function extractNoticeWithAI(rawText, apiKey = "") {
  const trimmedKey = (apiKey || "").trim();

  // If no API key is provided, use the smart heuristic parser
  if (!trimmedKey) {
    // Artificial small delay for realistic UX feedback
    await new Promise(r => setTimeout(r, 600));
    return extractWithHeuristics(rawText);
  }

  try {
    const prompt = `You are an AI assistant for "Campus Pulse", a campus information hub for college students.
Extract the structured information from the following college announcement / notice text into strict JSON.

Rules:
1. Extract accurately without inventing or hallucinating missing details.
2. If Date, Time, Venue, or Deadline are missing, set them to null.
3. Category MUST be one of: "Academic", "Events", "Sports", "Cultural", "Placement", "Examination", "General".
4. Priority MUST be one of: "Urgent", "High", "Normal", "Low".
5. Date format must be "YYYY-MM-DD" if extractable, or null.
6. Return only valid JSON with this exact structure:
{
  "title": "string",
  "category": "Academic"|"Events"|"Sports"|"Cultural"|"Placement"|"Examination"|"General",
  "date": "YYYY-MM-DD or null",
  "time": "string or null",
  "venue": "string or null",
  "description": "clean, coherent summary string",
  "deadline": "YYYY-MM-DD or null",
  "priority": "Urgent"|"High"|"Normal"|"Low",
  "organizer": "string or null",
  "contactInfo": "string or null",
  "missingFields": ["array of names of fields that were missing in the text"]
}

Notice Text:
"""
${rawText}
"""`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${trimmedKey}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn("Gemini API call failed, falling back to heuristics:", errData);
      const fallbackResult = extractWithHeuristics(rawText);
      fallbackResult.apiNotice = `Gemini API returned error (${response.status}). Used Smart Heuristics parser instead.`;
      return fallbackResult;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed = JSON.parse(candidateText);
    
    // Validate missing fields array
    const missing = [];
    if (!parsed.date) missing.push("Date");
    if (!parsed.time) missing.push("Time");
    if (!parsed.venue) missing.push("Venue");
    if (!parsed.deadline && /deadline|due|register before|last date/i.test(rawText)) missing.push("Deadline");

    return {
      title: parsed.title || "Announcement",
      category: parsed.category || "General",
      date: parsed.date || "",
      time: parsed.time || "",
      venue: parsed.venue || "",
      description: parsed.description || rawText.substring(0, 200),
      deadline: parsed.deadline || "",
      priority: parsed.priority || "Normal",
      organizer: parsed.organizer || "",
      contactInfo: parsed.contactInfo || "",
      missingFields: parsed.missingFields || missing,
      engineUsed: "Google Gemini 1.5 Flash (Live AI Connected)",
      isLiveLLM: true
    };
  } catch (err) {
    console.error("AI Extraction error:", err);
    const fallbackResult = extractWithHeuristics(rawText);
    fallbackResult.apiNotice = `Live AI error (${err.message}). Safely defaulted to Smart Rule-Based NLP Engine.`;
    return fallbackResult;
  }
}

