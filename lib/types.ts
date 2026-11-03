export interface Lesson {
  sno: number;
  slideNo: number;
  docRef: string;
  project: string;
  preparedBy: string;
  area: string;
  concern: string;
  rootCauses: string[];
  countermeasures: string[];
  checkPoints: string[];
  risk: 'High Risk' | 'Med Risk' | 'Normal' | string;
}

export interface FtaBranch {
  id: string;
  name: string;
  slideNo?: number;
  status: 'root_cause' | 'debunked' | 'verified' | 'checked';
  badgeText: string;
  detail: string;
}

export interface FtaChainStep {
  step: number;
  title: string;
  desc: string;
}

export interface FtaRecommendation {
  type: 'Execute' | 'Verify' | 'Update' | string;
  text: string;
}

export interface WorkOrder {
  id: string;
  status: 'Draft' | 'In Progress' | 'Completed' | string;
  description: string;
  equipment: string;
  plant: string;
  priority: 'High' | 'Critical' | 'Medium' | 'Low' | string;
  assignedTo: string;
  dueDate: string;
  estimatedHours: string;
}

export interface FtaScenario {
  id: string;
  title: string;
  symptom: string;
  vehicle: string;
  confidence: number;
  rootCauseSummary: string;
  primarySlide: number;
  evidenceSlides: number[];
  branches: FtaBranch[];
  chain: FtaChainStep[];
  recommendations: FtaRecommendation[];
  defaultWorkOrder: WorkOrder;
}

export interface DefectLog {
  id: string;
  concern: string;
  severity: string;
  timestamp: string;
}

export interface ZoneItem {
  id: string;
  name: string;
  count: number;
  risk: string;
  group: string;
  icon: string;
  station: string;
}

