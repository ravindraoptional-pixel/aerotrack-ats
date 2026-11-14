import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Kanban,
  Users,
  Briefcase,
  BarChart3,
  Search,
  Plus,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ChevronDown,
  X,
  Star,
  Copy,
  Check,
  Download,
  RotateCcw,
  ExternalLink,
  FileText,
  Clock,
  Award,
  Building2,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  ArrowUpDown,
  Globe,
  TrendingUp,
  Send,
  Trash2,
  Menu,
  Filter,
  Layers,
  ShieldCheck,
  Compass
} from 'lucide-react';

// ============================================================================
// 1. CONSTANTS, STAGES & INITIAL SEED DATA
// ============================================================================

const STORAGE_KEYS = {
  JOBS: 'aerotrack_ats_jobs_v1',
  CANDIDATES: 'aerotrack_ats_candidates_v1',
};

const PIPELINE_STAGES = [
  { id: 'Applied', label: 'Applied', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'Screening', label: 'Screening', dotColor: 'bg-sky-500', badgeBg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Interview', label: 'Interview', dotColor: 'bg-indigo-500', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Offer', label: 'Offer', dotColor: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Hired', label: 'Hired', dotColor: 'bg-[#19C3A6]', badgeBg: 'bg-teal-50 text-teal-800 border-teal-200' },
];

const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer',
    department: 'Flight Telemetry & Cloud',
    location: 'Remote / Hybrid (Seattle, WA)',
    type: 'Full-Time',
    status: 'Active',
    salaryRange: '$175,000 – $215,000',
    createdAt: '2026-10-14',
    description:
      'Architect and scale real-time ground control and vehicle telemetry web applications. You will build low-latency WebSocket streaming pipelines, TypeScript/React mission dashboards, and resilient Node.js/Go microservices supporting orbital and autonomous flight operations.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    id: 'job-2',
    title: 'AI/ML Perception Engineer',
    department: 'Autonomous Guidance',
    location: 'Bengaluru / Hybrid',
    type: 'Full-Time',
    status: 'Active',
    salaryRange: '$160,000 – $205,000',
    createdAt: '2026-10-18',
    description:
      'Design, train, and deploy real-time computer vision and sensor-fusion models for autonomous aerial navigation in GPS-denied environments. Strong proficiency in PyTorch, C++, TensorRT optimization, and multi-modal LiDAR/EO-IR perception pipelines required.',
    requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'C++', 'TensorRT', 'Sensor Fusion', 'ROS2'],
  },
  {
    id: 'job-3',
    title: 'Staff Product Designer',
    department: 'Mission Control UX',
    location: 'San Francisco, CA / Remote',
    type: 'Full-Time',
    status: 'Active',
    salaryRange: '$165,000 – $195,000',
    createdAt: '2026-10-22',
    description:
      'Lead end-to-end human-machine interface (HMI) design for high-stakes telemetry consoles, fleet command centers, and automated anomaly diagnostics. Must excel in complex data visualization, design systems, and rapid interactive prototyping.',
    requiredSkills: ['Figma', 'Design Systems', 'Data Visualization', 'Prototyping', 'User Research', 'HMI'],
  },
  {
    id: 'job-4',
    title: 'Enterprise Account Executive',
    department: 'Commercial & Defense Sales',
    location: 'Washington, D.C.',
    type: 'Full-Time',
    status: 'Active',
    salaryRange: '$150,000 Base + $150,000 OTE',
    createdAt: '2026-10-27',
    description:
      'Drive enterprise and government adoption of our autonomous airspace software platform. Manage complex multi-stakeholder sales cycles, executive briefings, and strategic partnerships across aerospace primes and commercial logistics operators.',
    requiredSkills: ['Enterprise SaaS', 'Defense Contracting', 'MEDDIC', 'Executive Negotiation', 'Pipeline Strategy'],
  },
];

const INITIAL_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.io',
    phone: '+1 (206) 555-0148',
    location: 'Seattle, WA',
    currentRole: 'Principal Frontend & Telemetry Engineer',
    experienceYears: 8,
    skills: ['React', 'TypeScript', 'WebSockets', 'Node.js', 'WebGL', 'AWS'],
    jobId: 'job-1',
    stage: 'Offer',
    matchScore: 95,
    matchSummary:
      'Exceptional alignment with 8 years building real-time WebSocket telemetry interfaces in React and TypeScript. Minor gap in direct PostgreSQL query tuning, easily offset by deep distributed cloud experience.',
    source: 'Direct Sourcing',
    appliedDate: '2026-10-20',
    scorecard: { technical: 5, problemSolving: 5, communication: 5, culture: 4 },
    notes: [
      {
        id: 'n-1',
        author: 'Marcus Vance (VP Eng)',
        text: 'Outstanding live architecture session—designed a 60fps telemetry stream buffer in under 35 minutes.',
        timestamp: '2026-11-04 14:20',
      },
    ],
  },
  {
    id: 'cand-2',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@example.in',
    phone: '+91 98450 11294',
    location: 'Bengaluru, India',
    currentRole: 'Senior Computer Vision Scientist',
    experienceYears: 6,
    skills: ['Python', 'PyTorch', 'Computer Vision', 'TensorRT', 'C++', 'SLAM'],
    jobId: 'job-2',
    stage: 'Interview',
    matchScore: 92,
    matchSummary:
      'Strong production background deploying quantized PyTorch and TensorRT vision models on edge avionics hardware. Could benefit from deeper hands-on ROS2 middleware exposure.',
    source: 'LinkedIn Recruiter',
    appliedDate: '2026-10-24',
    scorecard: { technical: 5, problemSolving: 4, communication: 5, culture: 5 },
    notes: [
      {
        id: 'n-2',
        author: 'Dr. Priya Nair (Autonomy Lead)',
        text: 'Passed technical screening with top marks on stereo depth estimation and low-light inference latency.',
        timestamp: '2026-11-02 11:05',
      },
    ],
  },
  {
    id: 'cand-3',
    name: 'Maya Lin-Kowalski',
    email: 'maya.lk@example.design',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    currentRole: 'Staff Systems & Data Designer',
    experienceYears: 9,
    skills: ['Figma', 'Design Systems', 'Data Visualization', 'Prototyping', 'HMI', 'React'],
    jobId: 'job-3',
    stage: 'Hired',
    matchScore: 97,
    matchSummary:
      'Rare blend of mission-critical HMI ergonomics, complex telemetry data visualization, and production Figma design systems. Zero material skill gaps against the requisition.',
    source: 'Employee Referral',
    appliedDate: '2026-10-16',
    scorecard: { technical: 5, problemSolving: 5, communication: 5, culture: 5 },
    notes: [
      {
        id: 'n-3',
        author: 'Claire Sterling (Head of Design)',
        text: 'Signed offer! Starting Nov 30 to lead the Mission Control v3 design language.',
        timestamp: '2026-11-10 16:45',
      },
    ],
  },
  {
    id: 'cand-4',
    name: 'Devon Brooks',
    email: 'dbrooks.aero@example.com',
    phone: '+1 (703) 555-0174',
    location: 'Arlington, VA',
    currentRole: 'Senior Federal & Aerospace Account Director',
    experienceYears: 10,
    skills: ['Enterprise SaaS', 'Defense Contracting', 'MEDDIC', 'Executive Negotiation', 'GovCloud'],
    jobId: 'job-4',
    stage: 'Interview',
    matchScore: 89,
    matchSummary:
      'Proven track record closing $4M+ ARR across aerospace primes and DoD innovation units using MEDDIC. Commercial logistics pipeline experience is lighter than defense.',
    source: 'Career Portal',
    appliedDate: '2026-10-29',
    scorecard: { technical: 4, problemSolving: 4, communication: 5, culture: 5 },
    notes: [
      {
        id: 'n-4',
        author: 'Sarah Jenkins (CRO)',
        text: 'Strong executive presence and existing relationships with Tier-1 propulsion and UAV primes.',
        timestamp: '2026-11-06 09:30',
      },
    ],
  },
  {
    id: 'cand-5',
    name: 'Lucas Lindqvist',
    email: 'lucas.lindqvist@example.se',
    phone: '+46 70 555 8310',
    location: 'Remote (Austin, TX)',
    currentRole: 'Full-Stack Distributed Systems Engineer',
    experienceYears: 5,
    skills: ['TypeScript', 'React', 'PostgreSQL', 'Docker', 'Node.js', 'GraphQL'],
    jobId: 'job-1',
    stage: 'Screening',
    matchScore: 84,
    matchSummary:
      'Solid full-stack TypeScript, Node.js, and PostgreSQL fundamentals with clean container workflows. Lacks high-frequency WebSocket telemetry experience, which should be probed in technical screen.',
    source: 'Career Portal',
    appliedDate: '2026-11-03',
    scorecard: { technical: 4, problemSolving: 4, communication: 4, culture: 4 },
    notes: [],
  },
  {
    id: 'cand-6',
    name: 'Nadia Al-Mansoor',
    email: 'nadia.almansoor@example.ai',
    phone: '+1 (650) 555-0133',
    location: 'Bengaluru / Remote',
    currentRole: 'Robotics Perception & Sensor Fusion Engineer',
    experienceYears: 5,
    skills: ['Python', 'C++', 'Sensor Fusion', 'ROS2', 'PyTorch', 'LiDAR'],
    jobId: 'job-2',
    stage: 'Screening',
    matchScore: 88,
    matchSummary:
      'Hands-on multi-sensor LiDAR/IMU fusion and ROS2 autonomy experience with strong C++ fundamentals. TensorRT edge model quantization exposure is moderate.',
    source: 'Direct Sourcing',
    appliedDate: '2026-11-05',
    scorecard: { technical: 4, problemSolving: 5, communication: 4, culture: 4 },
    notes: [],
  },
  {
    id: 'cand-7',
    name: 'Julian Mercer',
    email: 'j.mercer@example.co',
    phone: '+1 (312) 555-0161',
    location: 'Chicago, IL',
    currentRole: 'Senior Product Designer',
    experienceYears: 6,
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'SaaS UX'],
    jobId: 'job-3',
    stage: 'Applied',
    matchScore: 76,
    matchSummary:
      'Strong B2B SaaS design systems and user research portfolio in Figma. Limited exposure to real-time telemetry data visualization and command-and-control HMI workflows.',
    source: 'Career Portal',
    appliedDate: '2026-11-09',
    scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 },
    notes: [],
  },
  {
    id: 'cand-8',
    name: 'Chloe Moreau',
    email: 'chloe.moreau@example.io',
    phone: '+1 (202) 555-0185',
    location: 'Washington, D.C.',
    currentRole: 'Enterprise Account Executive',
    experienceYears: 4,
    skills: ['Enterprise SaaS', 'Pipeline Strategy', 'Salesforce', 'Outbound'],
    jobId: 'job-4',
    stage: 'Applied',
    matchScore: 68,
    matchSummary:
      'Consistent mid-market and enterprise SaaS quota attainment with disciplined pipeline strategy. Lacks direct federal defense contracting and complex aerospace procurement cycles.',
    source: 'LinkedIn Recruiter',
    appliedDate: '2026-11-11',
    scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 },
    notes: [],
  },
  {
    id: 'cand-9',
    name: 'Kenji Takahashi',
    email: 'kenji.t@example.dev',
    phone: '+1 (425) 555-0119',
    location: 'Seattle, WA',
    currentRole: 'Cloud & Backend Software Engineer',
    experienceYears: 7,
    skills: ['Node.js', 'AWS', 'PostgreSQL', 'Docker', 'Go', 'Kubernetes'],
    jobId: 'job-1',
    stage: 'Applied',
    matchScore: 81,
    matchSummary:
      'Deep cloud infrastructure, AWS, and PostgreSQL reliability engineering across 7 years. Frontend React and real-time UI experience is secondary to backend systems.',
    source: 'Career Portal',
    appliedDate: '2026-11-12',
    scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 },
    notes: [],
  },
];

