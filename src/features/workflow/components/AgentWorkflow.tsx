import { useState, useEffect, useCallback } from 'react';
import { WorkflowStep, StepStatus } from '../types';
import { Card, CardContent, CardHeader, Badge, Button, Stepper } from '@/src/ui-kit';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Server, BarChart3, MessageSquare, Sparkles, CheckCircle2, Loader2, Info } from 'lucide-react';
import { ThreeAvatar } from '../../chat/components/ThreeAvatar';

const INITIAL_STEPS: WorkflowStep[] = [
  {
    id: 'connect',
    title: 'Connection',
    description: 'Establishing secure link to database',
    agentName: 'Connection Agent',
    status: 'pending',
    activities: [
      'Verifying credentials...',
      'Establishing SSL tunnel...',
      'Handshaking with Postgres...',
      'Mapping schema structures...'
    ],
    question: 'Which schema should I prioritize for indexing?',
    options: ['Public', 'Sales', 'Inventory', 'All']
  },
  {
    id: 'ingest',
    title: 'Ingestion',
    description: 'Fetching and storing remote data',
    agentName: 'Ingestion Agent',
    status: 'pending',
    activities: [
      'Streaming rows...',
      'Normalizing data types...',
      'Indexing primary keys...',
      'Storing on local cache...'
    ],
    question: 'How often should I sync this data?',
    options: ['Real-time', 'Hourly', 'Daily', 'Manual']
  },
  {
    id: 'analyze',
    title: 'Analysis',
    description: 'Generating insights and visuals',
    agentName: 'Analysis Agent',
    status: 'pending',
    activities: [
      'Detecting patterns...',
      'Generating statistical summaries...',
      'Identifying anomalies...',
      'Building visualization maps...'
    ],
    question: 'What is your primary focus for this dataset?',
    options: ['Revenue Growth', 'User Retention', 'Operational Efficiency', 'Data Quality']
  },
  {
    id: 'query',
    title: 'Query Ready',
    description: 'Ready to answer your questions',
    agentName: 'Query Agent',
    status: 'pending',
    activities: [
      'Training local embeddings...',
      'Optimizing query paths...',
      'Dataor is ready to chat!'
    ],
    question: 'Ready to start chatting?',
    options: ["Yes, let's go!"]
  }
];

interface AgentWorkflowProps {
  onComplete: () => void;
  compact?: boolean;
}

export const AgentWorkflow = ({ onComplete, compact = false }: AgentWorkflowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>(INITIAL_STEPS);
  const [activityIndex, setActivityIndex] = useState(0);

  const currentStep = steps[currentStepIndex];

  // Simulate activity progress
  useEffect(() => {
    if (currentStep.status === 'processing') {
      const timer = setInterval(() => {
        setActivityIndex((prev) => {
          if (prev < currentStep.activities.length - 1) {
            return prev + 1;
          } else {
            // Activity finished, wait for user input
            setSteps(prevSteps => {
              const newSteps = [...prevSteps];
              newSteps[currentStepIndex].status = 'awaiting_input';
              return newSteps;
            });
            clearInterval(timer);
            return prev;
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep.status, currentStepIndex, currentStep.activities.length]);

  // Start first step
  useEffect(() => {
    if (steps[0].status === 'pending') {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[0].status = 'processing';
        return newSteps;
      });
    }
  }, [steps]);

  const handleOptionSelect = (option: string) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[currentStepIndex].status = 'completed';
      
      // If there's a next step, start it
      if (currentStepIndex < steps.length - 1) {
        newSteps[currentStepIndex + 1].status = 'processing';
        setCurrentStepIndex(currentStepIndex + 1);
        setActivityIndex(0);
      } else {
        // All steps completed
        onComplete();
      }
      return newSteps;
    });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'connect': return <Database className="w-5 h-5" />;
      case 'ingest': return <Server className="w-5 h-5" />;
      case 'analyze': return <BarChart3 className="w-5 h-5" />;
      case 'query': return <MessageSquare className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className={`${compact ? 'max-w-full' : 'max-w-5xl mx-auto'} py-4`}>
      <div className={compact ? 'sticky top-[-24px] z-20 bg-[var(--bg)]/95 backdrop-blur-sm py-4 mb-6 border-b border-[var(--border)] -mx-6 px-6' : ''}>
        <Stepper 
          steps={steps.map(s => ({ title: s.title }))} 
          currentStep={currentStepIndex} 
        />
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-3'} gap-8 ${compact ? 'mt-4' : 'mt-12'}`}>
        <div className={`${compact ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
          <Card className={`border-[var(--border)] shadow-xl overflow-hidden ${compact ? 'bg-transparent border-none shadow-none' : ''}`}>
            {!compact && (
              <CardHeader className="bg-[var(--surface)]/50 p-6 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
                      {getIcon(currentStep.id)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{currentStep.agentName}</h2>
                      <p className="text-sm text-[var(--text-secondary)]">{currentStep.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={currentStep.status === 'completed' ? 'primary' : 'outline'}
                    className={currentStep.status === 'processing' ? 'animate-pulse' : ''}
                  >
                    {currentStep.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
            )}
            <CardContent className={compact ? 'p-0' : 'p-8'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    {currentStep.agentName} Activity
                  </h4>
                  {compact && (
                    <Badge variant="outline" className="text-[10px] animate-pulse">
                      {currentStep.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <div className={`space-y-3 font-mono text-sm bg-[var(--bg)]/50 p-6 rounded-2xl border border-[var(--border)] ${compact ? 'min-h-[150px]' : 'min-h-[200px]'}`}>
                  {currentStep.activities.slice(0, activityIndex + 1).map((activity, i) => (
                    <motion.div
                      key={activity}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      {i === activityIndex && currentStep.status === 'processing' ? (
                        <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className={i === activityIndex ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>
                        {activity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {currentStep.status === 'awaiting_input' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-8 p-6 rounded-3xl bg-[var(--accent)]/5 border-2 border-dashed border-[var(--accent)]/20`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[var(--accent)] text-white">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-md">{currentStep.question}</h3>
                    </div>
                    <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                      {currentStep.options?.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => handleOptionSelect(option)}
                          className="justify-start h-auto py-3 px-4 text-left hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 group"
                        >
                          <span className="font-bold group-hover:text-[var(--accent)] transition-colors text-sm">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {!compact && (
          <div className="lg:sticky lg:top-28">
           <div className="relative">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl shadow-2xl relative mb-8">
              <div className="absolute -left-2 top-10 w-4 h-4 bg-[var(--surface)] border-l border-b border-[var(--border)] rotate-45 hidden lg:block" />
              
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Dataor Assistant</span>
              </div>
              
              <h4 className="font-bold text-lg mb-2">
                {currentStep.status === 'processing' ? 'Processing...' : 'Action Required'}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {currentStep.status === 'processing' 
                  ? `I'm currently working with the ${currentStep.agentName} to set up your environment. This usually takes a few seconds.`
                  : `The ${currentStep.agentName} has finished its task, but it needs your input to proceed optimally.`}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative">
                <ThreeAvatar />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-[var(--bg)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h5 className="font-bold">Dataor AI</h5>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Workflow Orchestrator</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
