import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, BarChart3, AlertCircle, CheckCircle2, ArrowRightCircle, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendMessage, Message } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'model', text: 'Hola, soy tu **Asesor UX**. Estoy aquí para validar tus hipótesis de negocio, estimar el ROI de tus propuestas y asegurarnos de que tu trabajo final sea sólido y estratégico. ¿En qué parte del proceso te encuentras?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await sendMessage(newMessages);
    setMessages([...newMessages, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 lg:p-8 font-sans flex flex-col max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Target className="w-7 h-7 text-brand-accent" />
            Asesor UX <span className="text-brand-accent font-medium opacity-50 tracking-normal ml-1">/ Dashboard</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Consultoría Senior en Estrategia & Diseño</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-zinc-100">Cata Hormazábal</p>
            <p className="text-xs text-zinc-500 italic">UX Lead en Formación</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center border-2 border-brand-accent/20 text-brand-accent font-bold">
            CH
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 auto-rows-min lg:grid-rows-6 gap-6 flex-1">
        
        {/* Chat Main Interface */}
        <div className="col-span-12 lg:col-span-8 row-span-6 bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 shadow-xl shadow-black/20 flex flex-col overflow-hidden h-[600px] lg:h-auto">
          <div className="px-6 py-4 border-b-2 border-zinc-800 flex items-center justify-between bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="font-bold text-zinc-300 text-sm uppercase tracking-wider">Asesor UX Conectado</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono italic">Strategic Session #UX-2026</span>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 p-6 space-y-6 overflow-y-auto bg-zinc-900/50"
          >
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm",
                    m.role === 'user' ? "bg-zinc-100 text-zinc-900" : "bg-brand-accent text-white"
                  )}>
                    {m.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className={cn(
                    "p-5 rounded-2xl max-w-[85%] lg:max-w-[75%] shadow-sm",
                    m.role === 'user' 
                      ? "bg-brand-accent text-white rounded-tr-none" 
                      : "bg-zinc-800 text-zinc-300 rounded-tl-none border border-zinc-700"
                  )}>
                    <div className={cn("markdown-body prose prose-sm max-w-none prose-invert", m.role === 'user' && "text-white")}>
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent flex-shrink-0 flex items-center justify-center text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-5 italic text-zinc-500 text-sm rounded-tl-none">
                  Calculando impacto y analizando viabilidad estratégica...
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 pt-2 bg-zinc-900">
            <div className="flex items-center gap-3 p-2 bg-zinc-800 border-2 border-zinc-700 rounded-[1.5rem] focus-within:border-brand-accent/50 focus-within:shadow-lg focus-within:shadow-brand-accent/5 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu hipótesis o duda estratégica..." 
                className="bg-transparent flex-1 px-4 py-3 outline-none text-sm text-zinc-200 font-medium placeholder:text-zinc-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-brand-accent hover:bg-brand-accent/90 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Enviar
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress & Stats Card */}
        <div className="col-span-12 lg:col-span-4 row-span-2 bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Carga Metodológica</span>
              <h2 className="text-2xl font-black text-zinc-100">72%</h2>
            </div>
            <span className="text-xs bg-brand-accent/10 text-brand-accent font-bold px-3 py-1.5 rounded-full border border-brand-accent/20 uppercase tracking-tight">On Track</span>
          </div>
          <div className="mt-4">
            <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden p-1 border border-zinc-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                className="h-full bg-brand-accent rounded-full"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-3 font-medium flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Faltan 14 días para la entrega final del Business Case.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-zinc-800 p-3 rounded-[1.5rem] border border-zinc-700/60 hover:bg-zinc-700 transition-colors">
              <div className="text-xl font-black text-zinc-100">18</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Métricas ROI</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded-[1.5rem] border border-zinc-700/60 hover:bg-zinc-700 transition-colors">
              <div className="text-xl font-black text-zinc-100">12%</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Churn Reducido</div>
            </div>
          </div>
        </div>

        {/* Actionable Tips Card (Dark) */}
        <div className="col-span-12 lg:col-span-4 row-span-2 bg-brand-accent rounded-[2.5rem] p-7 text-white flex flex-col shadow-xl shadow-brand-accent/10">
          <div className="flex items-center gap-2 mb-4">
             <AlertCircle className="w-5 h-5 text-white/80" />
             <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">Recordatorio ROI</span>
          </div>
          <blockquote className="text-lg font-medium leading-tight mb-auto italic text-white">
            "Todo diseño es una apuesta de negocio. Si no puedes medir su impacto, no es diseño estratégico."
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
             <div className="px-3 py-1.5 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20">Tip del Día</div>
             <p className="text-[11px] text-white/80 font-medium">Usa la métrica LTV para justificar UX.</p>
          </div>
        </div>

        {/* Project Checklist Card */}
        <div className="col-span-12 lg:col-span-4 row-span-2 bg-zinc-900 rounded-[2.5rem] border-2 border-zinc-800 p-7 flex flex-col overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Checklist Académico
          </span>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { label: 'Diagnóstico de Negocio', done: true },
              { label: 'Matriz de Actores UX', done: true },
              { label: 'Definición de KPIs', done: false },
              { label: 'Prototipo de Alta Faltante', done: false },
              { label: 'Estimación de ROI Final', done: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  item.done ? "bg-brand-success border-brand-success text-white" : "border-zinc-700 bg-zinc-800 shadow-inner"
                )}>
                  {item.done && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className={cn(
                  "text-sm font-semibold transition-all",
                  item.done ? "text-zinc-600 line-through" : "text-zinc-300"
                )}>
                  {item.label}
                </span>
                {!item.done && <ArrowRightCircle className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}