const SAMPLE_RESUMES = [
  {
    label: 'Sample 1: Flight Telemetry Full-Stack Eng',
    defaultJobId: 'job-1',
    text: `SOPHIA CHEN-RAMIREZ
Senior Full-Stack & Telemetry Systems Engineer
Email: sophia.chenramirez@example.dev | Phone: +1 (206) 555-0198 | Location: Seattle, WA

SUMMARY
Staff-level Full-Stack Engineer with 9 years of experience building low-latency mission telemetry platforms, WebSocket streaming pipelines, and resilient cloud backends for commercial spaceflight and autonomous drone fleets.

EXPERIENCE
Lead Full-Stack Engineer — OrbitalLink Systems (2022 – Present)
- Architected real-time ground control web consoles in React, TypeScript, and WebSockets ingesting 25,000+ telemetry frames/sec with sub-80ms glass-to-glass latency.
- Designed Node.js and PostgreSQL time-series ingestion services deployed on AWS ECS and Docker.

Senior Software Engineer — AeroGrid Cloud (2018 – 2022)
- Built role-based mission replay tools and automated anomaly alerting dashboards using React, TypeScript, and GraphQL.

SKILLS
React, TypeScript, Node.js, WebSockets, PostgreSQL, AWS, Docker, Redis, WebGL`,
  },
  {
    label: 'Sample 2: AI/ML Perception & Robotics Eng',
    defaultJobId: 'job-2',
    text: `ROHAN DESHMUKH
Senior Autonomous Perception & Computer Vision Engineer
Email: rohan.deshmukh@example.ai | Phone: +91 99001 44821 | Location: Bengaluru, India

SUMMARY
AI/ML Perception Engineer with 7 years of experience developing real-time multi-sensor fusion, visual odometry, and edge-deployed neural networks for autonomous aerial vehicles.

EXPERIENCE
Senior Perception Engineer — Skyward Robotics (2021 – Present)
- Trained and quantized PyTorch object detection and semantic segmentation models using TensorRT and C++ on NVIDIA Jetson Orin at 60 FPS.
- Integrated LiDAR, stereo EO-IR cameras, and IMU streams using ROS2 and Kalman filtering for GPS-denied navigation.

ML Research Engineer — VisionCore Labs (2019 – 2021)
- Developed synthetic data pipelines and deep learning benchmarks in Python and PyTorch.

SKILLS
Python, PyTorch, Computer Vision, C++, TensorRT, Sensor Fusion, ROS2, CUDA, OpenCV`,
  },
  {
    label: 'Sample 3: Staff Product Designer (Mission UI)',
    defaultJobId: 'job-3',
    text: `HANNAH VANDERBILT
Staff Product Designer — Complex Systems & HMI
Email: hannah.v@example.design | Phone: +1 (415) 555-0144 | Location: San Francisco, CA

SUMMARY
Systems-minded Staff Product Designer with 8 years of experience crafting high-density telemetry interfaces, multi-vehicle command consoles, and scalable Figma design systems.

EXPERIENCE
Staff Product Designer — Sentinel Fleet Systems (2021 – Present)
- Spearheaded the Mission Control HMI redesign, reducing operator alert-triage time by 42% through clear data visualization and keyboard-first workflows.
- Maintained a 140-component dark/light Figma design system paired with interactive code prototypes.

Senior UX Designer — MetricFlow Analytics (2018 – 2021)
- Conducted contextual inquiry and usability testing with aerospace and energy control-room operators.

SKILLS
Figma, Design Systems, Data Visualization, Prototyping, User Research, HMI, Accessibility`,
  },
];

// ============================================================================
// 2. BOOLEAN SEARCH ENGINE (SUPPORTS AND, OR, NOT, QUOTES, PARENTHESES)
// ============================================================================

/**
 * Evaluates a Boolean search query (supporting AND, OR, NOT, quotes, and parentheses)
 * against a target searchable text string. Never throws on malformed input.
 */
