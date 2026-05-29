import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, RefreshCw, Sparkles, Mic, MicOff, Volume2 } from "lucide-react";

const API_BASE = "/vaccinefee/api";

const SUGGESTED_QUESTIONS = [
  "I am 65 years old, which vaccines should I take?",
  "I am pregnant, what vaccines are safe?",
  "I am traveling to Southeast Asia, what vaccines do I need?",
  "My child is 2 months old, what vaccines are due?",
  "I have diabetes, which vaccines are recommended?",
  "Which vaccines are free at government hospitals?",
];

export default function AIVaccineAdvisor({ pricing = [], vaccines = [], hospitals = [] }) {
  const [messages, setMessages]   = useState([
    {
      role: "assistant",
      content: "👋 Hello! I'm your DHG AI Vaccine Advisor.\n\nI can help you with:\n• **Personalized vaccine recommendations** based on your age, health, and travel plans\n• **Vaccine information** — uses, side effects, schedules\n• **Hospital suggestions** — where to get vaccinated in your city\n• **Price comparisons** across our 108 hospitals\n\nYou can **type** or use the 🎤 **microphone** to ask your question!"
    }
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef             = useRef(null);
  const recognitionRef             = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous    = false;
      recognition.interimResults = true;
      recognition.lang          = "en-IN";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((r) => r[0].transcript).join("");
        setInput(transcript);
        if (event.results[0].isFinal) {
          setListening(false);
        }
      };

      recognition.onerror = () => setListening(false);
      recognition.onend   = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // Text-to-speech for AI responses
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown for speech
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[•-] /gm, "")
      .replace(/\n/g, ". ")
      .substring(0, 500); // Limit length
    const utt   = new SpeechSynthesisUtterance(clean);
    utt.lang    = "en-IN";
    utt.rate    = 0.9;
    utt.pitch   = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const buildSystem = useCallback(() => {
    const vaccineList = vaccines.slice(0, 30).map((v) => {
      const records  = pricing.filter((p) => p.vaccine_id === v.id);
      const prices   = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
      const minPrice = prices.length ? Math.min(...prices) : 0;
      return `${v.name} (${v.manufacturer}) - min ₹${minPrice} at ${records.length} hospitals`;
    }).join("\n");

    const cityHospitals = {};
    hospitals.forEach((h) => {
      const city = h.location?.split(",")[0].trim() || "Other";
      if (!cityHospitals[city]) cityHospitals[city] = [];
      cityHospitals[city].push(h.name);
    });
    const hospitalContext = Object.entries(cityHospitals).slice(0, 10)
      .map(([city, names]) => `${city}: ${names.slice(0, 3).join(", ")}`).join("\n");

    return `You are a helpful vaccine advisor for DHG (Dummy Health Group) healthcare platform in India.
You have access to real vaccine pricing data from ${hospitals.length} hospitals across India, USA, and internationally.

AVAILABLE VACCINES (${vaccines.length} total):
${vaccineList}

HOSPITALS BY CITY (${hospitals.length} total):
${hospitalContext}

GUIDELINES:
- Always recommend consulting a doctor for personalized medical advice
- Base recommendations on Indian healthcare context when relevant
- Mention specific hospitals from our network when suggesting where to get vaccinated
- Include price estimates from our data when relevant
- For Indian government hospitals like AIIMS, RML, VMMC — many vaccines are subsidized or free
- Be concise but comprehensive, use bullet points for readability
- Always end with a note to consult a healthcare professional`;
  }, [vaccines, hospitals, pricing]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    stopSpeaking();

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystem(),
          messages: newMessages.filter((m) => m.role !== "system"),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "API error");
      }

      const data  = await response.json();
      const reply = data.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);

      // Auto-speak if voice was used for input
      if (voiceSupported) speakText(reply);
    } catch (err) {
      setMessages([...newMessages, {
        role: "assistant",
        content: `⚠️ ${err.message === "AI service not configured"
          ? "AI Advisor needs an API key. Please add ANTHROPIC_API_KEY to the backend Kubernetes secret."
          : "Unable to connect. Please try again in a moment."}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4FC3F7">$1</strong>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^• /gm, '<span style="color:#4FC3F7">•</span> ')
      .replace(/^- /gm, '<span style="color:#4FC3F7">•</span> ')
      .replace(/\n/g, "<br/>");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 160px)" }}>
      {/* Header */}
      <div style={{ marginBottom:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"42px", height:"42px", borderRadius:"12px",
            background:"linear-gradient(135deg,#4FC3F7,#1565C0)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Sparkles size={20} style={{ color:"#fff" }}/>
          </div>
          <div>
            <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>AI Vaccine Advisor</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>
              Type or speak your question
              {voiceSupported && <span style={{ color:"#4ADE80", marginLeft:"6px" }}>🎤 Voice & chat enabled</span>}
            </p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:"8px" }}>
            {speaking && (
              <button onClick={stopSpeaking}
                style={{ display:"flex", alignItems:"center", gap:"5px", padding:"7px 12px",
                  borderRadius:"8px", fontSize:"12px", cursor:"pointer",
                  background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)",
                  color:"#FCD34D" }}>
                <Volume2 size={14}/> Stop
              </button>
            )}
            <button onClick={() => { setMessages([messages[0]]); stopSpeaking(); }}
              style={{ display:"flex", alignItems:"center", gap:"5px", padding:"7px 12px",
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                color:"rgba(255,255,255,0.6)", borderRadius:"8px", fontSize:"12px", cursor:"pointer" }}>
              <RefreshCw size={13}/> New Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column",
        gap:"14px", padding:"4px 0", marginBottom:"14px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start",
            flexDirection: msg.role==="user" ? "row-reverse" : "row" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"10px", flexShrink:0,
              background: msg.role==="user"
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg,#4FC3F7,#1565C0)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              {msg.role==="user"
                ? <User size={16} style={{ color:"rgba(255,255,255,0.7)" }}/>
                : <Bot size={16} style={{ color:"#fff" }}/>}
            </div>
            <div style={{ position:"relative" }}>
              <div style={{
                maxWidth:"75%", padding:"12px 16px", borderRadius:"12px",
                fontSize:"13px", lineHeight:1.7,
                background: msg.role==="user" ? "rgba(79,195,247,0.15)" : "rgba(255,255,255,0.07)",
                border: msg.role==="user" ? "1px solid rgba(79,195,247,0.3)" : "1px solid rgba(255,255,255,0.1)",
                color:"rgba(255,255,255,0.88)",
                borderTopRightRadius: msg.role==="user" ? "4px" : "12px",
                borderTopLeftRadius:  msg.role==="assistant" ? "4px" : "12px",
              }}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}/>
              {/* Speak button on assistant messages */}
              {msg.role==="assistant" && voiceSupported && (
                <button onClick={() => speakText(msg.content)}
                  style={{ position:"absolute", bottom:"-18px", left:"0",
                    background:"none", border:"none", color:"rgba(255,255,255,0.3)",
                    cursor:"pointer", fontSize:"10px", display:"flex", alignItems:"center", gap:"3px" }}>
                  <Volume2 size={10}/> Listen
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"10px", flexShrink:0,
              background:"linear-gradient(135deg,#4FC3F7,#1565C0)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bot size={16} style={{ color:"#fff" }}/>
            </div>
            <div style={{ padding:"14px 18px", borderRadius:"12px", borderTopLeftRadius:"4px",
              background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              display:"flex", gap:"5px", alignItems:"center" }}>
              {[0,1,2].map((d) => (
                <div key={d} style={{ width:"7px", height:"7px", borderRadius:"50%",
                  background:"#4FC3F7", animation:"pulse 1.2s ease-in-out infinite",
                  animationDelay:`${d*0.2}s` }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom:"14px" }}>
          <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginBottom:"8px",
            textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:"600" }}>
            Suggested Questions
          </div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {SUGGESTED_QUESTIONS.slice(0,4).map((q) => (
              <button key={q} onClick={() => sendMessage(q)}
                style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"12px", cursor:"pointer",
                  background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)",
                  color:"rgba(255,255,255,0.7)", textAlign:"left" }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice indicator */}
      {listening && (
        <div style={{ textAlign:"center", marginBottom:"10px", padding:"10px",
          background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
          borderRadius:"10px", color:"#F87171", fontSize:"13px",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#EF4444",
            animation:"pulse 0.8s ease-in-out infinite" }}/>
          Listening... speak your question in English
        </div>
      )}

      {/* Input area */}
      <div style={{ display:"flex", gap:"10px", alignItems:"flex-end" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? "Listening... speak now" : "Ask about vaccines, recommendations, side effects, prices..."}
          rows={2}
          style={{ flex:1, padding:"12px 16px", background:"rgba(255,255,255,0.08)",
            border: listening ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.2)",
            borderRadius:"12px", color:"#fff", fontSize:"13px", fontFamily:"inherit",
            outline:"none", resize:"none", lineHeight:1.5,
            boxShadow: listening ? "0 0 0 3px rgba(239,68,68,0.15)" : "none" }}
        />

        {/* Voice button */}
        {voiceSupported && (
          <button onClick={toggleVoice}
            title={listening ? "Stop listening" : "Start voice input"}
            style={{ width:"46px", height:"46px", borderRadius:"12px", flexShrink:0, border:"none",
              background: listening
                ? "linear-gradient(135deg,#EF4444,#DC2626)"
                : "rgba(255,255,255,0.1)",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: listening ? "0 0 16px rgba(239,68,68,0.4)" : "none",
              animation: listening ? "pulse 1s ease-in-out infinite" : "none" }}>
            {listening ? <MicOff size={18} style={{ color:"#fff" }}/> : <Mic size={18} style={{ color:"rgba(255,255,255,0.7)" }}/>}
          </button>
        )}

        {/* Send button */}
        <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          style={{ width:"46px", height:"46px", borderRadius:"12px", flexShrink:0, border:"none",
            background: input.trim() && !loading
              ? "linear-gradient(135deg,#4FC3F7,#1565C0)"
              : "rgba(255,255,255,0.08)",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Send size={18} style={{ color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.3)" }}/>
        </button>
      </div>

      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", textAlign:"center", marginTop:"8px" }}>
        AI responses are for informational purposes only. Always consult a qualified healthcare professional.
        {voiceSupported && " • Voice input supported in English"}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity:0.3; transform:scale(0.8); }
          50%       { opacity:1;   transform:scale(1);   }
        }
      `}</style>
    </div>
  );
}