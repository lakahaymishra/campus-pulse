// Campus Pulse - AI Weekly Summary Service
// "What Do I Need to Know This Week?"
// Dynamically analyzes all stored announcements for the current week / upcoming days

/**
 * Filter announcements relevant to the current week (from referenceDate)
 */
export function getThisWeekAnnouncements(announcements, referenceDateStr = "2026-10-31") {
  const refDate = new Date(referenceDateStr);
  const endOfWeek = new Date(refDate);
  endOfWeek.setDate(refDate.getDate() + 7);

  return announcements.filter(item => {
    if (!item.date) return false;
    const itemDate = new Date(item.date);
    // Include today and next 7 days
    return itemDate >= refDate && itemDate <= endOfWeek;
  });
}

/**
 * Built-in Rule-Based Weekly Summary Generator
 * Generates an executive, categorized briefing from the actual saved notices.
 */
export function generateHeuristicWeeklySummary(announcements, referenceDateStr = "2026-10-31") {
  const weekNotices = getThisWeekAnnouncements(announcements, referenceDateStr);

  const urgentList = weekNotices.filter(n => n.priority === "Urgent");
  const examList = weekNotices.filter(n => n.category === "Examination");
  const assignmentList = weekNotices.filter(n => n.category === "Academic" && /assignment|homework|submission|lab/i.test(n.title + " " + n.description));
  const placementList = weekNotices.filter(n => n.category === "Placement");
  const eventsList = weekNotices.filter(n => ["Events", "Sports", "Cultural"].includes(n.category));

  // Key takeaways
  const takeaways = [];
  if (urgentList.length > 0) {
    takeaways.push(`⚠️ ${urgentList.length} urgent matter${urgentList.length > 1 ? 's' : ''} requiring immediate action.`);
  }
  if (examList.length > 0) {
    takeaways.push(`📝 Examination schedules start this week (${examList[0].date}). Ensure hall tickets are cleared.`);
  }
  if (assignmentList.length > 0) {
    takeaways.push(`💻 ${assignmentList.length} critical academic assignment deadline${assignmentList.length > 1 ? 's' : ''}.`);
  }
  if (placementList.length > 0) {
    takeaways.push(`💼 Placement & internship opportunities active.`);
  }
  if (eventsList.length > 0) {
    takeaways.push(`🎉 ${eventsList.length} sports & campus events scheduled.`);
  }

  // Create action items checklist
  const actionItems = [];
  weekNotices.forEach(n => {
    if (n.deadline) {
      actionItems.push({
        id: `act-${n.id}`,
        title: `Complete: ${n.title}`,
        deadline: n.deadline,
        priority: n.priority,
        completed: false
      });
    } else if (n.priority === "Urgent") {
      actionItems.push({
        id: `act-${n.id}`,
        title: `Attend / Verify: ${n.title}`,
        deadline: n.date,
        priority: n.priority,
        completed: false
      });
    }
  });

  return {
    period: "Upcoming 7 Days (Oct 31 - Nov 07, 2026)",
    totalWeekCount: weekNotices.length,
    takeaways,
    sections: [
      {
        title: "🚨 Urgent Notices & Immediate Deadlines",
        badge: "Highest Attention",
        badgeColor: "rose",
        items: urgentList.map(n => ({
          title: n.title,
          date: n.date,
          time: n.time || "All day",
          venue: n.venue || "Campus",
          note: n.deadline ? `Deadline: ${n.deadline}` : n.description.substring(0, 100) + "..."
        }))
      },
      {
        title: "📝 Examination Announcements",
        badge: "Exam Cell",
        badgeColor: "amber",
        items: examList.map(n => ({
          title: n.title,
          date: n.date,
          time: n.time,
          venue: n.venue,
          note: n.deadline ? `Hall Ticket Deadline: ${n.deadline}` : n.description.substring(0, 100) + "..."
        }))
      },
      {
        title: "💻 Assignment Deadlines & Academics",
        badge: "Submissions",
        badgeColor: "indigo",
        items: assignmentList.map(n => ({
          title: n.title,
          date: n.date,
          time: n.time,
          venue: n.venue,
          note: n.description.substring(0, 110) + "..."
        }))
      },
      {
        title: "💼 Placement & Internship Updates",
        badge: "Career Hub",
        badgeColor: "emerald",
        items: placementList.map(n => ({
          title: n.title,
          date: n.date,
          time: n.time,
          venue: n.venue,
          note: n.deadline ? `Portal Closes: ${n.deadline}` : n.description.substring(0, 100) + "..."
        }))
      },
      {
        title: "🏆 Events, Sports & Cultural",
        badge: "Campus Life",
        badgeColor: "sky",
        items: eventsList.map(n => ({
          title: n.title,
          date: n.date,
          time: n.time,
          venue: n.venue,
          note: n.description.substring(0, 100) + "..."
        }))
      }
    ].filter(sec => sec.items.length > 0),
    actionItems,
    engine: "Built-in Smart Heuristic Engine (Demo Mode)",
    isLiveLLM: false
  };
}