function evaluateBooleanSearch(query, targetText) {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return true;

  const text = (targetText || '').toLowerCase();

  try {
    // Tokenize into (, ), AND, OR, NOT, "quoted phrases", and single terms
    const tokenRegex = /\(|\)|\bAND\b|\bOR\b|\bNOT\b|"[^"]*"|[^\s()]+/gi;
    const rawTokens = cleanQuery.match(tokenRegex) || [];
    if (rawTokens.length === 0) return true;

    const tokens = rawTokens.map((tok) => {
      const upper = tok.toUpperCase();
      if (tok === '(' || tok === ')') return { type: tok, value: tok };
      if (upper === 'AND' || upper === 'OR' || upper === 'NOT') {
        return { type: upper, value: upper };
      }
      // Support -term shorthand for NOT term
      if (tok.startsWith('-') && tok.length > 1) {
        return { type: 'NOT_TERM', value: tok.slice(1).replace(/^"|"$/g, '').toLowerCase() };
      }
      return { type: 'TERM', value: tok.replace(/^"|"$/g, '').toLowerCase() };
    });

    // Expand -term shorthand into NOT + TERM
    const expanded = [];
    for (const t of tokens) {
      if (t.type === 'NOT_TERM') {
        expanded.push({ type: 'NOT', value: 'NOT' });
        expanded.push({ type: 'TERM', value: t.value });
      } else {
        expanded.push(t);
      }
    }

    // Insert implicit AND where two expressions are adjacent (e.g., "React TypeScript" or "React (AWS OR Docker)")
    const normalized = [];
    for (let i = 0; i < expanded.length; i++) {
      const curr = expanded[i];
      normalized.push(curr);
      if (i < expanded.length - 1) {
        const next = expanded[i + 1];
        const currEndsExpr = curr.type === 'TERM' || curr.type === ')';
        const nextStartsExpr = next.type === 'TERM' || next.type === '(' || next.type === 'NOT';
        if (currEndsExpr && nextStartsExpr) {
          normalized.push({ type: 'AND', value: 'AND' });
        }
      }
    }

    let pos = 0;

    const parseOr = () => {
      let left = parseAnd();
      while (pos < normalized.length && normalized[pos].type === 'OR') {
        pos++;
        const right = parseAnd();
        left = left || right;
      }
      return left;
    };

    const parseAnd = () => {
      let left = parseNot();
      while (pos < normalized.length && normalized[pos].type === 'AND') {
        pos++;
        const right = parseNot();
        left = left && right;
      }
      return left;
    };

    const parseNot = () => {
      if (pos < normalized.length && normalized[pos].type === 'NOT') {
        pos++;
        return !parseNot();
      }
      return parsePrimary();
    };

    const parsePrimary = () => {
      if (pos >= normalized.length) return true;
      const tok = normalized[pos];
      if (tok.type === '(') {
        pos++;
        const val = parseOr();
        if (pos < normalized.length && normalized[pos].type === ')') {
          pos++;
        }
        return val;
      }
      if (tok.type === 'TERM') {
        pos++;
        return text.includes(tok.value);
      }
      // Skip unexpected operator token gracefully
      pos++;
      return true;
    };

    return parseOr();
  } catch {
    return text.includes(cleanQuery.toLowerCase());
  }
}

// ============================================================================
// 3. AI RESUME PARSER & JOB MATCH SCORER (GEMINI API + DETERMINISTIC FALLBACK)
// ============================================================================

const KNOWN_SKILLS_TAXONOMY = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'WebSockets', 'PostgreSQL', 'AWS', 'Docker',
  'Kubernetes', 'Python', 'PyTorch', 'TensorFlow', 'Computer Vision', 'C++', 'TensorRT',
  'Sensor Fusion', 'ROS2', 'CUDA', 'OpenCV', 'Figma', 'Design Systems', 'Data Visualization',
  'Prototyping', 'User Research', 'HMI', 'Enterprise SaaS', 'Defense Contracting', 'MEDDIC',
  'Executive Negotiation', 'Pipeline Strategy', 'GraphQL', 'Go', 'Rust', 'WebGL', 'Redis',
  'SLAM', 'LiDAR', 'Accessibility', 'Salesforce', 'GovCloud', 'SQL', 'Git', 'CI/CD',
];

/**
 * Deterministic local regex + keyword fallback parser so resume parsing
 * always succeeds cleanly even when offline or without an external API key.
 */
function fallbackParseAndScoreResume(rawText, job) {
  const text = (rawText || '').trim();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'candidate@example.com';

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,5}[\s.-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '+1 (555) 010-2026';

  // Extract Name (usually first non-empty line, title-cased)
  let name = 'Alex Morgan';
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/[^a-zA-Z\s'-]/g, '').trim();
    if (firstLine.length >= 3 && firstLine.length <= 45) {
      name = firstLine
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  // Extract Location
  const locationMatch = text.match(/Location:\s*([^\n|]+)/i);
  const location = locationMatch ? locationMatch[1].trim() : 'Remote / Hybrid';

  // Extract Current Role (often second line or after dash in experience)
  let currentRole = 'Software & Systems Specialist';
  if (lines.length > 1 && !lines[1].includes('@') && lines[1].length < 70) {
    currentRole = lines[1];
  } else {
    const roleMatch = text.match(/(?:Lead|Senior|Staff|Principal|Director|Manager|Engineer|Designer|Scientist|Executive)[^\n—–|]{2,45}/i);
    if (roleMatch) currentRole = roleMatch[0].trim();
  }

  // Extract Years of Experience
  const expMatch = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  const experienceYears = expMatch ? Math.min(30, Math.max(1, parseInt(expMatch[1], 10))) : 5;

  // Extract Skills from combined taxonomy + job required skills
  const searchPool = Array.from(new Set([...(job?.requiredSkills || []), ...KNOWN_SKILLS_TAXONOMY]));
  const lowerText = text.toLowerCase();
  const extractedSkills = searchPool.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped.toLowerCase()}(?:$|[^a-zA-Z0-9])`, 'i');
    return regex.test(lowerText);
  });

  const skills = extractedSkills.length > 0 ? extractedSkills.slice(0, 10) : ['Systems Engineering', 'Problem Solving', 'Agile'];

  // Compute deterministic 0-100 match score against selected job
  const reqSkills = job?.requiredSkills || [];
  const matchedReq = reqSkills.filter((req) =>
    skills.some((s) => s.toLowerCase() === req.toLowerCase())
  );
  const missingReq = reqSkills.filter(
    (req) => !skills.some((s) => s.toLowerCase() === req.toLowerCase())
  );

  const skillRatio = reqSkills.length > 0 ? matchedReq.length / reqSkills.length : 0.75;
  const expBonus = Math.min(18, experienceYears * 2);
  const rawScore = Math.round(skillRatio * 74 + expBonus + 6);
  const matchScore = Math.max(42, Math.min(98, rawScore));

  const strengthsPart =
    matchedReq.length > 0
      ? `Strong alignment across ${matchedReq.slice(0, 3).join(', ')} backed by ${experienceYears} years of relevant domain experience.`
      : `Solid ${experienceYears}-year background in ${currentRole} with transferable technical foundations.`;
  const gapsPart =
    missingReq.length > 0
      ? `Potential skill gaps in ${missingReq.slice(0, 2).join(' and ')} should be validated during technical interviews.`
      : `Meets all core technical requirements for ${job?.title || 'the role'} with minimal onboarding ramp.`;

  return {
    name,
    email,
    phone,
    location,
    currentRole,
    experienceYears,
    skills,
    matchScore,
    matchSummary: `${strengthsPart} ${gapsPart}`,
    usedFallback: true,
  };
}

/**
 * Calls Gemini API (gemini-3-flash-preview) with structured JSON schema and exponential backoff.
 * Falls back gracefully to deterministic local extraction if API is unavailable.
 */
async function parseResumeWithGemini(rawText, job) {
  const apiKey = ''; // Runtime-provided when available
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const prompt = `You are an expert aerospace & enterprise technical recruiter AI.
Parse the following candidate resume text into structured profile fields AND evaluate their fit against the target Job Requisition.

TARGET JOB TITLE: ${job?.title || 'Technical Specialist'}
TARGET DEPARTMENT: ${job?.department || 'Engineering'}
TARGET JOB DESCRIPTION: ${job?.description || ''}
REQUIRED SKILLS: ${(job?.requiredSkills || []).join(', ')}

RAW RESUME TEXT:
"""
${rawText}
"""

Return structured JSON matching the schema. The matchSummary must be a concise, objective 2-sentence evaluation highlighting key strengths first and specific gaps second.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          email: { type: 'STRING' },
          phone: { type: 'STRING' },
          location: { type: 'STRING' },
          currentRole: { type: 'STRING' },
          experienceYears: { type: 'NUMBER' },
          skills: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          matchScore: { type: 'NUMBER' },
          matchSummary: { type: 'STRING' },
        },
        required: [
          'name',
          'email',
          'phone',
          'location',
          'currentRole',
          'experienceYears',
          'skills',
          'matchScore',
          'matchSummary',
        ],
      },
    },
  };

  const delays = [1000, 2000, 4000];
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (attempt < delays.length && (response.status === 429 || response.status >= 500)) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw new Error('API fallback triggered');
      }

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) throw new Error('Empty AI candidate text');

      const parsed = JSON.parse(jsonText);
      return {
        name: parsed.name || 'Candidate',
        email: parsed.email || 'candidate@example.com',
        phone: parsed.phone || '+1 (555) 010-2026',
        location: parsed.location || 'Remote',
        currentRole: parsed.currentRole || 'Specialist',
        experienceYears: Number(parsed.experienceYears) || 4,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills.slice(0, 10) : ['Generalist'],
        matchScore: Math.max(0, Math.min(100, Math.round(Number(parsed.matchScore) || 75))),
        matchSummary: parsed.matchSummary || 'Strong technical foundation aligned with core role expectations.',
        usedFallback: false,
      };
    } catch {
      if (attempt < delays.length) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
        continue;
      }
      return fallbackParseAndScoreResume(rawText, job);
    }
  }

  return fallbackParseAndScoreResume(rawText, job);
}

