# Counseling Reports Portal

## 📖 The Story: Why It Was Built

In modern university environments, a critical disconnect often exists between student mental health tracking and the actual bandwidth of academic counselors. Students continuously generate valuable self-assessment data, but counselors are frequently overwhelmed by the sheer volume of unstructured text they must review. 

The Counseling Reports Portal was engineered to solve this exact bottleneck. The vision was to eliminate the friction of manual document parsing. Instead of relying on cumbersome file uploads and messy document formats, the platform was deliberately designed to rely entirely on clean, structured JSON objects. By intercepting raw student inputs and running them through an advanced AI service, the system instantly transforms vulnerable student narratives into precise, actionable data points. This allows counselors to focus entirely on what matters: actual human intervention and guidance.

## 🎯 What It Is

The Counseling Reports Portal is a specialized, Next.js-powered digital ecosystem built for academic institutions. Tailored to align with institutional design languages (such as specific eGov color palettes and headers), it acts as an intelligent bridge between a student's self-reflection and a counselor's dashboard. 

At its core, the application integrates with Google's Generative AI (Gemini 2.5 Flash) to perform synchronous, deep-level analysis of student text. It ensures that all data is strictly handled and returned as enforced JSON structures rather than arbitrary, unformatted text blocks.

## ✨ What It Is Meant For (Key Features)

### For the Student: An Empathetic Interface
* **Frictionless Submissions:** A dedicated dashboard allowing students to easily track when their next report is due in the academic period.
* **Anxiety-Free UX:** To foster trust and encourage honest self-assessment, all explicit mentions of "AI analysis" have been purposefully removed from student-facing success and failure messages.

### For the Counselor: The Command Center
* **Macro-Level Tracking:** A comprehensive dashboard that displays total assigned students, overall submission counts, and period-wise submission tracking (e.g., tracking multiple required submissions across a single semester).
* **Capacity Management:** Tools for counselors to dynamically update their profiles and define their specific counseling ranges.
* **Instantaneous JSON Insights:** The system digests student inputs and strictly outputs JSON objects containing:
  * **Psychological Profiles:** Dominant traits, learning styles, and motivation levels.
  * **Risk Prediction:** Calculated risk scores, risk levels, and specific risk factors.
  * **Actionable Reports:** 3 to 5 concise counselor findings and priority interventions.

## 🛠️ Technical Foundation

* **Framework:** Next.js & React.
* **Database:** MongoDB / Mongoose for flexible, scalable data schemas.
* **AI Integration:** `@google/generative-ai` processing inputs directly into sanitized, rigorously parsed JSON objects.
* **Data Flow:** A pure JSON architecture, completely bypassing legacy multipart file-upload libraries to ensure faster, more predictable server-client communication.
