import { useChat, ChatMode } from '../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card, CardContent, CardHeader, CardFooter, Badge, Button } from '@/src/ui-kit';
import { MessageSquare, Sparkles, MoreVertical, Database, Plus, ArrowRight, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentWorkflow } from '../../workflow/components/AgentWorkflow';
import { useState, useEffect } from 'react';
import { connectorService } from '@/src/services/connector.service';
import { Connector } from '../../connectors/types';

interface ChatWindowProps {
  initialMode?: ChatMode;
  onNewConnector?: () => void;
}

export const ChatWindow = ({ initialMode = 'landing', onNewConnector }: ChatWindowProps) => {
  const { messages, sendMessage, isLoading, processingSteps, scrollRef, mode, completeWorkflow, startChat, startWorkflow } = useChat(initialMode);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoadingConnectors, setIsLoadingConnectors] = useState(true);

  useEffect(() => {
    if (mode === 'landing') {
      const fetchConnectors = async () => {
        try {
          setIsLoadingConnectors(true);
          const data = await connectorService.getConnectors();
          const connected = data.filter(c => c.status === 'connected');
          setConnectors(connected);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingConnectors(false);
        }
      };
      fetchConnectors();
    }
  }, [mode]);

  return (
    <Card className="flex flex-col h-[700px] shadow-2xl shadow-black/20 border-[var(--border)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-[var(--surface)]/50 backdrop-blur-sm border-b border-[var(--border)] relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Dataor AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">v1.0 Lite</Badge>
          <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth space-y-2 bg-[var(--bg)]/30 relative"
      >
        <AnimatePresence mode="wait">
          {mode === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-8 py-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] border border-[var(--accent)]/20">
                <Database className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Dataor AI</h2>
                <p className="text-[var(--text-secondary)]">To get started, select an existing data connector or set up a new one.</p>
              </div>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Available Connectors</h4>
                  <Badge variant="outline" className="text-[10px]">{connectors.length} Active</Badge>
                </div>
                
                {isLoadingConnectors ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
                  </div>
                ) : (
                  connectors.map((conn) => (
                    <div key={conn.id} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)]">
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto py-4 px-6 rounded-none hover:bg-[var(--surface-hover)] transition-all"
                        onClick={startChat}
                      >
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-[var(--accent)]" />
                          <div className="flex flex-col items-start">
                            <span className="font-bold text-[var(--text-primary)]">{conn.name}</span>
                            <span className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tighter">{conn.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Ready</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--text-secondary)]" />
                        </div>
                      </Button>
                    </div>
                  ))
                )}
                
                <Button 
                  className="w-full h-auto py-4 rounded-xl mt-6 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white font-bold shadow-lg shadow-[var(--accent)]/20"
                  onClick={onNewConnector}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Connect New Data Source
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col mb-4"
                >
                  <div className="flex justify-start mb-2">
                    <div className="bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]/40 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]/40 animate-bounce" />
                    </div>
                  </div>
                  {processingSteps.length > 0 && (
                    <div className="pl-4 border-l-2 border-[var(--border)] ml-4 mt-2 space-y-2">
                      {processingSteps.map((step, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]"
                        >
                          {idx === processingSteps.length - 1 ? (
                            <Loader2 className="w-3 h-3 text-[var(--accent)] animate-spin" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                          )}
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="p-4 bg-[var(--surface)]/50 backdrop-blur-sm border-t border-[var(--border)]">
        <ChatInput onSend={sendMessage} disabled={isLoading || mode !== 'chat'} />
        <div className="mt-3 text-[10px] text-center text-[var(--text-secondary)]/60 uppercase tracking-widest font-medium">
          {mode === 'chat' ? 'Powered by Aiinhome Technologies Pvt. Ltd' : 'Initializing Agent Environment...'}
        </div>
      </CardFooter>
    </Card>
  );
};