// ============================================================================
// 4. REUSABLE UI SUB-COMPONENTS
// ============================================================================

function MatchScoreBadge({ score, size = 'sm' }) {
  let colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  let dotClasses = 'bg-amber-500';

  if (score >= 85) {
    colorClasses = 'bg-teal-50 text-teal-800 border-[#19C3A6]/40';
    dotClasses = 'bg-[#19C3A6]';
  } else if (score >= 70) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotClasses = 'bg-emerald-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tabular-nums border rounded-full ${colorClasses} ${
        size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
      }`}
      title="AI Job Fit Match Score"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
      {score}% Match
    </span>
  );
}

function StagePill({ stage }) {
  const stageObj = PIPELINE_STAGES.find((s) => s.id === stage) || PIPELINE_STAGES[0];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageObj.badgeBg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${stageObj.dotColor}`} />
      {stageObj.label}
    </span>
  );
}

function InteractiveStarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 rounded hover:bg-slate-100 transition-colors focus:outline-none"
            title={`Rate ${star} out of 5`}
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                active ? 'fill-[#19C3A6] text-[#19C3A6]' : 'text-slate-300 hover:text-slate-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// 5. MODALS & DRAWERS
// ============================================================================

/**
 * AI Resume Parser & Job Match Scorer Modal ('+ Add / AI Parse Candidate')
 */
