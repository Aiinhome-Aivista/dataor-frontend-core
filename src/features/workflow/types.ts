export type StepStatus = 'pending' | 'processing' | 'awaiting_input' | 'completed' | 'error';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  agentName: string;
  status: StepStatus;
  activities: string[];
  question?: string;
  options?: string[];
}

export interface WorkflowState {
  currentStepIndex: number;
  steps: WorkflowStep[];
}
