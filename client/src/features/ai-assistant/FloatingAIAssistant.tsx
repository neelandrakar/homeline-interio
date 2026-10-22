import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Loader2,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  ArrowRight,
  CheckCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { api } from '../../services/api';
import { AIChatMessage, ExtractedRequirements } from '../../types';
import { useLeadModal } from '../../context/LeadModalContext';

export const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-01',
      role: 'assistant',
      content: "Hi! I'm your interior design assistant. Tell me a little about the space you're planning, and I'll help you organize your ideas.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(`conv-${Date.now()}`);
  const [extracted, setExtracted] = useState<ExtractedRequirements>({
    missingRequirements: ['projectType', 'locality', 'budget']
  });
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    'Plan My Kitchen',
    'Design My Living Room',
    'Explore Full Home Interiors',
    'Help Me Set a Budget'
  ]);
  const [leadRecommended, setLeadRecommended] = useState(false);
  const [aiProviderLabel, setAiProviderLabel] = useState('Deterministic Knowledge Engine');

  const { openModal } = useLeadModal();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Send past context to API
      const serverPayload = newMessages
        .filter(m => m.id !== 'welcome-01')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await api.chatWithAI(
        serverPayload.length > 0 ? serverPayload : [{ role: 'user', content: text }],
        conversationId,
        undefined,
        extracted
      );

      const botMessage: AIChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.assistantMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setExtracted(res.extractedRequirements || {});
      setSuggestedActions(res.suggestedActions || []);
      setLeadRecommended(res.leadCaptureRecommended);
      setAiProviderLabel(res.provider || 'Knowledge Engine');
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: "I'm having a slight connectivity hiccup, but you can always share your project requirements directly with our design team through our consultation form.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-01',
        role: 'assistant',
        content: "Hi! I'm your interior design assistant. Tell me a little about the space you're planning, and I'll help you organize your ideas.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setConversationId(`conv-${Date.now()}`);
    setExtracted({ missingRequirements: ['projectType', 'locality', 'budget'] });
    setSuggestedActions([
      'Plan My Kitchen',
      'Design My Living Room',
      'Explore Full Home Interiors',
      'Help Me Set a Budget'
    ]);
    setLeadRecommended(false);
  };

  // Pre-configured realistic sample simulation for prospective clients
  const handleRunDemoSimulation = async () => {
    handleReset();
    const demoPrompt = "I've just bought a 2BHK flat in Garia and want a modular kitchen and living room design within ₹3 lakh.";
    await handleSendMessage(demoPrompt);
  };

  const handleOpenLeadFormFromAI = () => {
    const summaryLines: string[] = [];
    if (extracted.propertyType) summaryLines.push(`Property: ${extracted.propertyType}`);
    if (extracted.projectType) summaryLines.push(`Project Type: ${extracted.projectType}`);
    if (extracted.locality) summaryLines.push(`Locality: ${extracted.locality}`);
    if (extracted.budget) summaryLines.push(`Budget: ${extracted.budget}`);
    if (extracted.style) summaryLines.push(`Style: ${extracted.style}`);

    // Map extracted projectType to form options
    let mappedType: any = 'Modular Kitchens';
    if (extracted.projectType?.includes('Full Home')) mappedType = 'Full Home Interiors';
    else if (extracted.projectType?.includes('Living Room')) mappedType = 'Living Room Design';
    else if (extracted.projectType?.includes('Bedroom')) mappedType = 'Bedroom Interiors';
    else if (extracted.projectType?.includes('Space Planning')) mappedType = 'Space Planning';
    else if (extracted.projectType?.includes('Renovation')) mappedType = 'Renovation Consultation';

    openModal({
      projectType: mappedType,
      locality: extracted.locality || 'Garia, Kolkata',
      budgetRange: extracted.budget || '₹3 - ₹6 Lakh',
      source: 'ai_assistant',
      conversationSummary: summaryLines.join(' | ') || 'AI Assistant Consultation Brief',
      description: `Enquiry generated from AI Consultant brief. Requirements: ${summaryLines.join(', ')}`
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 bg-olive-700 hover:bg-olive-800 text-white pl-4 pr-5 py-3.5 rounded-full shadow-elevated transition-transform hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-olive-300"
          aria-label="Open AI Interior Design Consultant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-olive-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-wood-400 rounded-full border-2 border-olive-700" />
          </div>
          <div className="text-left font-sans">
            <span className="text-xs uppercase tracking-wider font-semibold block leading-tight">
              AI Design Consultant
            </span>
            <span className="text-[10px] text-olive-200 block leading-tight font-normal">
              Organize your space brief
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-base-ivory border border-base-border shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[540px] sm:h-[680px]'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[88vh] sm:h-[580px]'
          }`}
          role="dialog"
          aria-labelledby="ai-chat-title"
        >
          {/* Header */}
          <div className="bg-charcoal-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-charcoal-800 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-olive-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 id="ai-chat-title" className="text-sm font-semibold tracking-wide flex items-center">
                  <span>Homeline AI Consultant</span>
                  <span className="ml-2 px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-olive-800 text-olive-200 rounded">
                    Demo
                  </span>
                </h3>
                <p className="text-[10px] text-charcoal-400 truncate max-w-[200px]">
                  {aiProviderLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 text-charcoal-400 hover:text-white rounded hover:bg-charcoal-800 transition-colors"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-block p-1.5 text-charcoal-400 hover:text-white rounded hover:bg-charcoal-800 transition-colors"
                aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-charcoal-400 hover:text-white rounded hover:bg-charcoal-800 transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Requirements Identified Tracker Bar */}
          {(extracted.projectType || extracted.locality || extracted.propertyType || extracted.budget) && (
            <div className="bg-base-surface px-3 py-2 border-b border-base-border flex items-center space-x-1.5 overflow-x-auto text-[11px] text-charcoal-700 flex-shrink-0">
              <span className="font-semibold text-olive-800 uppercase tracking-wider text-[9px]">
                Brief:
              </span>
              {extracted.propertyType && (
                <span className="px-2 py-0.5 bg-white border border-base-border rounded-full text-charcoal-800 whitespace-nowrap">
                  {extracted.propertyType}
                </span>
              )}
              {extracted.projectType && (
                <span className="px-2 py-0.5 bg-white border border-base-border rounded-full text-charcoal-800 whitespace-nowrap">
                  {extracted.projectType}
                </span>
              )}
              {extracted.locality && (
                <span className="px-2 py-0.5 bg-white border border-base-border rounded-full text-charcoal-800 whitespace-nowrap">
                  📍 {extracted.locality}
                </span>
              )}
              {extracted.budget && (
                <span className="px-2 py-0.5 bg-white border border-base-border rounded-full text-charcoal-800 whitespace-nowrap">
                  💰 {extracted.budget}
                </span>
              )}
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-ivory">
            
            {/* Demo Simulation Action Banner */}
            {messages.length === 1 && (
              <div className="p-3 bg-wood-50 border border-wood-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center text-wood-700 font-medium">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-wood-500" />
                  <span>Evaluating for client presentation?</span>
                </div>
                <p className="text-charcoal-600 text-[11px] leading-relaxed">
                  Click below to simulate a sample conversation (Garia 2BHK flat, modular kitchen & living room under ₹3L) and see the lead handover in action.
                </p>
                <button
                  type="button"
                  onClick={handleRunDemoSimulation}
                  className="w-full py-1.5 px-3 bg-wood-500 hover:bg-wood-600 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                >
                  ⚡ Try Sample Kolkata Enquiry
                </button>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-charcoal-800 text-white'
                      : 'bg-olive-700 text-white'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-olive-700 text-white rounded-tr-none'
                      : 'bg-white text-charcoal-800 border border-base-border shadow-soft rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.role === 'user' ? 'text-olive-200 text-right' : 'text-charcoal-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-charcoal-400 text-xs py-2">
                <Loader2 className="w-4 h-4 animate-spin text-olive-600" />
                <span>Thinking with Homeline design knowledge...</span>
              </div>
            )}

            {/* Handover Card when Lead Capture is Recommended */}
            {leadRecommended && (
              <div className="p-4 bg-olive-50 border border-olive-300 rounded-xl space-y-2.5 animate-fade-in shadow-soft">
                <div className="flex items-center text-olive-800 font-semibold text-xs space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-olive-600" />
                  <span>Ready to Schedule a Consultation?</span>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  I've compiled your room scope and Kolkata location. Would you like to review and send this brief to our design team?
                </p>
                <button
                  type="button"
                  onClick={handleOpenLeadFormFromAI}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-wider font-semibold rounded shadow-soft transition-all"
                >
                  <span>Review & Submit Enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          {suggestedActions.length > 0 && (
            <div className="px-3 py-2 bg-base-surfaceLight border-t border-base-border flex items-center space-x-2 overflow-x-auto text-xs flex-shrink-0">
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(action)}
                  className="px-2.5 py-1 bg-white hover:bg-olive-50 text-charcoal-700 hover:text-olive-800 border border-base-border hover:border-olive-300 rounded-full text-[11px] whitespace-nowrap transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-base-border flex items-center space-x-2 flex-shrink-0"
          >
            <input
              type="text"
              placeholder="Tell me about your flat or kitchen ideas..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-base-surfaceLight border border-base-border rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-900"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-olive-700 hover:bg-olive-800 disabled:bg-charcoal-300 text-white rounded-lg transition-colors focus:outline-none"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
