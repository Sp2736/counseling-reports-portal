"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  StudentProfile,
  CounselorProfile,
  CounselingRecord,
  DUMMY_STUDENT,
  DUMMY_COUNSELORS,
  INITIAL_PIPELINE_RECORDS,
  INITIAL_STUDENTS_ROSTER,
} from "./demo-data";

interface DemoContextType {
  role: "student" | "counselor";
  setRole: (role: "student" | "counselor") => void;
  studentProfile: StudentProfile;
  setStudentProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  counselorProfile: CounselorProfile;
  setCounselorProfile: React.Dispatch<React.SetStateAction<CounselorProfile>>;
  records: CounselingRecord[];
  studentsRoster: typeof INITIAL_STUDENTS_ROSTER;
  counselors: CounselorProfile[];
  
  // Actions
  addSwotSubmission: (formData: {
    semester: string;
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  }) => string; // returns recordId
  approveRecord: (recordId: string, riskLevel: string, actionPlan: string) => void;
  rejectRecord: (recordId: string, reason: string) => void;
  cancelRecordByStudent: (recordId: string) => void;
  batchApproveAll: () => void;
  resetDemoToDefault: () => void;
  
  // Modal State & Controls
  isWelcomeModalOpen: boolean;
  dismissWelcomeModal: () => void;
  isRoleSwitchModalOpen: boolean;
  targetRoleToSwitch: "student" | "counselor" | null;
  requestRoleSwitch: (toRole: "student" | "counselor") => void;
  confirmRoleSwitch: () => void;
  cancelRoleSwitch: () => void;
  
