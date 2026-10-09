import { allSkills, domainSkills } from "@/lib/dsat/domain-skills";
import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Fetch user profile data
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.exists() ? userDoc.data() : null;

    // Fetch user progress data
    const progressQuery = query(
      collection(db, "userProgress"),
      where("userId", "==", userId),
    );
    const progressSnapshot = await getDocs(progressQuery);
    const userProgress = progressSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("User progress count:", userProgress.length);

    // Calculate total accuracy
    const totalCorrect = userProgress.filter((progress: any) => {
      if (!progress.attempts || progress.attempts.length === 0) return false;
      const lastAttempt = progress.attempts[progress.attempts.length - 1];
      return lastAttempt.isCorrect;
    }).length;

    const accuracy =
      userProgress.length > 0
        ? Math.round((totalCorrect / userProgress.length) * 100)
        : 0;

    // Calculate domain stats
    const domainStats: any = {};

    // Initialize all official domains with zero stats
    const officialDomains = Object.keys(domainSkills);

    officialDomains.forEach((domain) => {
      domainStats[domain] = { correct: 0, total: 0 };
    });

    // Initialize uncategorized category
    domainStats["Uncategorized"] = { correct: 0, total: 0 };

    userProgress.forEach((progress: any) => {
      let domain = progress.domain;
      const skill = progress.skill;

      // If domain is missing, try to infer it from the skill name
      if (!domain && skill) {
        const skillLower = skill.toLowerCase();
        if (
          skillLower.includes("central ideas") ||
          skillLower.includes("inferences") ||
          skillLower.includes("command of evidence")
        ) {
          domain = "Information and Ideas";
        } else if (
          skillLower.includes("rhetorical") ||
          skillLower.includes("transitions")
        ) {
          domain = "Expression of Ideas";
        } else if (
          skillLower.includes("words in context") ||
          skillLower.includes("text structure") ||
          skillLower.includes("cross-text")
        ) {
          domain = "Craft and Structure";
        } else if (
          skillLower.includes("boundaries") ||
          skillLower.includes("form") ||
          skillLower.includes("structure and sense") ||
          skillLower === "form structure and sense"
        ) {
          domain = "Standard English Conventions";
        }
      }

      // If still no domain, count as uncategorized
      if (!domain) {
        domain = "Uncategorized";
      }

      // Fix domain names to match official SAT naming convention from domain-skills.ts
      const domainLower = domain.toLowerCase();

      if (domainLower.includes("standard english convention")) {
        domain = "Standard English Conventions";
      } else if (domainLower.includes("information and idea")) {
        domain = "Information and Ideas";
      } else if (domainLower.includes("expression of idea")) {
        domain = "Expression of Ideas";
      } else if (domainLower.includes("craft and structure")) {
        domain = "Craft and Structure";
      } else if (domainLower.includes("expression of ideas")) {
        domain = "Expression of Ideas";
      } else if (domainLower.includes("information and ideas")) {
        domain = "Information and Ideas";
      }

      // Add to appropriate domain stats
      if (!domainStats[domain]) {
        domainStats[domain] = { correct: 0, total: 0 };
      }

      domainStats[domain].total++;

      if (progress.attempts && progress.attempts.length > 0) {
        const lastAttempt = progress.attempts[progress.attempts.length - 1];
        if (lastAttempt.isCorrect) {
          domainStats[domain].correct++;
        }
      }
    });

    console.log("Domain stats:", domainStats);

    const total = userProgress.length;
    const domainStatsArray = Object.entries(domainStats)
      .map(([domain, stats]: [string, any]) => ({
        domain,
        type: /math/i.test(domain) ? "Math" : "R&W",
        accuracy:
          stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        share: total > 0 ? (stats.total / total) * 100 : 0,
        total: stats.total,
      }))
      .filter((item) => item.domain !== "Uncategorized")
      .sort((a, b) => b.total - a.total);

    // Calculate detailed domain and skill stats
    const domainDetailedStats: any = {};
    const skillDetailedStats: any = {};

    // Initialize all official domains with zero stats
    officialDomains.forEach((domain) => {
      domainDetailedStats[domain] = {
        total: 0,
        correct: 0,
        totalTime: 0,
        correctTime: 0,
      };
    });

    // Initialize uncategorized category
    domainDetailedStats["Uncategorized"] = {
      total: 0,
      correct: 0,
      totalTime: 0,
      correctTime: 0,
    };

    // Initialize all official skills with zero stats
    allSkills.forEach((skill) => {
      skillDetailedStats[skill] = {
        total: 0,
        correct: 0,
        totalTime: 0,
        correctTime: 0,
      };
    });

    userProgress.forEach((progress: any) => {
      let domain = progress.domain;
      const skill = progress.skill;

      // If domain is missing, try to infer it from the skill name
      if (!domain && skill) {
        const skillLower = skill.toLowerCase();
        if (
          skillLower.includes("central ideas") ||
          skillLower.includes("inferences") ||
          skillLower.includes("command of evidence")
        ) {
          domain = "Information and Ideas";
        } else if (
          skillLower.includes("rhetorical") ||
          skillLower.includes("transitions")
        ) {
          domain = "Expression of Ideas";
        } else if (
          skillLower.includes("words in context") ||
          skillLower.includes("text structure") ||
          skillLower.includes("cross-text")
        ) {
          domain = "Craft and Structure";
        } else if (
          skillLower.includes("boundaries") ||
          skillLower.includes("form") ||
          skillLower.includes("structure and sense") ||
          skillLower === "form structure and sense"
        ) {
          domain = "Standard English Conventions";
        }
      }

      // If still no domain, count as uncategorized
      if (!domain) {
        domain = "Uncategorized";
      }

      // Fix domain names to match official SAT naming convention from domain-skills.ts
      const domainLower = domain.toLowerCase();

      if (domainLower.includes("standard english convention")) {
        domain = "Standard English Conventions";
      } else if (domainLower.includes("information and idea")) {
        domain = "Information and Ideas";
      } else if (domainLower.includes("expression of idea")) {
        domain = "Expression of Ideas";
      } else if (domainLower.includes("craft and structure")) {
        domain = "Craft and Structure";
      } else if (domainLower.includes("expression of ideas")) {
        domain = "Expression of Ideas";
      } else if (domainLower.includes("information and ideas")) {
        domain = "Information and Ideas";
      }

      // Domain stats
      if (!domainDetailedStats[domain]) {
        domainDetailedStats[domain] = {
          total: 0,
          correct: 0,
          totalTime: 0,
          correctTime: 0,
        };
      }
      domainDetailedStats[domain].total++;

      if (progress.attempts && progress.attempts.length > 0) {
        const lastAttempt = progress.attempts[progress.attempts.length - 1];
        if (lastAttempt.isCorrect) {
          domainDetailedStats[domain].correct++;
          domainDetailedStats[domain].correctTime += lastAttempt.timeSpent || 0;
        }
        domainDetailedStats[domain].totalTime += lastAttempt.timeSpent || 0;
      }

      // Skill stats - normalize skill name to match official names
      let normalizedSkill = skill;
      const skillLower = skill ? skill.toLowerCase() : "";

      if (
        skillLower.includes("form") &&
        skillLower.includes("structure") &&
        skillLower.includes("sense")
      ) {
        normalizedSkill = "Form, Structure, and Sense";
      }

      // Skip if no skill or not an official skill after normalization
      if (!normalizedSkill || !allSkills.includes(normalizedSkill)) {
        return;
      }

      skillDetailedStats[normalizedSkill].total++;

      if (progress.attempts && progress.attempts.length > 0) {
        const lastAttempt = progress.attempts[progress.attempts.length - 1];
        if (lastAttempt.isCorrect) {
          skillDetailedStats[normalizedSkill].correct++;
          skillDetailedStats[normalizedSkill].correctTime +=
            lastAttempt.timeSpent || 0;
        }
        skillDetailedStats[normalizedSkill].totalTime +=
          lastAttempt.timeSpent || 0;
      }
    });

    const formatTime = (ms: number) => {
      if (ms === 0) return "0s";
      const seconds = Math.floor(ms / 1000);
      if (seconds < 60) return `${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    };

    const detailedDomains = Object.entries(domainDetailedStats)
      .map(([domain, stats]: [string, any]) => ({
        domain,
        total: stats.total,
        accuracy:
          stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        avgTime:
          stats.total > 0 ? formatTime(stats.totalTime / stats.total) : "0s",
        correctAvgTime:
          stats.correct > 0
            ? formatTime(stats.correctTime / stats.correct)
            : "N/A",
      }))
      .filter((item) => item.domain !== "Uncategorized")
      .sort((a, b) => b.total - a.total);

    // Group skills by domain
    const skillsByDomain: Record<string, any[]> = {};

    // Initialize with official domains
    officialDomains.forEach((domain) => {
      skillsByDomain[domain] = [];
    });

    Object.entries(skillDetailedStats).forEach(
      ([skill, stats]: [string, any]) => {
        // Find which domain this skill belongs to
        let skillDomain = null;
        for (const [domain, skills] of Object.entries(domainSkills)) {
          if (skills.includes(skill)) {
            skillDomain = domain;
            break;
          }
        }

        if (skillDomain && skillsByDomain[skillDomain]) {
          skillsByDomain[skillDomain].push({
            skill,
            total: stats.total,
            accuracy:
              stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0,
            avgTime:
              stats.total > 0
                ? formatTime(stats.totalTime / stats.total)
                : "0s",
            correctAvgTime:
              stats.correct > 0
                ? formatTime(stats.correctTime / stats.correct)
                : "N/A",
          });
        }
      },
    );

    // Sort skills within each domain by total count
    Object.keys(skillsByDomain).forEach((domain) => {
      skillsByDomain[domain].sort((a, b) => b.total - a.total);
    });

    // Calculate practice streak
    const calculatePracticeStreak = () => {
      if (userProgress.length === 0) return 0;

      const dates = userProgress
        .map((p: any) =>
          p.lastAttemptedAt ? new Date(p.lastAttemptedAt).toDateString() : null,
        )
        .filter((d) => d !== null)
        .reverse();

      const uniqueDates = [...new Set(dates)];
      let streak = 0;
      let currentDate = new Date();

      for (const date of uniqueDates) {
        const answerDate = new Date(date);
        const diffDays = Math.floor(
          (currentDate.getTime() - answerDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (diffDays === streak) {
          streak++;
          currentDate = new Date(answerDate);
        } else if (diffDays === streak + 1) {
          streak++;
          currentDate = new Date(answerDate);
        } else {
          break;
        }
      }

      return streak;
    };

    // Calculate weekly questions
    const getWeeklyQuestions = () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return userProgress.filter((p: any) => {
        const answerDate = p.lastAttemptedAt
          ? new Date(p.lastAttemptedAt)
          : new Date();
        return answerDate >= oneWeekAgo;
      }).length;
    };

    // Calculate total practice time (in minutes)
    const getTotalPracticeTime = () => {
      const totalTimeMs = userProgress.reduce(
        (total: number, progress: any) => {
          if (!progress.attempts) return total;
          const attemptsTime = progress.attempts.reduce(
            (acc: number, attempt: any) => {
              return acc + (attempt.timeSpent || 0);
            },
            0,
          );
          return total + attemptsTime;
        },
        0,
      );
      return Math.floor(totalTimeMs / 60000);
    };

    // Calculate daily activity for the chart
    const getDailyActivity = () => {
      const days: { date: string; count: number }[] = [];
      const counts: Record<string, number> = {};

      userProgress.forEach((progress: any) => {
        if (!progress.lastAttemptedAt) return;
        const key = new Date(progress.lastAttemptedAt).toDateString();
        counts[key] = (counts[key] || 0) + 1;
      });

      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toDateString();
        days.push({ date: key, count: counts[key] || 0 });
      }

      return days;
    };

    return NextResponse.json({
      userData,
      totalQuestions: userProgress.length,
      accuracy,
      domainStats: domainStatsArray,
      detailedStats: {
        domains: detailedDomains,
        skillsByDomain,
      },
      streak: calculatePracticeStreak(),
      weeklyQuestions: getWeeklyQuestions(),
      totalPracticeTime: getTotalPracticeTime(),
      dailyActivity: getDailyActivity(),
      dailyGoal: userData?.dailyGoal || 20,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: String(error) },
      { status: 500 },
    );
  }
}