function AiParseCandidateModal({ isOpen, onClose, jobs, onSaveCandidate, showToast }) {
  const activeJobs = jobs.filter((j) => j.status === 'Active');
  const defaultJob = activeJobs[0] || jobs[0];

  const [selectedJobId, setSelectedJobId] = useState(defaultJob?.id || '');
  const [resumeText, setResumeText] = useState('');
  const [sampleIdx, setSampleIdx] = useState(0);
  const [isParsing, setIsParsing] = useState(false);

  // Editable candidate fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    currentRole: '',
    experienceYears: 4,
    skills: [],
    matchScore: 80,
    matchSummary: '',
  });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [hasParsed, setHasParsed] = useState(false);

  useEffect(() => {
    if (isOpen && defaultJob && !selectedJobId) {
      setSelectedJobId(defaultJob.id);
    }
  }, [isOpen, defaultJob, selectedJobId]);

  if (!isOpen) return null;

  const targetJob = jobs.find((j) => j.id === selectedJobId) || defaultJob;

  const handleLoadSample = () => {
    const sample = SAMPLE_RESUMES[sampleIdx % SAMPLE_RESUMES.length];
    setResumeText(sample.text);
    if (jobs.some((j) => j.id === sample.defaultJobId)) {
      setSelectedJobId(sample.defaultJobId);
    }
    setSampleIdx((prev) => prev + 1);
  };

  const handleRunAiParse = async () => {
    if (!resumeText.trim()) {
      showToast('Paste resume text or click "Load Sample Resume" first.', 'warning');
      return;
    }
    setIsParsing(true);
    const parsed = await parseResumeWithGemini(resumeText, targetJob);
    setFormData({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      location: parsed.location,
      currentRole: parsed.currentRole,
      experienceYears: parsed.experienceYears,
      skills: parsed.skills,
      matchScore: parsed.matchScore,
      matchSummary: parsed.matchSummary,
    });
    setHasParsed(true);
    setIsParsing(false);
    showToast(
      parsed.usedFallback
        ? 'Resume parsed & scored via AeroTrack Smart Engine.'
        : 'Resume parsed & scored via Gemini AI.',
      'success'
    );
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleaned = newSkillInput.trim();
    if (cleaned && !formData.skills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, cleaned] }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Candidate full name is required.', 'warning');
      return;
    }

    const newCandidate = {
      id: `cand-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim() || 'candidate@example.com',
      phone: formData.phone.trim() || '+1 (555) 019-2834',
      location: formData.location.trim() || 'Remote',
      currentRole: formData.currentRole.trim() || 'Applicant',
      experienceYears: Number(formData.experienceYears) || 0,
      skills: formData.skills.length > 0 ? formData.skills : ['Generalist'],
      jobId: targetJob?.id || jobs[0]?.id,
      stage: 'Applied',
      matchScore: Math.max(0, Math.min(100, Number(formData.matchScore) || 75)),
      matchSummary:
        formData.matchSummary.trim() ||
        'Candidate added manually to pipeline. Schedule initial screening to validate technical depth.',
      source: 'AI Resume Parser',
      appliedDate: new Date().toISOString().slice(0, 10),
      scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 },
      notes: [],
    };

    onSaveCandidate(newCandidate);
    setResumeText('');
    setHasParsed(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      currentRole: '',
      experienceYears: 4,
      skills: [],
      matchScore: 80,
      matchSummary: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#0F1B2D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#19C3A6]/20 border border-[#19C3A6]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#19C3A6]" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">AI Resume Parser & Match Scorer</h2>
              <p className="text-xs text-slate-300">Extract structured telemetry & evaluate fit against target requisition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 max-h-[82vh] overflow-y-auto">
          {/* Left Pane: Raw Resume Ingestion */}
          <div className="lg:col-span-5 p-5 bg-[#F8FAFC] flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Target Job Requisition
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 font-medium focus:outline-none focus:border-[#19C3A6] focus:ring-2 focus:ring-[#19C3A6]/20"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Raw Resume / CV Text
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-medium text-[#0F1B2D] hover:text-[#14A38B] underline underline-offset-2 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#19C3A6]" />
                  Load Sample Resume
                </button>
              </div>
              <textarea
                rows={11}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw candidate resume text here, or click 'Load Sample Resume' to test instant AI extraction..."
                className="w-full flex-1 rounded-lg border border-slate-300 bg-white p-3 text-xs font-mono text-slate-700 leading-relaxed focus:outline-none focus:border-[#19C3A6] focus:ring-2 focus:ring-[#19C3A6]/20 resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleRunAiParse}
              disabled={isParsing}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F1B2D] hover:bg-[#17263D] disabled:opacity-60 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-[#19C3A6] ${isParsing ? 'animate-spin' : ''}`} />
              {isParsing ? 'Analyzing & Scoring Fit...' : 'Parse & Score with AI'}
            </button>
          </div>

          {/* Right Pane: Structured Profile & Editable Output */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-5 bg-white flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Structured Candidate Profile</h3>
                <p className="text-xs text-slate-500">Review or edit extracted fields before adding to Applied stage</p>
              </div>
              {hasParsed && <MatchScoreBadge score={formData.matchScore} size="lg" />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sophia Chen-Ramirez"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Current Title
                </label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  placeholder="e.g. Senior Systems Engineer"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Seattle, WA / Remote"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Exp (Yrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#19C3A6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    AI Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.matchScore}
                    onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 tabular-nums focus:outline-none focus:border-[#19C3A6]"
                  />
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Extracted Skills
              </label>
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50 min-h-[42px]">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(e);
                      }
                    }}
                    placeholder="+ Add skill..."
                    className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-24 px-1"
                  />
                </div>
              </div>
            </div>

            {/* AI Strengths & Gaps Summary */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                AI Strengths & Gaps Evaluation
              </label>
              <textarea
                rows={3}
                value={formData.matchSummary}
                onChange={(e) => setFormData({ ...formData, matchSummary: e.target.value })}
                placeholder="AI evaluation of candidate fit against target job description..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-[#19C3A6]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#19C3A6] hover:bg-[#14A38B] text-[#0F1B2D] font-semibold text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Save to Applied Pipeline
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Candidate Detail Slide-Over Drawer
 */
function CandidateDetailDrawer({ candidate, job, onClose, onUpdateCandidate, onDeleteCandidate, showToast }) {
  const [noteInput, setNoteInput] = useState('');
  const [emailType, setEmailType] = useState('Interview Invite');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setCopiedEmail(false);
  }, [candidate?.id]);

  if (!candidate) return null;

  const scorecard = candidate.scorecard || {
    technical: 0,
    problemSolving: 0,
    communication: 0,
    culture: 0,
  };

  const ratedValues = Object.values(scorecard).filter((v) => v > 0);
  const avgRating =
    ratedValues.length > 0
      ? (ratedValues.reduce((acc, v) => acc + v, 0) / ratedValues.length).toFixed(1)
      : '0.0';

  const handleRateChange = (criterion, rating) => {
    const updated = {
      ...candidate,
      scorecard: {
        ...scorecard,
        [criterion]: rating,
      },
    };
    onUpdateCandidate(updated);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Lead Recruiter',
      text: noteInput.trim(),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    onUpdateCandidate({
      ...candidate,
      notes: [newNote, ...(candidate.notes || [])],
    });
    setNoteInput('');
    showToast('Recruiter note logged.', 'success');
  };

  const generateEmailDraft = () => {
    const firstName = candidate.name.split(' ')[0];
    const roleTitle = job?.title || 'our open role';
    const dept = job?.department || 'Engineering';

    if (emailType === 'Interview Invite') {
      return `Subject: Interview Invitation — ${roleTitle} at AeroTrack Systems\n\nHi ${firstName},\n\nThank you for applying to the ${roleTitle} position within our ${dept} division. Our team was impressed by your background in ${candidate.skills
        .slice(0, 3)
        .join(', ')}, and we would love to invite you to a 45-minute technical & architectural conversation with our hiring lead.\n\nPlease reply with two or three time windows that work best for you over the next few business days.\n\nBest regards,\nAeroTrack Talent Acquisition`;
    }
    if (emailType === 'Follow-Up') {
      return `Subject: Update on your ${roleTitle} application — AeroTrack Systems\n\nHi ${firstName},\n\nThank you again for taking the time to speak with our ${dept} team regarding the ${roleTitle} opportunity. Our interview panel is currently finalizing feedback across this week's sessions, and we expect to share concrete next steps with you within 48 hours.\n\nPlease let me know if you have any questions or timeline updates in the meantime.\n\nBest regards,\nAeroTrack Talent Acquisition`;
    }
    return `Subject: Formal Offer of Employment — ${roleTitle} at AeroTrack Systems\n\nHi ${firstName},\n\nWe are thrilled to extend a formal offer for you to join AeroTrack Systems as our next ${roleTitle} in ${dept}! Your technical depth and system-level problem solving stood out throughout our evaluation.\n\nOur People Operations team is preparing your official compensation packet (${
      job?.salaryRange || 'competitive base + equity'
    }) and start-date details for review today. Let's connect for a brief call to walk through everything together.\n\nWelcome aboard,\nAeroTrack Talent Acquisition`;
  };

  const emailDraftText = generateEmailDraft();

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(emailDraftText);
    setCopiedEmail(true);
    showToast('Email draft copied to clipboard.', 'success');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const requiredSkills = job?.requiredSkills || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Drawer Header */}
        <div className="bg-[#0F1B2D] text-white px-6 py-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#19C3A6]/20 border border-[#19C3A6]/40 flex items-center justify-center text-[#19C3A6] font-bold text-base shrink-0">
              {candidate.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-semibold tracking-tight">{candidate.name}</h2>
                <MatchScoreBadge score={candidate.matchScore} />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {candidate.currentRole} • <span className="tabular-nums">{candidate.experienceYears} yrs exp</span>
              </p>
              <p className="text-xs text-[#19C3A6] font-medium mt-1">
                Target Role: {job?.title || 'Unassigned'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Bar & Quick Metadata */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Stage:</span>
            <select
              value={candidate.stage}
              onChange={(e) => {
                onUpdateCandidate({ ...candidate, stage: e.target.value });
                showToast(`Moved ${candidate.name} to ${e.target.value}`, 'success');
              }}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#19C3A6]"
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {candidate.source}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Applied {candidate.appliedDate}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href={`mailto:${candidate.email}`}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#19C3A6] text-xs text-slate-700 truncate transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#19C3A6] shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </a>
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 truncate">
              <Phone className="w-3.5 h-3.5 text-[#19C3A6] shrink-0" />
              <span className="truncate tabular-nums">{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#19C3A6] shrink-0" />
              <span className="truncate">{candidate.location}</span>
            </div>
          </div>

          {/* AI Match Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#19C3A6]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  AI Job Fit & Telemetry Breakdown
                </h3>
              </div>
              <span className="text-xs font-bold text-[#0F1B2D] tabular-nums">{candidate.matchScore} / 100</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80">
              {candidate.matchSummary}
            </p>

            {/* Skill Alignment Matrix */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Candidate Skills & Requisition Alignment
              </p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => {
                  const isReqMatch = requiredSkills.some(
                    (r) => r.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                        isReqMatch
                          ? 'bg-teal-50 text-teal-800 border-[#19C3A6]/40'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {isReqMatch && <CheckCircle2 className="w-3 h-3 text-[#19C3A6]" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Interview Scorecard */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#19C3A6]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Interactive Interview Scorecard
                </h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0F1B2D] text-white px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#19C3A6] text-[#19C3A6]" />
                <span>{avgRating} / 5.0 Avg</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { key: 'technical', label: 'Technical / Role Skills' },
                { key: 'problemSolving', label: 'Problem Solving & Systems Thinking' },
                { key: 'communication', label: 'Communication & Clarity' },
                { key: 'culture', label: 'Mission & Culture Alignment' },
              ].map((item) => (
                <div key={item.key} className="py-2 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-700">{item.label}</span>
                  <InteractiveStarRating
                    value={scorecard[item.key] || 0}
                    onChange={(val) => handleRateChange(item.key, val)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Email Draft Generator */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#19C3A6]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Quick Action Email Draft
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {['Interview Invite', 'Follow-Up', 'Offer'].map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => setEmailType(tpl)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      emailType === tpl
                        ? 'bg-[#0F1B2D] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 leading-relaxed">
              {emailDraftText}
            </pre>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19C3A6] hover:bg-[#14A38B] text-[#0F1B2D] font-semibold text-xs transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEmail ? 'Copied to Clipboard' : 'Copy Email Draft'}
              </button>
            </div>
          </div>

          {/* Recruiter Notes Log */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Recruiter Notes Log ({(candidate.notes || []).length})
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Log interview takeaway, compensation expectation, or availability..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-[#0F1B2D] hover:bg-[#17263D] text-white text-xs font-medium transition-colors"
              >
                Add Note
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(candidate.notes || []).length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No recruiter notes recorded yet.</p>
              ) : (
                candidate.notes.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{n.author}</span>
                      <span className="tabular-nums">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between shrink-0">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Candidate
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 font-medium">Confirm delete?</span>
              <button
                type="button"
                onClick={() => {
                  onDeleteCandidate(candidate.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0F1B2D] text-white text-xs font-medium hover:bg-[#17263D]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Create Job Requisition Modal
 */
function CreateJobModal({ isOpen, onClose, onCreateJob, showToast }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Flight Telemetry & Cloud');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [type, setType] = useState('Full-Time');
  const [status, setStatus] = useState('Active');
  const [salaryRange, setSalaryRange] = useState('$160,000 – $195,000');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('Python, TypeScript, Systems Architecture, AWS');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a job title and description.', 'warning');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newJob = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      department: department.trim() || 'Engineering',
      location: location.trim() || 'Remote',
      type,
      status,
      salaryRange: salaryRange.trim() || 'Competitive',
      createdAt: new Date().toISOString().slice(0, 10),
      description: description.trim(),
      requiredSkills: parsedSkills.length > 0 ? parsedSkills : ['Systems Engineering'],
    };

    onCreateJob(newJob);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="bg-[#0F1B2D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#19C3A6]" />
            <h2 className="text-base font-semibold">Create Job Requisition</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Principal Avionics Software Engineer"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Employment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract">Contract</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
              >
                <option value="Active">Active (Live on Career Portal)</option>
                <option value="Draft">Draft (Internal Only)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Required Skills (Comma-Separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="C++, Rust, Real-Time OS, Telemetry, Git"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Job Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe mission impact, key responsibilities, and technical requirements..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:outline-none focus:border-[#19C3A6]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#19C3A6] hover:bg-[#14A38B] text-[#0F1B2D] font-semibold text-sm cursor-pointer"
            >
              Publish Requisition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Live Public Career Portal Preview Modal
 */
function PublicCareerPortalModal({ isOpen, onClose, jobs, onSubmitApplication }) {
  const activeJobs = jobs.filter((j) => j.status === 'Active');
  const [selectedJobId, setSelectedJobId] = useState(activeJobs[0]?.id || '');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    currentRole: '',
    experienceYears: 5,
    skillsInput: '',
    resumeNote: '',
  });

  useEffect(() => {
    if (isOpen && activeJobs.length > 0 && !activeJobs.some((j) => j.id === selectedJobId)) {
      setSelectedJobId(activeJobs[0].id);
    }
    setSubmittedSuccess(false);
  }, [isOpen, activeJobs, selectedJobId]);

  if (!isOpen) return null;

  const selectedJob = activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0];

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedJob || !applicant.name.trim() || !applicant.email.trim()) return;

    const combinedText = `${applicant.name}\n${applicant.currentRole}\nLocation: ${applicant.location}\n${applicant.experienceYears} years experience\nSkills: ${applicant.skillsInput}\n${applicant.resumeNote}`;
    const scored = fallbackParseAndScoreResume(combinedText, selectedJob);

    const manualSkills = applicant.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newCandidate = {
      id: `cand-${Date.now()}`,
      name: applicant.name.trim(),
      email: applicant.email.trim(),
      phone: applicant.phone.trim() || '+1 (555) 014-8820',
      location: applicant.location.trim() || 'Remote',
      currentRole: applicant.currentRole.trim() || 'Applicant',
      experienceYears: Number(applicant.experienceYears) || 3,
      skills: manualSkills.length > 0 ? manualSkills : scored.skills,
      jobId: selectedJob.id,
      stage: 'Applied',
      matchScore: scored.matchScore,
      matchSummary: scored.matchSummary,
      source: 'Career Portal',
      appliedDate: new Date().toISOString().slice(0, 10),
      scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 },
      notes: applicant.resumeNote.trim()
        ? [
            {
              id: `note-${Date.now()}`,
              author: 'Career Portal Submission',
              text: applicant.resumeNote.trim(),
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            },
          ]
        : [],
    };

    onSubmitApplication(newCandidate);
    setSubmittedSuccess(true);
    setApplicant({
      name: '',
      email: '',
      phone: '',
      location: '',
      currentRole: '',
      experienceYears: 5,
      skillsInput: '',
      resumeNote: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden my-6">
        {/* Public Branded Banner */}
        <div className="bg-[#0F1B2D] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#19C3A6] flex items-center justify-center text-[#0F1B2D]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm uppercase">AeroTrack Aerospace</span>
                <span className="px-2 py-0.5 rounded-full bg-[#19C3A6]/20 text-[#19C3A6] text-[10px] font-semibold uppercase tracking-wider">
                  Live Public Career Portal Preview
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Building autonomous flight telemetry & mission-critical software systems
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
            Exit Preview
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-600">
              No active job requisitions are currently published. Set a job status to <strong>Active</strong> to display it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
            {/* Left Role Selector */}
            <div className="lg:col-span-4 bg-[#F8FAFC] border-r border-slate-200 p-5 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Open Positions ({activeJobs.length})
              </p>
              <div className="space-y-2">
                {activeJobs.map((job) => {
                  const isSelected = job.id === selectedJob?.id;
                  return (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setSubmittedSuccess(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#0F1B2D] text-white border-[#0F1B2D] shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-[#19C3A6]'
                      }`}
                    >
                      <p className="text-sm font-semibold">{job.title}</p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {job.department}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            isSelected ? 'bg-white/10 text-[#19C3A6]' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.location}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Role Details + Candidate Application Form */}
            <div className="lg:col-span-8 p-6 bg-white space-y-6">
              {selectedJob && (
                <>
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-[#19C3A6]/40">
                        {selectedJob.salaryRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mt-3">{selectedJob.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedJob.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {submittedSuccess ? (
                    <div className="rounded-xl bg-teal-50 border border-[#19C3A6] p-6 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-[#19C3A6] mx-auto" />
                      <h4 className="text-base font-bold text-[#0F1B2D]">Application Received & Synced to ATS!</h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        Your profile has been automatically parsed, scored against the requisition, and placed directly into the <strong>Applied</strong> column of the recruiter Kanban board.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmittedSuccess(false)}
                        className="mt-2 px-4 py-1.5 rounded-lg bg-[#0F1B2D] text-white text-xs font-medium"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-3.5">
                      <h4 className="text-sm font-bold text-slate-900">Submit Your Application</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={applicant.name}
                            onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                            placeholder="Jordan Taylor"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#19C3A6]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={applicant.email}
                            onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                            placeholder="jordan.taylor@example.com"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#19C3A6]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                            Current Role / Title
                          </label>
                          <input
                            type="text"
                            value={applicant.currentRole}
                            onChange={(e) => setApplicant({ ...applicant, currentRole: e.target.value })}
                            placeholder="Senior Systems Engineer"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#19C3A6]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={applicant.location}
                              onChange={(e) => setApplicant({ ...applicant, location: e.target.value })}
                              placeholder="Seattle, WA"
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#19C3A6]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                              Years Exp
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="40"
                              value={applicant.experienceYears}
                              onChange={(e) => setApplicant({ ...applicant, experienceYears: e.target.value })}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[#19C3A6]"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          Key Technical / Domain Skills (Comma-Separated)
                        </label>
                        <input
                          type="text"
                          value={applicant.skillsInput}
                          onChange={(e) => setApplicant({ ...applicant, skillsInput: e.target.value })}
                          placeholder="React, TypeScript, WebSockets, AWS"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-[#19C3A6]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          Resume Highlights / Cover Note
                        </label>
                        <textarea
                          rows={3}
                          value={applicant.resumeNote}
                          onChange={(e) => setApplicant({ ...applicant, resumeNote: e.target.value })}
                          placeholder="Briefly share relevant mission-critical projects or paste resume highlights..."
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:border-[#19C3A6]"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg bg-[#19C3A6] hover:bg-[#14A38B] text-[#0F1B2D] font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                        >
                          Submit Application
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN WORKSPACE VIEWS
// ============================================================================

/**
 * View 1: Interactive Kanban Candidate Pipeline
 */
function PipelineKanbanView({ candidates, jobs, onMoveStage, onSelectCandidate }) {
  const [draggedCandidateId, setDraggedCandidateId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const jobMap = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      map[j.id] = j;
    });
    return map;
  }, [jobs]);

  const handleDragStart = (e, candidateId) => {
    setDraggedCandidateId(candidateId);
    e.dataTransfer.setData('text/plain', candidateId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedCandidateId;
    if (id) {
      onMoveStage(id, targetStageId);
    }
    setDraggedCandidateId(null);
    setDragOverStage(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="grid grid-cols-5 gap-4 min-w-[1180px] h-full">
          {PIPELINE_STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage.id);
            const avgStageScore =
              stageCandidates.length > 0
                ? Math.round(
                    stageCandidates.reduce((sum, c) => sum + c.matchScore, 0) / stageCandidates.length
                  )
                : null;
            const isOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`flex flex-col rounded-xl border transition-colors ${
                  isOver
                    ? 'bg-teal-50/60 border-[#19C3A6] ring-2 ring-[#19C3A6]/20'
                    : 'bg-slate-100/80 border-slate-200/90'
                }`}
              >
                {/* Column Header */}
                <div className="px-3.5 py-3 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {stage.label}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 tabular-nums">
                      {stageCandidates.length}
                    </span>
                  </div>
                  {avgStageScore !== null && (
                    <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                      Avg {avgStageScore}%
                    </span>
                  )}
                </div>

                {/* Cards Stack */}
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto min-h-[420px]">
                  {stageCandidates.length === 0 ? (
                    <div className="h-28 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                      Drop candidate here
                    </div>
                  ) : (
                    stageCandidates.map((cand) => {
                      const jobTitle = jobMap[cand.jobId]?.title || 'General Requisition';
                      return (
                        <div
                          key={cand.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cand.id)}
                          onDragEnd={() => {
                            setDraggedCandidateId(null);
                            setDragOverStage(null);
                          }}
                          onClick={() => onSelectCandidate(cand.id)}
                          className="group bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-md hover:border-[#19C3A6] transition-all cursor-pointer select-none"
                        >
                          {/* Top Row: Name + Match Score */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0 -ml-1" />
                                <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#0F1B2D]">
                                  {cand.name}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 truncate mt-0.5">{cand.currentRole}</p>
                            </div>
                            <MatchScoreBadge score={cand.matchScore} />
                          </div>

                          {/* Applied Role & Experience */}
                          <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-600 bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-slate-100">
                            <span className="truncate font-medium text-slate-700">{jobTitle}</span>
                            <span className="shrink-0 font-semibold text-slate-500 tabular-nums">
                              {cand.experienceYears}y exp
                            </span>
                          </div>

                          {/* Top 3 Skills */}
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {cand.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {cand.skills.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 text-[11px] font-medium tabular-nums">
                                +{cand.skills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Quick Stage Move Footer */}
                          <div
                            className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[11px] text-slate-400 tabular-nums">{cand.location}</span>
                            <select
                              aria-label={`Move ${cand.name} to stage`}
                              value={cand.stage}
                              onChange={(e) => onMoveStage(cand.id, e.target.value)}
                              className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#19C3A6] cursor-pointer"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * View 2: Searchable Candidate Directory
 */
function CandidatesDirectoryView({ candidates, jobs, onSelectCandidate, onMoveStage }) {
  const [stageFilter, setStageFilter] = useState('ALL');
  const [sortField, setSortField] = useState('matchScore');
  const [sortDir, setSortDir] = useState('desc');

  const jobMap = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      map[j.id] = j;
    });
    return map;
  }, [jobs]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const processed = useMemo(() => {
    return candidates
      .filter((c) => stageFilter === 'ALL' || c.stage === stageFilter)
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [candidates, stageFilter, sortField, sortDir]);

  return (
    <div className="space-y-4">
      {/* Stage Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', ...PIPELINE_STAGES.map((s) => s.id)].map((st) => {
            const active = stageFilter === st;
            const count =
              st === 'ALL'
                ? candidates.length
                : candidates.filter((c) => c.stage === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStageFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0F1B2D] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{st === 'ALL' ? 'All Stages' : st}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                    active ? 'bg-[#19C3A6] text-[#0F1B2D]' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800 tabular-nums">{processed.length}</span> matching profiles
        </p>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    Candidate <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Applied Requisition</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('matchScore')}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    AI Fit <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => handleSort('experienceYears')}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    Experience <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Top Skills</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {processed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No candidates match the current search or filter criteria.
                  </td>
                </tr>
              ) : (
                processed.map((cand) => (
                  <tr
                    key={cand.id}
                    onClick={() => onSelectCandidate(cand.id)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{cand.name}</p>
                      <p className="text-xs text-slate-500">{cand.currentRole}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-slate-700">
                        {jobMap[cand.jobId]?.title || 'Unassigned'}
                      </span>
                      <p className="text-[11px] text-slate-400">{cand.location}</p>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={cand.stage}
                        onChange={(e) => onMoveStage(cand.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#19C3A6]"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <MatchScoreBadge score={cand.matchScore} />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700 tabular-nums">
                      {cand.experienceYears} yrs
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(cand.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F1B2D] hover:text-[#14A38B]"
                      >
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * View 3: Job Requisitions & Live Career Portal
 */
function JobsPortalView({ jobs, candidates, onUpdateJobStatus, onOpenCreateJob, onOpenCareerPortal }) {
  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Active Requisitions & Career Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage open headcount, toggle requisition visibility, or test live candidate submissions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCareerPortal}
            className="px-4 py-2 rounded-lg border border-[#0F1B2D] bg-white hover:bg-slate-50 text-[#0F1B2D] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#19C3A6]" />
            Preview Public Career Portal
          </button>

          <button
            type="button"
            onClick={onOpenCreateJob}
            className="px-4 py-2 rounded-lg bg-[#0F1B2D] hover:bg-[#17263D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#19C3A6]" />
            Create Requisition
          </button>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job) => {
          const jobCandidates = candidates.filter((c) => c.jobId === job.id);
          const activeInPipeline = jobCandidates.filter((c) => c.stage !== 'Hired').length;
          const hiredCount = jobCandidates.filter((c) => c.stage === 'Hired').length;

          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#14A38B]">
                        {job.department}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{job.type}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </p>
                  </div>

                  {/* Interactive Status Toggle */}
                  <select
                    value={job.status}
                    onChange={(e) => onUpdateJobStatus(job.id, e.target.value)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border focus:outline-none cursor-pointer ${
                      job.status === 'Active'
                        ? 'bg-teal-50 text-teal-800 border-[#19C3A6]/50'
                        : job.status === 'Draft'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-slate-700 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requisition Pipeline Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 tabular-nums">
                  <span>
                    <strong className="text-slate-900">{jobCandidates.length}</strong>{' '}
                    <span className="text-slate-500">Total Applicants</span>
                  </span>
                  <span>
                    <strong className="text-slate-900">{activeInPipeline}</strong>{' '}
                    <span className="text-slate-500">In Pipeline</span>
                  </span>
                  <span>
                    <strong className="text-[#14A38B]">{hiredCount}</strong>{' '}
                    <span className="text-slate-500">Hired</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 tabular-nums">Opened {job.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * View 4: Hiring Analytics & Metrics
 */
function AnalyticsDashboardView({ jobs, candidates }) {
  const activeRolesCount = jobs.filter((j) => j.status === 'Active').length;
  const totalCandidates = candidates.length;

  const avgMatchScore =
    totalCandidates > 0
      ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / totalCandidates)
      : 0;

  const offerCount = candidates.filter((c) => c.stage === 'Offer').length;
  const hiredCount = candidates.filter((c) => c.stage === 'Hired').length;
  const offerAcceptanceRate =
    offerCount + hiredCount > 0 ? Math.round((hiredCount / (offerCount + hiredCount)) * 100) : 100;

  // Stage Funnel Counts
  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: candidates.filter((c) => c.stage === stage.id).length,
  }));
  const maxStageCount = Math.max(1, ...stageCounts.map((s) => s.count));

  // Top Skill Distribution across all candidates
  const topSkills = useMemo(() => {
    const freq = {};
    candidates.forEach((c) => {
      (c.skills || []).forEach((s) => {
        freq[s] = (freq[s] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
  }, [candidates]);

  const maxSkillCount = topSkills.length > 0 ? topSkills[0][1] : 1;

  // Source Attribution
  const sourceBreakdown = useMemo(() => {
    const freq = {};
    candidates.forEach((c) => {
      const src = c.source || 'Direct';
      freq[src] = (freq[src] || 0) + 1;
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [candidates]);

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Active Roles
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{activeRolesCount}</p>
          <p className="text-xs text-slate-500 mt-1">
            Out of <span className="font-semibold text-slate-700 tabular-nums">{jobs.length}</span> total requisitions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Candidates
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{totalCandidates}</p>
          <p className="text-xs text-[#14A38B] font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Active talent pipeline
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Avg AI Match Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{avgMatchScore}%</p>
          <p className="text-xs text-slate-500 mt-1">Weighted requisition skill alignment</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Offer Acceptance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{offerAcceptanceRate}%</p>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {hiredCount} Hired / {offerCount + hiredCount} Extended Offers
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stage Conversion Funnel Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pipeline Stage Distribution & Funnel</h3>
              <p className="text-xs text-slate-500">Live candidate volume and share across hiring stages</p>
            </div>
            <Layers className="w-4 h-4 text-[#19C3A6]" />
          </div>

          <div className="space-y-3.5 pt-1">
            {stageCounts.map((st) => {
              const widthPct = Math.max(8, Math.round((st.count / maxStageCount) * 100));
              const sharePct = totalCandidates > 0 ? Math.round((st.count / totalCandidates) * 100) : 0;

              return (
                <div key={st.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                      <span className="font-semibold text-slate-800">{st.label}</span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="font-bold text-slate-900">{st.count}</span>
                      <span className="text-slate-400">({sharePct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        st.id === 'Hired'
                          ? 'bg-[#19C3A6]'
                          : st.id === 'Offer'
                          ? 'bg-amber-500'
                          : 'bg-[#0F1B2D]'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Skill Distribution & Source Attribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Top Talent Pool Skills</h3>
              <p className="text-xs text-slate-500">Most frequent verified competencies in pipeline</p>
            </div>

            <div className="space-y-2.5">
              {topSkills.map(([skill, count]) => {
                const pct = Math.round((count / maxSkillCount) * 100);
                return (
                  <div key={skill} className="flex items-center gap-3 text-xs">
                    <span className="w-28 truncate font-medium text-slate-700">{skill}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-[#19C3A6] rounded-full transition-all duration-500"
                      />
                    </div>
                    <span className="w-6 text-right font-bold text-slate-800 tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source Breakdown Pills */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Sourcing Channel Attribution
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sourceBreakdown.map(([src, count]) => (
                <span
                  key={src}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700"
                >
                  <span>{src}</span>
                  <span className="font-bold text-[#0F1B2D] tabular-nums">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. MAIN APPLICATION SHELL
// ============================================================================

export default function App() {
  // Persistent State
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch {
      // Ignore storage quota errors
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    } catch {
      // Ignore storage quota errors
    }
  }, [candidates]);

  // Navigation & Global Filters
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals & Drawers
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCareerPortalOpen, setIsCareerPortalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Reset confirmation state (replaces window.confirm)
  const [confirmReset, setConfirmReset] = useState(false);

  // Non-intrusive Toast Notification System (replaces window.alert)
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3400);
  };

  // Filtered Candidates using Boolean Search + Job Filter
  const filteredCandidates = useMemo(() => {
    const jobLookup = {};
    jobs.forEach((j) => {
      jobLookup[j.id] = j.title;
    });

    return candidates.filter((cand) => {
      if (selectedJobFilter !== 'ALL' && cand.jobId !== selectedJobFilter) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const searchableBlob = [
        cand.name,
        cand.currentRole,
        cand.location,
        cand.email,
        cand.stage,
        cand.source,
        jobLookup[cand.jobId] || '',
        ...(cand.skills || []),
        ...(cand.notes || []).map((n) => n.text),
      ].join(' ');

      return evaluateBooleanSearch(searchQuery, searchableBlob);
    });
  }, [candidates, jobs, selectedJobFilter, searchQuery]);

  // Handlers
  const handleMoveStage = (candidateId, newStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
    showToast(`${newCandidate.name} added to Applied pipeline (${newCandidate.matchScore}% match).`, 'success');
  };

  const handleUpdateCandidate = (updated) => {
    setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCandidate = (candidateId) => {
    setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    showToast('Candidate removed from pipeline.', 'info');
  };

  const handleCreateJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Requisition "${newJob.title}" created.`, 'success');
  };

  const handleUpdateJobStatus = (jobId, newStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    showToast(`Requisition status updated to ${newStatus}.`, 'info');
  };

  const handleExportCsv = () => {
    const jobLookup = {};
    jobs.forEach((j) => {
      jobLookup[j.id] = j.title;
    });

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Location',
      'Current Title',
      'Experience (Yrs)',
      'Applied Role',
      'Stage',
      'AI Match Score (%)',
      'Skills',
      'Source',
      'Applied Date',
    ];

    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = filteredCandidates.map((c) =>
      [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.location,
        c.currentRole,
        c.experienceYears,
        jobLookup[c.jobId] || 'Unassigned',
        c.stage,
        c.matchScore,
        (c.skills || []).join('; '),
        c.source,
        c.appliedDate,
      ]
        .map(escapeCsv)
        .join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aerotrack_candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${filteredCandidates.length} candidates to CSV.`, 'success');
  };

  const handleResetDemoData = () => {
    setJobs(INITIAL_JOBS);
    setCandidates(INITIAL_CANDIDATES);
    setSelectedJobFilter('ALL');
    setSearchQuery('');
    setConfirmReset(false);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(INITIAL_CANDIDATES));
    showToast('Workspace reset to default aerospace demo data.', 'info');
  };

  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedCandidateId) || null,
    [candidates, selectedCandidateId]
  );

  const selectedCandidateJob = useMemo(
    () => (selectedCandidate ? jobs.find((j) => j.id === selectedCandidate.jobId) : null),
    [selectedCandidate, jobs]
  );

  const navItems = [
    { id: 'Pipeline', label: 'Pipeline', icon: Kanban, badge: filteredCandidates.length },
    { id: 'Candidates', label: 'Candidates', icon: Users, badge: null },
    {
      id: 'Jobs',
      label: 'Jobs',
      icon: Briefcase,
      badge: jobs.filter((j) => j.status === 'Active').length,
    },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
        />
      )}

      {/* Left Deep Navy Sidebar (#0F1B2D) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0F1B2D] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#19C3A6] flex items-center justify-center text-[#0F1B2D] shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold tracking-wider text-sm uppercase block leading-none">
                  AeroTrack
                </span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#19C3A6] block mt-0.5">
                  Talent Telemetry
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="p-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Workspace
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#17263D] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#19C3A6]" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#19C3A6]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${
                        isActive
                          ? 'bg-[#19C3A6]/20 text-[#19C3A6]'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Boolean Search Quick-Helper Card */}
          <div className="mx-3.5 mt-4 p-3.5 rounded-xl bg-[#17263D]/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#19C3A6]">
              <Search className="w-3.5 h-3.5" />
              <span>Boolean Query Ready</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Filter candidates with <code className="text-white font-mono">AND</code>,{' '}
              <code className="text-white font-mono">OR</code>, and{' '}
              <code className="text-white font-mono">NOT</code> operators.
            </p>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {['React AND TypeScript', 'PyTorch OR ROS2', 'Figma NOT Junior'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSearchQuery(preset)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F1B2D] hover:bg-slate-900 text-slate-300 hover:text-[#19C3A6] border border-slate-700 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Utilities */}
        <div className="p-3.5 border-t border-slate-800/90 space-y-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#17263D] hover:bg-[#1E314E] text-slate-200 hover:text-white text-xs font-medium border border-slate-700/70 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#19C3A6]" />
            Export Candidates CSV
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetDemoData}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-2xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Boolean / Keyword Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Boolean search: e.g. React AND TypeScript NOT Junior..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-[#F8FAFC] focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#19C3A6] focus:ring-2 focus:ring-[#19C3A6]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Header Controls: Job Filter Dropdown + Primary AI Parse CTA */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                aria-label="Filter by job requisition"
                value={selectedJobFilter}
                onChange={(e) => setSelectedJobFilter(e.target.value)}
                className="pl-8 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#19C3A6] appearance-none cursor-pointer"
              >
                <option value="ALL">All Requisitions ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#19C3A6] hover:bg-[#14A38B] text-[#0F1B2D] font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add / AI Parse Candidate</span>
            </button>
          </div>
        </header>

        {/* Workspace Subheader */}
        <div className="px-4 sm:px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#0F1B2D]">
              {activeTab === 'Pipeline' && 'Candidate Acquisition Pipeline'}
              {activeTab === 'Candidates' && 'Talent Directory'}
              {activeTab === 'Jobs' && 'Job Requisitions & Career Portal'}
              {activeTab === 'Analytics' && 'Recruitment Funnel & Telemetry'}
            </h1>
            <p className="text-xs text-slate-500">
              {selectedJobFilter === 'ALL'
                ? `Tracking ${filteredCandidates.length} candidates across ${jobs.length} requisitions`
                : `Filtered to ${jobs.find((j) => j.id === selectedJobFilter)?.title || 'Selected Role'}`}
            </p>
          </div>

          {activeTab === 'Pipeline' && (
            <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
              Drag cards across stages or click any profile to open Interview Scorecard
            </span>
          )}
        </div>

        {/* Active View Viewport */}
        <main className="flex-1 px-4 sm:px-6 pb-8">
          {activeTab === 'Pipeline' && (
            <PipelineKanbanView
              candidates={filteredCandidates}
              jobs={jobs}
              onMoveStage={handleMoveStage}
              onSelectCandidate={(id) => setSelectedCandidateId(id)}
            />
          )}

          {activeTab === 'Candidates' && (
            <CandidatesDirectoryView
              candidates={filteredCandidates}
              jobs={jobs}
              onSelectCandidate={(id) => setSelectedCandidateId(id)}
              onMoveStage={handleMoveStage}
            />
          )}

          {activeTab === 'Jobs' && (
            <JobsPortalView
              jobs={jobs}
              candidates={candidates}
              onUpdateJobStatus={handleUpdateJobStatus}
              onOpenCreateJob={() => setIsCreateJobOpen(true)}
              onOpenCareerPortal={() => setIsCareerPortalOpen(true)}
            />
          )}

          {activeTab === 'Analytics' && (
            <AnalyticsDashboardView jobs={jobs} candidates={filteredCandidates} />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AiParseCandidateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        jobs={jobs}
        onSaveCandidate={handleAddCandidate}
        showToast={showToast}
      />

      <CandidateDetailDrawer
        candidate={selectedCandidate}
        job={selectedCandidateJob}
        onClose={() => setSelectedCandidateId(null)}
        onUpdateCandidate={handleUpdateCandidate}
        onDeleteCandidate={handleDeleteCandidate}
        showToast={showToast}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onCreateJob={handleCreateJob}
        showToast={showToast}
      />

      <PublicCareerPortalModal
        isOpen={isCareerPortalOpen}
        onClose={() => setIsCareerPortalOpen(false)}
        jobs={jobs}
        onSubmitApplication={handleAddCandidate}
      />

      {/* Non-Intrusive Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F1B2D] text-white text-xs font-medium shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#19C3A6] shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}