/**
 * Generate AI Weekly Summary using Gemini API or fallback to heuristics
 */
export async function generateWeeklySummary(announcements, apiKey = "", referenceDateStr = "2026-10-31") {
  const trimmedKey = (apiKey || "").trim();
  const weekNotices = getThisWeekAnnouncements(announcements, referenceDateStr);

  if (!trimmedKey || weekNotices.length === 0) {
    // Small realistic delay
    await new Promise(r => setTimeout(r, 600));
    return generateHeuristicWeeklySummary(announcements, referenceDateStr);
  }

  try {
    const noticesList = weekNotices.map(n => `- [${n.priority}] ${n.title} (Category: ${n.category}, Date: ${n.date}, Time: ${n.time || "N/A"}, Venue: ${n.venue || "N/A"}, Deadline: ${n.deadline || "None"}): ${n.description}`).join('\n');

    const prompt = `You are the executive campus AI for students using "Campus Pulse".
Generate a high-impact, easy-to-read "What Do I Need to Know This Week?" briefing for the student based ONLY on the actual announcements scheduled for this week (Oct 31 - Nov 07, 2026).

Announcements:
${noticesList}

Output strict JSON with this exact structure:
{
  "period": "Upcoming 7 Days (Oct 31 - Nov 07, 2026)",
  "executiveSummary": "2-3 crisp sentences highlighting what cannot be missed",
  "takeaways": ["3-5 short bullet points with emojis"],
  "sections": [
    {
      "title": "🚨 Urgent Notices",
      "badge": "Urgent",
      "badgeColor": "rose",
      "items": [{ "title": "string", "date": "string", "time": "string", "venue": "string", "note": "string" }]
    },
    {
      "title": "📝 Examination Announcements",
      "badge": "Exams",
      "badgeColor": "amber",
      "items": [...]
    },
    {
      "title": "💻 Assignment Deadlines",
      "badge": "Academic",
      "badgeColor": "indigo",
      "items": [...]
    },
    {
      "title": "💼 Placement Updates",
      "badge": "Career",
      "badgeColor": "emerald",
      "items": [...]
    },
    {
      "title": "🏆 Events & Campus Life",
      "badge": "Events",
      "badgeColor": "sky",
      "items": [...]
    }
  ],
  "actionItems": [
    {
      "id": "act-1",
      "title": "Concise actionable task",
      "deadline": "YYYY-MM-DD or date string",
      "priority": "Urgent"|"High"|"Normal"
    }
  ]
}
Only include sections that have at least one item. Keep all text concise, clear, and actionable.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${trimmedKey}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      console.warn("Gemini weekly summary failed, falling back to heuristics");
      const heuristicResult = generateHeuristicWeeklySummary(announcements, referenceDateStr);
      heuristicResult.apiNotice = "Gemini API unavailable. Generated using Smart Heuristic Summarizer.";
      return heuristicResult;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("No response content");

    const parsed = JSON.parse(candidateText);
    return {
      period: parsed.period || "This Week",
      totalWeekCount: weekNotices.length,
      executiveSummary: parsed.executiveSummary,
      takeaways: parsed.takeaways || [],
      sections: parsed.sections || [],
      actionItems: (parsed.actionItems || []).map((a, i) => ({
        ...a,
        id: a.id || `act-${i}`,
        completed: false
      })),
      engine: "Google Gemini 1.5 Flash (Live AI Connected)",
      isLiveLLM: true
    };
  } catch (err) {
    console.error("Weekly summary LLM error:", err);
    const heuristicResult = generateHeuristicWeeklySummary(announcements, referenceDateStr);
    heuristicResult.apiNotice = `Fallback active: ${err.message}`;
    return heuristicResult;
  }
}

