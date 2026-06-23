import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileSpreadsheet, Send, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadDataFile } from '../services/api';

interface InputPageProps {
  onTriggerAnalysis: (data: {
    orgName: string;
    industry: string;
    size: string;
    requirements: string;
    filePath?: string;
  }) => void;
  onBack: () => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  component?: React.ReactNode;
}

const InputPage: React.FC<InputPageProps> = ({ onTriggerAnalysis, onBack }) => {
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('Medium (50-250)');
  const [requirements, setRequirements] = useState('');
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Bot questions sequence
  const botQuestions = [
    "Hello! I am your AI Business Intelligence assistant. Let's design your organizational growth dashboard. First, what is the name of your organization?",
    "Great! What industry or sector does your organization operate in? (e.g. Retail, SaaS Tech, Healthcare, Manufacturing)",
    "Got it. What is the approximate size of your company in terms of employee headcount?",
    "Perfect. Now, please describe your organization's goals, current concerns, and the key metrics or KPIs you care about (e.g., 'sales growth, customer churn, marketing ROI').",
    "Finally, upload a CSV or Excel dataset containing your historical metrics (revenue, cost, department, dates). You can drag/drop a file, click to upload, or use our pre-configured Demo Dataset to try the app instantly."
  ];

  // Initialize chatbot
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: botQuestions[0] }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, step]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Save user answer
    const currentStep = step;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue('');

    // Capture variables based on step
    if (currentStep === 0) {
      setOrgName(text);
      nextStep(currentStep + 1, `Nice to meet you. Let's audit ${text}.`);
    } else if (currentStep === 1) {
      setIndustry(text);
      nextStep(currentStep + 1, `Understood, analyzing within the context of the ${text} sector.`);
    } else if (currentStep === 2) {
      setSize(text);
      nextStep(currentStep + 1, `Headcount recorded: ${text}.`);
    } else if (currentStep === 3) {
      setRequirements(text);
      nextStep(currentStep + 1);
    }
  };

  const nextStep = (next: number, followUpPrefix = '') => {
    setStep(next);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: followUpPrefix ? `${followUpPrefix} ${botQuestions[next]}` : botQuestions[next] 
        }
      ]);
    }, 600);
  };

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFileUpload(e.target.files[0]);
    }
  };

  const processFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadDataFile(file);
      setFileName(result.originalName);
      setFilePath(result.filePath);
      
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: `Successfully ingested file: ${result.originalName} (${(result.size / 1024).toFixed(1)} KB). We are ready to run the analysis!`,
          component: (
            <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs font-semibold mt-2 max-w-max">
              <CheckCircle2 className="h-4 w-4" />
              <span>{result.originalName} Ingested</span>
            </div>
          )
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'bot', 
          text: `Failed to upload file: ${err.response?.data?.error || err.message}. Please try again, or continue using the demo dataset.` 
        }
      ]);
    } finally {
      setUploading(false);
    }
  };

  const loadDemoData = () => {
    setFileName("sample_data.csv");
    setFilePath("database/sample_data.csv"); // Points backend to standard demo file path
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: "Demo dataset loaded successfully! Proceeding with built-in seasonal mock metrics.",
        component: (
          <div className="flex items-center space-x-2 text-neonBlue bg-neonBlue/10 border border-neonBlue/20 px-3.5 py-2 rounded-xl text-xs font-semibold mt-2 max-w-max">
            <Sparkles className="h-4 w-4" />
            <span>sample_data.csv Ingested</span>
          </div>
        )
      }
    ]);
  };

  const handleExecute = () => {
    onTriggerAnalysis({
      orgName,
      industry,
      size,
      requirements,
      filePath
    });
  };

  return (
    <div className="min-h-screen bg-darkBg flex flex-col h-screen text-gray-200 relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neonBlue/5 rounded-full filter blur-[100px] -z-10"></div>
      
      {/* Header bar */}
      <header className="bg-darkCard border-b border-darkBorder py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-darkBorder/40 hover:bg-darkBorder/80 border border-darkBorder text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold font-outfit text-white">New Strategic Audit</h1>
            <p className="text-xs text-gray-500">Conversational Requirement Configuration</p>
          </div>
        </div>
      </header>

      {/* Chat workspace */}
      <main className="flex-1 overflow-y-auto px-8 py-8 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xl rounded-2xl p-5 border text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-neonBlue/20 to-neonPurple/20 border-neonBlue/40 text-white rounded-tr-none'
                  : 'bg-darkCard border-darkBorder text-gray-300 rounded-tl-none shadow-xl'
              }`}
            >
              <p>{msg.text}</p>
              {msg.component}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input panel fixed bottom */}
      <footer className="bg-darkCard border-t border-darkBorder p-6">
        <div className="max-w-4xl mx-auto w-full">
          {/* STEP 0: Org Name Input */}
          {step === 0 && (
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type your organization name..."
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-darkBg border border-darkBorder rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neonBlue/60 text-white placeholder-gray-600"
              />
              <button
                onClick={() => handleSend()}
                className="p-3 bg-neonBlue rounded-xl text-white hover:opacity-90 transition-opacity"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* STEP 1: Industry Choices */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['Retail / E-commerce', 'SaaS Technology', 'Healthcare', 'Manufacturing', 'Finance / Banking', 'Education'].map(ind => (
                  <button
                    key={ind}
                    onClick={() => handleSend(ind)}
                    className="px-4 py-2 bg-darkBg border border-darkBorder hover:border-neonBlue/50 hover:bg-darkBorder/40 rounded-xl text-xs font-semibold text-gray-300 transition-all duration-150"
                  >
                    {ind}
                  </button>
                ))}
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Or type custom industry sector..."
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-darkBg border border-darkBorder rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neonBlue/60 text-white placeholder-gray-600"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-3 bg-neonBlue rounded-xl text-white hover:opacity-90 transition-opacity"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Size Choices */}
          {step === 2 && (
            <div className="flex flex-wrap gap-3">
              {['Small (<50 employees)', 'Medium (50-250 employees)', 'Large (250+ employees)'].map(sz => (
                <button
                  key={sz}
                  onClick={() => handleSend(sz)}
                  className="flex-1 py-4 bg-darkBg border border-darkBorder hover:border-neonBlue/50 hover:bg-darkBorder/40 rounded-xl text-xs font-bold text-gray-300 transition-all duration-150"
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Goals / KPI descriptions */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  "Maximize sales revenue and support customer retention goals.",
                  "Reduce overhead cost and audit operational departments.",
                  "Improve inventory turnaround speeds and optimize product supply lines."
                ].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => handleSend(phrase)}
                    className="text-left w-full px-4 py-2.5 bg-darkBg border border-darkBorder hover:border-neonBlue/50 hover:bg-darkBorder/40 rounded-xl text-xs text-gray-400 hover:text-gray-200 transition-all duration-150"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
              <div className="flex space-x-3">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="Describe your goals in detail..."
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1 bg-darkBg border border-darkBorder rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neonBlue/60 text-white placeholder-gray-600 h-16 resize-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-3 bg-neonBlue rounded-xl text-white hover:opacity-90 flex items-center justify-center self-end h-12 w-12"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: File Upload / Ingest Controls */}
          {step === 4 && (
            <div className="space-y-6">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-neonBlue bg-neonBlue/5' 
                    : fileName 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-darkBorder hover:border-darkBorder/80 bg-darkBg/30'
                }`}
              >
                <input
                  type="file"
                  id="file-upload-id"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <FileSpreadsheet className={`h-12 w-12 mb-3 ${fileName ? 'text-emerald-400' : 'text-gray-500'}`} />
                {uploading ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <RefreshCw className="h-4 w-4 animate-spin text-neonBlue" />
                    <span>Analyzing document structure...</span>
                  </div>
                ) : fileName ? (
                  <div>
                    <span className="text-sm font-semibold text-white block">{fileName}</span>
                    <span className="text-xs text-gray-500 block mt-1">Ready for compilation</span>
                    <label
                      htmlFor="file-upload-id"
                      className="mt-4 inline-block text-xs font-semibold text-neonBlue hover:underline cursor-pointer"
                    >
                      Change File
                    </label>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-300">Drag and drop your CSV/Excel spreadsheet here</p>
                    <p className="text-xs text-gray-500 mt-1">or</p>
                    <label
                      htmlFor="file-upload-id"
                      className="mt-3 inline-block px-4 py-2 bg-darkBorder/60 hover:bg-darkBorder border border-darkBorder rounded-xl text-xs font-bold text-gray-200 cursor-pointer transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>

              {/* Loader controls */}
              <div className="flex items-center justify-between pt-4 border-t border-darkBorder">
                <button
                  onClick={loadDemoData}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-darkCard border border-darkBorder hover:border-neonBlue/40 text-gray-300 text-xs font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-neonBlue" />
                  <span>Use Demo Dataset</span>
                </button>

                <button
                  onClick={handleExecute}
                  disabled={!fileName || uploading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold text-sm shadow-neon flex items-center space-x-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Generate Dashboard</span>
                  <Sparkles className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default InputPage;
