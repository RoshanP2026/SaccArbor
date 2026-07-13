/**
 * 🏥 SaccArbor AI - Type Definitions
 * Explicit clinical inputs and prediction results.
 */

export interface PatientData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface Contribution {
  name: string;
  impact: number;
  value: number;
  unit: string;
}

export interface PredictionResult {
  probability: number;
  outcome: number;
  riskLevel: "Low" | "Moderate" | "High";
  contributions: Contribution[];
  inputs: PatientData;
}

export interface DatasetRow extends Record<string, number> {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
  Outcome: number;
}

export interface DatasetSummary {
  headers: string[];
  rows: DatasetRow[];
}

export interface ProjectFileInfo {
  filename: string;
}

export interface FileContentResponse {
  filename: string;
  content: string;
}

export interface MentorMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}