  // Lookups
  getRecordById: (id: string) => CounselingRecord | undefined;
  getStudentById: (id: string) => any;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const STORAGE_KEY = "counseling_demo_session_v6";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<"student" | "counselor">("student");
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DUMMY_STUDENT);
  const [counselorProfile, setCounselorProfile] = useState<CounselorProfile>(DUMMY_COUNSELORS[0]);
  const [records, setRecords] = useState<CounselingRecord[]>(INITIAL_PIPELINE_RECORDS);
  const [studentsRoster, setStudentsRoster] = useState(INITIAL_STUDENTS_ROSTER);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);
  const [targetRoleToSwitch, setTargetRoleToSwitch] = useState<"student" | "counselor" | null>(null);

  // Initialize from sessionStorage:
  // - Preserves session across page refreshes (F5 / reload) within the same tab
  // - Restarts fresh when user quits the app/browser tab and reopens
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Clear all legacy storage keys
        const legacyKeys = [
          "counseling_demo_state_v1",
          "counseling_demo_state_v2",
          "counseling_demo_session_v1",
          "counseling_demo_session_v2",
          "counseling_demo_session_v3",
          "counseling_demo_session_v4",
          "counseling_demo_session_v5",
        ];
        legacyKeys.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Scan all sessionStorage keys and clear any that contain outdated formats
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith("counseling_demo")) {
            const val = sessionStorage.getItem(key) || "";
            if (/24D|23D|DCS|DCE|DIT|CHARUSAT|DEPSTAR|DEMO-CS|DEMO-CE|DEMO-IT/i.test(val)) {
              sessionStorage.removeItem(key);
            }
          }
        }

        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          // If the cached session contains any old format, purge immediately
          if (/24D|23D|DCS|DCE|DIT|CHARUSAT|DEPSTAR|DEMO-CS|DEMO-CE|DEMO-IT/i.test(saved)) {
            sessionStorage.removeItem(STORAGE_KEY);
            setIsWelcomeModalOpen(true);
            return;
          }

          const parsed = JSON.parse(saved);
          if (parsed.role) setRoleState(parsed.role);
          if (parsed.studentProfile) setStudentProfile(parsed.studentProfile);
          if (parsed.counselorProfile) setCounselorProfile(parsed.counselorProfile);
          if (parsed.records) setRecords(parsed.records);
          if (parsed.studentsRoster) setStudentsRoster(parsed.studentsRoster);
        } else {
          // Brand new visit: trigger the entrance welcome popup
          setIsWelcomeModalOpen(true);
        }
      }
    } catch (e) {
      console.warn("Could not parse saved demo session", e);
      setIsWelcomeModalOpen(true);
    }
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            role,
            studentProfile,
            counselorProfile,
            records,
            studentsRoster,
          })
        );
      }
    } catch (e) {
      console.warn("Could not save demo session", e);
    }
  }, [role, studentProfile, counselorProfile, records, studentsRoster]);

  const dismissWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  const requestRoleSwitch = (toRole: "student" | "counselor") => {
    setTargetRoleToSwitch(toRole);
    setIsRoleSwitchModalOpen(true);
  };

  const cancelRoleSwitch = () => {
    setIsRoleSwitchModalOpen(false);
    setTargetRoleToSwitch(null);
  };

  const confirmRoleSwitch = () => {
    if (targetRoleToSwitch) {
      setRoleState(targetRoleToSwitch);
    }
    setIsRoleSwitchModalOpen(false);
    setTargetRoleToSwitch(null);
  };

  const setRole = (newRole: "student" | "counselor") => {
    setRoleState(newRole);
  };

  const addSwotSubmission = (formData: {
    semester: string;
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  }) => {
    const newRecordId = "rec-live-" + Date.now();
    
    const parseLines = (text: string) =>
      text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

    const swot_input = {
      strengths: parseLines(formData.strengths),
      weaknesses: parseLines(formData.weaknesses),
      opportunities: parseLines(formData.opportunities),
      threats: parseLines(formData.threats),
    };

    const original_submitted_text = `Semester: ${formData.semester}\n\n[STRENGTHS]\n${formData.strengths}\n\n[WEAKNESSES]\n${formData.weaknesses}\n\n[OPPORTUNITIES]\n${formData.opportunities}\n\n[THREATS]\n${formData.threats}`;

    const simulatedAi = {
      risk_prediction: {
        risk_level: "Medium" as const,
        risk_score: 6,
        risk_factors: [
          "Reported public presentation and seminar nervousness",
          "Potential semester workload overload with concurrent project deadlines",
          "Irregular sleep and stress regulation flags",
        ],
      },
      generated_report: {
        counselor_findings: `Student exhibits high technical competency and clear analytical drive. However, expressions regarding presentation anxiety and exam-period procrastination indicate moderate situational vulnerability. Proactive mentorship will prevent compounding stress.`,
        priority_interventions: [
          "Initiate time-blocking framework for upcoming semester assignment milestones",
          "Engage in faculty-monitored mini-seminars to lower public presentation friction",
          "Recommend campus innovation incubator opportunities for upcoming hackathon",
        ],
      },
    };

    const newRecord: CounselingRecord = {
      _id: newRecordId,
      report_period: 2,
      createdAt: new Date().toISOString(),
      status: "Needs_Review",
      student: {
        _id: studentProfile._id,
        fullName: studentProfile.fullName,
        studentId: studentProfile.studentId,
        department: studentProfile.department,
        semester: formData.semester || "4",
      },
      assignedCounselor: {
        _id: counselorProfile._id,
        fullName: counselorProfile.fullName,
      },
      original_submitted_text,
      swot_input,
      ai_analysis: simulatedAi,
    };

    setRecords((prev) => [newRecord, ...prev]);

    setStudentsRoster((prev) =>
      prev.map((s) =>
        s._id === studentProfile._id || s.studentId === studentProfile.studentId
          ? { ...s, pendingCount: s.pendingCount + 1, latestRiskLevel: "Medium" }
          : s
      )
    );

    return newRecordId;
  };

  const approveRecord = (recordId: string, riskLevel: string, actionPlan: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r._id === recordId) {
          return {
            ...r,
            status: "Reviewed_Completed",
            counselor_review: {
              final_risk_level: riskLevel,
              final_action_plan: actionPlan,
              reviewed_at: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );

    const target = records.find((r) => r._id === recordId);
    if (target) {
      setStudentsRoster((prev) =>
        prev.map((s) =>
          s._id === target.student._id || s.studentId === target.student.studentId
            ? { ...s, pendingCount: Math.max(0, s.pendingCount - 1), latestRiskLevel: riskLevel }
            : s
        )
      );
    }
  };

  const rejectRecord = (recordId: string, reason: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r._id === recordId) {
          return {
            ...r,
            status: "Cancelled_By_Counselor",
            counselor_review: {
              final_action_plan: `Reason for Rejection:\n${reason}`,
              reviewed_at: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );

    const target = records.find((r) => r._id === recordId);
    if (target) {
      setStudentsRoster((prev) =>
        prev.map((s) =>
          s._id === target.student._id || s.studentId === target.student.studentId
            ? { ...s, pendingCount: Math.max(0, s.pendingCount - 1) }
            : s
        )
      );
    }
  };

  const cancelRecordByStudent = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r._id === recordId ? { ...r, status: "Cancelled_By_Student" } : r
      )
    );

    const target = records.find((r) => r._id === recordId);
    if (target) {
      setStudentsRoster((prev) =>
        prev.map((s) =>
          s._id === target.student._id || s.studentId === target.student.studentId
            ? { ...s, pendingCount: Math.max(0, s.pendingCount - 1) }
            : s
        )
      );
    }
  };

  const batchApproveAll = () => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.status === "Needs_Review") {
          return {
            ...r,
            status: "Reviewed_Completed",
            counselor_review: {
              final_risk_level: r.ai_analysis?.risk_prediction.risk_level || "Low",
              final_action_plan:
                r.ai_analysis?.generated_report.priority_interventions.join("\n- ") ||
                "Approved via batch review.",
              reviewed_at: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );

    setStudentsRoster((prev) =>
      prev.map((s) => ({
        ...s,
        pendingCount: 0,
        latestRiskLevel: s.latestRiskLevel === "N/A" ? "Low" : s.latestRiskLevel,
      }))
    );
  };

  const resetDemoToDefault = () => {
    setRoleState("student");
    setStudentProfile(DUMMY_STUDENT);
    setCounselorProfile(DUMMY_COUNSELORS[0]);
    setRecords(INITIAL_PIPELINE_RECORDS);
    setStudentsRoster(INITIAL_STUDENTS_ROSTER);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const getRecordById = (id: string) => {
    return records.find((r) => r._id === id);
  };

  const getStudentById = (id: string) => {
    return (
      studentsRoster.find((s) => s._id === id || s.studentId === id) || {
        _id: id,
        fullName: studentProfile.fullName,
        studentId: studentProfile.studentId,
        department: studentProfile.department,
        email: studentProfile.email,
        pendingCount: 0,
        latestRiskLevel: "Medium",
      }
    );
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        studentProfile,
        setStudentProfile,
        counselorProfile,
        setCounselorProfile,
        records,
        studentsRoster,
        counselors: DUMMY_COUNSELORS,
        addSwotSubmission,
        approveRecord,
        rejectRecord,
        cancelRecordByStudent,
        batchApproveAll,
        resetDemoToDefault,
        isWelcomeModalOpen,
        dismissWelcomeModal,
        isRoleSwitchModalOpen,
        targetRoleToSwitch,
        requestRoleSwitch,
        confirmRoleSwitch,
        cancelRoleSwitch,
        getRecordById,
        getStudentById,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
