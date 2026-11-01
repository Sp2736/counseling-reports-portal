export interface StudentProfile {
  _id: string;
  fullName: string;
  studentId: string;
  department: string;
  semester: string;
  email: string;
  assignedCounselor: string;
  assignedCounselorName: string;
}

export interface CounselorProfile {
  _id: string;
  fullName: string;
  employeeId: string;
  department: string;
  expertise: string;
}

export interface SwotInput {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AiAnalysis {
  risk_prediction: {
    risk_level: "Low" | "Medium" | "High" | "Critical";
    risk_score: number;
    risk_factors: string[];
  };
  generated_report: {
    counselor_findings: string;
    priority_interventions: string[];
  };
}

export interface CounselingRecord {
  _id: string;
  report_period: number;
  createdAt: string;
  status: "Pending_AI" | "Needs_Review" | "Reviewed_Completed" | "Cancelled_By_Counselor" | "Cancelled_By_Student";
  student: {
    _id: string;
    fullName: string;
    studentId: string;
    department: string;
    semester: string;
  };
  assignedCounselor: {
    _id: string;
    fullName: string;
  };
  original_submitted_text: string;
  swot_input: SwotInput;
  ai_analysis: AiAnalysis | null;
  counselor_review?: {
    final_risk_level?: string;
    final_action_plan?: string;
    reviewed_at?: string;
  };
}

export const DUMMY_STUDENT: StudentProfile = {
  _id: "stud-live",
  fullName: "Arjun Mehta",
  studentId: "DEMO-CS-1088",
  department: "CS - Computer Science & Engineering",
  semester: "4",
  email: "arjun.mehta@demo-univ.edu",
  assignedCounselor: "counselor-1",
  assignedCounselorName: "Dr. Priya Sharma",
};

export const DUMMY_COUNSELORS: CounselorProfile[] = [
  {
    _id: "counselor-1",
    fullName: "Dr. Priya Sharma",
    employeeId: "FAC-DEMO-042",
    department: "CS - Computer Science",
    expertise: "Academic Stress, Career Transition, CS/IT Students",
  },
  {
    _id: "counselor-2",
    fullName: "Prof. Rajesh Verma",
    employeeId: "FAC-DEMO-088",
    department: "CE - Computer Engineering",
    expertise: "Exam Preparation, Time Management, Aptitude Training",
  },
  {
    _id: "counselor-3",
    fullName: "Dr. Ananya Iyer",
    employeeId: "FAC-DEMO-115",
    department: "IT - Information Technology",
    expertise: "Personal Well-being, Technical Focus & Research Guidance",
  },
];

export const DUMMY_SWOT_TEXT = {
  semester: "4",
  strengths: "Fast learner with algorithmic problems\nProficient in Python, C++ and TypeScript\nActive contributor in team hackathons\nConsistent academic record and high attendance",
  weaknesses: "Tendency to procrastinate on lengthy semester assignments\nModerate anxiety before public seminar presentations\nDifficulty balancing competitive programming and semester syllabus",
  opportunities: "Selected for university industry mentorship initiative\nUpcoming smart-campus hackathon at state level\nAccess to advanced cloud computing lab electives next term",
  threats: "Mounting academic pressure with 6 core engineering subjects\nFierce competition for high-demand campus placement slots\nBurnout risk due to irregular late-night sleep schedule",
};

export const INITIAL_PIPELINE_RECORDS: CounselingRecord[] = [
  {
    _id: "rec-1",
    report_period: 1,
    createdAt: "2026-03-12T09:30:00Z",
    status: "Reviewed_Completed",
    student: {
      _id: "stud-1",
      fullName: "Kavya Patel",
      studentId: "DEMO-CS-1042",
      department: "CS",
      semester: "4",
    },
    assignedCounselor: {
      _id: "counselor-1",
      fullName: "Dr. Priya Sharma",
    },
    original_submitted_text: "Semester: 4\nStrengths: High analytical reasoning, good at math.\nWeaknesses: Public communication.\nOpportunities: Student coding club lead.\nThreats: Exam anxiety.",
    swot_input: {
      strengths: ["High analytical reasoning and logic", "Consistently high scores in Discrete Math", "Self-motivated in coding tasks"],
      weaknesses: ["Nervous in group discussions", "Reluctance to ask doubts in large lecture halls"],
      opportunities: ["Selected to lead student coding club", "Peer tutoring opportunities for junior batches"],
      threats: ["Mid-semester test pressure", "Commute fatigue affecting evening revision"],
    },
    ai_analysis: {
      risk_prediction: {
        risk_level: "Low",
        risk_score: 2,
        risk_factors: ["Minor presentation apprehension"],
      },
      generated_report: {
        counselor_findings: "Student is academically sound and well-disciplined. Social anxiety in large groups is the only notable friction point.",
        priority_interventions: [
          "Encourage participation in small-group technical seminars",
          "Provide leadership role in coding club to build vocal confidence",
          "Follow-up check-in at mid-semester review",
        ],
      },
    },
    counselor_review: {
      final_risk_level: "Low",
      final_action_plan: "- Appointed as co-lead for departmental coding circle to bolster presentation skills.\n- Scheduled monthly check-in. Academic trajectory remains outstanding.",
      reviewed_at: "2026-03-14T11:00:00Z",
    },
  },
  {
    _id: "rec-2",
    report_period: 1,
    createdAt: "2026-03-18T14:15:00Z",
    status: "Needs_Review",
    student: {
      _id: "stud-2",
      fullName: "Rohan Shah",
      studentId: "DEMO-CE-1015",
      department: "CE",
      semester: "4",
    },
    assignedCounselor: {
      _id: "counselor-1",
      fullName: "Dr. Priya Sharma",
    },
    original_submitted_text: "Semester: 4\nStrengths: Creative thinking, hardware projects.\nWeaknesses: Missed multiple lab submissions, severe backlog risk in Operating Systems.\nOpportunities: Hardware tech-fest.\nThreats: Low attendance threshold warning received.",
    swot_input: {
      strengths: ["Creative problem solver with IoT & microcontrollers", "Enthusiastic about hands-on lab projects"],
      weaknesses: ["Severe backlog risk in Theory of Computation", "Procrastination on theoretical assignments", "Attendance dipped below 70% in two subjects"],
      opportunities: ["Annual Hardware Tech-Fest hackathon", "Faculty lab assistant program"],
      threats: ["Official attendance warning letter from Dean's office", "High stress and irregular sleep patterns"],
    },
    ai_analysis: {
      risk_prediction: {
        risk_level: "High",
        risk_score: 8,
        risk_factors: [
          "Attendance threshold violation warning",
          "Critical academic backlog risk in 2 core subjects",
          "Elevated psychological distress and overwhelm",
        ],
      },
      generated_report: {
        counselor_findings: "Urgent intervention warranted. Student possesses strong practical acumen but is falling behind rapidly on theoretical coursework and attendance thresholds.",
        priority_interventions: [
          "Mandate immediate structured remedial tutoring for Operating Systems",
          "Establish daily attendance tracking agreement with class coordinator",
          "Coordinate stress-relief session and schedule bi-weekly progress reviews",
        ],
      },
    },
  },
  {
    _id: "rec-3",
    report_period: 1,
    createdAt: "2026-03-19T10:00:00Z",
    status: "Pending_AI",
    student: {
      _id: "stud-3",
      fullName: "Meera Joshi",
      studentId: "DEMO-IT-1078",
      department: "IT",
      semester: "4",
    },
    assignedCounselor: {
      _id: "counselor-1",
      fullName: "Dr. Priya Sharma",
    },
    original_submitted_text: "Semester: 4\nStrengths: Database design, Web development.\nWeaknesses: Time management, exam nervousness.\nOpportunities: Internship interviews.\nThreats: Fast-paced syllabus.",
    swot_input: {
      strengths: ["Database architecture", "Full-stack React/Node.js proficiency"],
      weaknesses: ["Exam nervousness", "Time management during test week"],
      opportunities: ["Summer corporate internship interview scheduled"],
      threats: ["Overwhelming assignment deadlines"],
    },
    ai_analysis: null,
  },
  {
    _id: "rec-4",
    report_period: 1,
    createdAt: "2026-03-10T16:20:00Z",
    status: "Cancelled_By_Counselor",
    student: {
      _id: "stud-4",
      fullName: "Devendra Rao",
      studentId: "DEMO-CS-1003",
      department: "CS",
      semester: "4",
    },
    assignedCounselor: {
      _id: "counselor-1",
      fullName: "Dr. Priya Sharma",
    },
    original_submitted_text: "Semester: 4\nStrengths: Good.\nWeaknesses: None.\nOpportunities: Many.\nThreats: None.",
    swot_input: {
      strengths: ["Good student"],
      weaknesses: ["None provided"],
      opportunities: ["General opportunities"],
      threats: ["None provided"],
    },
    ai_analysis: null,
    counselor_review: {
      final_risk_level: "High",
      final_action_plan: "Reason for Rejection:\nSWOT submission lacked specific descriptions for Opportunities and Threats. Please provide realistic semester challenges and resubmit with genuine reflections.",
      reviewed_at: "2026-03-11T09:00:00Z",
    },
  },
];

export const INITIAL_STUDENTS_ROSTER = [
  {
    _id: "stud-live",
    fullName: "Arjun Mehta",
    studentId: "DEMO-CS-1088",
    department: "CS",
    email: "arjun.mehta@demo-univ.edu",
    pendingCount: 0,
    latestRiskLevel: "N/A",
  },
  {
    _id: "stud-1",
    fullName: "Kavya Patel",
    studentId: "DEMO-CS-1042",
    department: "CS",
    email: "kavya.patel@demo-univ.edu",
    pendingCount: 0,
    latestRiskLevel: "Low",
  },
  {
    _id: "stud-2",
    fullName: "Rohan Shah",
    studentId: "DEMO-CE-1015",
    department: "CE",
    email: "rohan.shah@demo-univ.edu",
    pendingCount: 1,
    latestRiskLevel: "High",
  },
  {
    _id: "stud-3",
    fullName: "Meera Joshi",
    studentId: "DEMO-IT-1078",
    department: "IT",
    email: "meera.joshi@demo-univ.edu",
    pendingCount: 1,
    latestRiskLevel: "N/A",
  },
  {
    _id: "stud-4",
    fullName: "Devendra Rao",
    studentId: "DEMO-CS-1003",
    department: "CS",
    email: "devendra.rao@demo-univ.edu",
    pendingCount: 0,
    latestRiskLevel: "N/A",
  },
];
