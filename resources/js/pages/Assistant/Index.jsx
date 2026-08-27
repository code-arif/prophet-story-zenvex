import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Sparkles,
  MessageSquare,
  Mic,
  Copy,
  Check,
  Edit2,
  Send,
  Loader2,
  ChevronDown,
  Volume2,
  VolumeX,
  Zap,
  RotateCcw,
  Link as LinkIcon,
  X,
  Radio,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { toBnDigits } from '../../lib/format';
import { VoiceChatOverlay } from '../../components/VoiceChatOverlay';

/**
 * Screen 14 & AI Suite — Assistant · সহায়ক (AI Assistant & Voice Assistant Suite)
 * Features:
 * 1. AI Draft Generator (Interactive Situation Chips, Job Dropdown, Short/Detailed Toggle, Live Generation, Breakdown, Copy, Save to Job Note)
 * 2. 100% Dynamic & Functional AI Chatting (Interactive Live Message Feed, Real-time API Response)
 * 3. Realtime WebRTC Voice Assistant (OpenAI Realtime WebRTC session, Rhythmic Canvas Visualizer, Live Stream)
 * Responsive 2-column desktop grid layout (max-w-5xl).
 */
export default function AssistantIndex({ jobs = [], situations = [] }) {
  const { t } = useI18n();

  // Active Main Mode: 'draft' | 'chat' | 'voice' (synced with ?tab= query parameter)
  const getValidTab = (tab) => (['draft', 'chat', 'voice'].includes(tab) ? tab : 'draft');

  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return getValidTab(params.get('tab'));
    }
    return 'draft';
  });

  const handleTabChange = (newMode) => {
    const validMode = getValidTab(newMode);
    setMode(validMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', validMode);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setMode(getValidTab(params.get('tab')));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Overlay state
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);

  // DRAFT GENERATOR STATE
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || 1);
  const [selectedSituationId, setSelectedSituationId] = useState('proposal');
  const [promptText, setPromptText] = useState('আমি একটি নতুন লোগো ও ইউআই ডিজাইনের প্রস্তাব পাঠাতে চাই।');
  const [lengthMode, setLengthMode] = useState('short'); // 'short' | 'detailed'
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftResult, setDraftResult] = useState({
    text: "Hi Ahmed Traders team,\n\nI have reviewed your requirements for লোগো ডিজাইন. Based on the scope, I propose completing this in 3 days for ৳5,000. Please let me know if you would like to proceed.\n\nBest regards,\n[Your Name]",
    client: 'Ahmed Traders',
    explanations: [
      { num: 1, text: 'এই লাইনটা দাম আর সময় একসাথে বলছে, যাতে ক্লায়েন্ট পরিষ্কার ধারণা পায়।' },
      { num: 2, text: 'পেশাদারিত্ব বজায় রেখে কাজ শুরুর অনুমতি চাওয়া হয়েছে।' },
    ],
  });
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editableDraftText, setEditableDraftText] = useState(draftResult.text);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [linkingToJob, setLinkingToJob] = useState(false);

  // CHAT STATE (100% Dynamic)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'স্বাগতম! আমি আপনার ইজি রাইজ AI সহায়িকা। প্রস্তাবনা লেখা, পেমেন্ট তাগাদা, বা রেট নির্ধারণে আপনার যেকোনো প্রশ্ন লিখুন।',
      time: '১১:০০ AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // REALTIME WEBRTC VOICE ASSISTANT STATE
  const [voiceStatus, setVoiceStatus] = useState('idle'); // idle | connecting | active | error
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState(
    'আহমেদ ট্রেডার্স এর জন্য লোগো ডিজাইনের প্রস্তাবনা তৈরি করতে চাই'
  );

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const audioEl = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const canvasRef = useRef(null);

  const selectedJobObj = jobs.find((j) => j.id == selectedJobId) || jobs[0];

  // Draw modern AI fluid audio visualizer on canvas
  const drawVisualizer = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let phase = 0;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 56;

      // Calculate average audio level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const intensity = avg / 255;

      phase += 0.04 + intensity * 0.06;

      // Multi-layered Siri / AI Glowing Fluid Wave Rings
      const ringConfigs = [
        { color1: 'rgba(124, 58, 237, 0.85)', color2: 'rgba(37, 99, 235, 0.4)', speedMultiplier: 1, waveCount: 5, amplitude: 10 },
        { color1: 'rgba(236, 72, 153, 0.75)', color2: 'rgba(147, 51, 234, 0.35)', speedMultiplier: -1.2, waveCount: 4, amplitude: 14 },
        { color1: 'rgba(16, 185, 129, 0.85)', color2: 'rgba(59, 130, 246, 0.4)', speedMultiplier: 1.5, waveCount: 6, amplitude: 12 },
      ];

      ringConfigs.forEach((config) => {
        ctx.save();
        ctx.beginPath();
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const dataIndex = Math.floor((i / steps) * (bufferLength / 2));
          const val = dataArray[dataIndex] || 0;
          const amp = (val / 255) * config.amplitude * (0.5 + intensity * 1.5);

          const wave = Math.sin(angle * config.waveCount + phase * config.speedMultiplier) * (5 + amp);
          const r = baseRadius + wave + intensity * 14;

          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.5, centerX, centerY, baseRadius + 30);
        grad.addColorStop(0, config.color2);
        grad.addColorStop(1, config.color1);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3 + intensity * 3;
        ctx.shadowColor = config.color1;
        ctx.shadowBlur = 10 + intensity * 15;
        ctx.stroke();
        ctx.restore();
      });
    };
    draw();
  }, []);

  // Start WebRTC Realtime Voice Session
  const startVoiceSession = async () => {
    try {
      setVoiceStatus('connecting');
      setVoiceError('');
      setIsMuted(false);

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const tokenResponse = await fetch('/ai/realtime/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ scenario: 'assistant' }),
      });

      if (tokenResponse.status === 401 || tokenResponse.status === 302) {
        setVoiceError('এই সেবা ব্যবহারের জন্য লগইন করতে হবে।');
        setVoiceStatus('error');
        return;
      }

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.client_secret?.value) {
        throw new Error(tokenData.error || 'Token পাওয়া যায়নি');
      }

      const ephemeralKey = tokenData.client_secret.value;
      const voice = tokenData.voice || 'coral';
      const model = tokenData.model || 'gpt-realtime';

      const pc = new RTCPeerConnection();
      peerConnection.current = pc;

      audioEl.current = document.createElement('audio');
      audioEl.current.autoplay = true;
      document.body.appendChild(audioEl.current);
      pc.ontrack = (e) => {
        if (audioEl.current) {
          audioEl.current.srcObject = e.streams[0];
        }
      };

      const ms = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      localStream.current = ms;
      pc.addTrack(ms.getTracks()[0]);

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(ms);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawVisualizer();

      const dc = pc.createDataChannel('oai-events');
      dc.onopen = () => {
        dc.send(JSON.stringify({
          type: 'session.update',
          session: { type: 'realtime', voice, temperature: 0.7, modalities: ['text', 'audio'] },
        }));
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        const err = await sdpResponse.json().catch(() => ({}));
        throw new Error(err.error?.message || 'সংযোগ ব্যর্থ হয়েছে');
      }

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: await sdpResponse.text(),
      });

      setVoiceStatus('active');
    } catch (err) {
      console.error('Voice Session Error:', err);
      setVoiceError(err.message || 'ভয়েস চ্যাট সংযোগ করতে সমস্যা হয়েছে।');
      setVoiceStatus('error');
    }
  };

  // Stop WebRTC Realtime Voice Session
  const stopVoiceSession = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((t) => t.stop());
      localStream.current = null;
    }
    if (audioEl.current) {
      audioEl.current.srcObject = null;
      audioEl.current.remove();
      audioEl.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    analyserRef.current = null;
    setVoiceStatus((prev) => (prev === 'error' ? 'error' : 'idle'));
  }, []);

  const toggleMuteVoiceSession = () => {
    if (localStream.current) {
      const track = localStream.current.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, [stopVoiceSession]);

  // Handle Situation Pill Click
  const handleSelectSituation = (sit) => {
    setSelectedSituationId(sit.id);
    if (sit.prompt_preset) {
      setPromptText(sit.prompt_preset);
    }
  };

  // Generate Draft via API call
  const handleGenerateDraft = async () => {
    setIsGeneratingDraft(true);
    try {
      const response = await fetch('/assistant/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          situation: selectedSituationId,
          job_title: selectedJobObj?.title || 'লোগো ডিজাইন',
          client_name: selectedJobObj?.client_name || 'Ahmed Traders',
          prompt: promptText,
          length: lengthMode,
        }),
      });

      const data = await response.json();
      if (data.draft) {
        setDraftResult({
          text: data.draft,
          client: data.client || selectedJobObj?.client_name || 'Client',
          explanations: data.explanations || [],
        });
        setEditableDraftText(data.draft);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Copy Draft to Clipboard
  const handleCopyDraft = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  // Link Draft to Job Notes
  const handleLinkDraftToJob = () => {
    setLinkingToJob(true);
    router.post(
      '/assistant/link-job',
      {
        job_id: selectedJobId,
        draft: isEditingDraft ? editableDraftText : draftResult.text,
      },
      {
        preserveScroll: true,
        onFinish: () => {
          setLinkingToJob(false);
        },
      }
    );
  };

  // Handle Dynamic Chat Message Submission
  const handleSendChatMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    const newHistory = [
      ...chatMessages,
      { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) },
    ];
    setChatMessages(newHistory);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();
      if (data.reply) {
        setChatMessages([
          ...newHistory,
          { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="space-y-6 font-bn max-w-5xl mx-auto pb-28">
      <Head title="সহায়ক — ইজি রাইজ" />

      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-[10%] size-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] -right-[10%] size-96 bg-brand/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Top Navigation Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h1 className="text-[24px] font-black text-ink tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-purple-600 fill-purple-100" />
            সহায়ক (AI Assistant)
          </h1>
          <p className="text-[13.5px] text-muted font-medium mt-0.5">
            স্মার্ট ক্লায়েন্ট মেসেজ খসড়া, এআই সরাসরি চ্যাট ও ভয়েস সহকারী
          </p>
        </div>

        {/* Main Mode Tabs Switcher */}
        <div className="flex bg-purple-100/70 p-1 rounded-2xl border border-purple-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('draft')}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'draft'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'text-purple-900 hover:bg-purple-200/60'
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>খসড়া</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'chat'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'text-purple-900 hover:bg-purple-200/60'
            }`}
          >
            <MessageSquare className="size-3.5" />
            <span>সরাসরি চ্যাট</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('voice')}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === 'voice'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'text-purple-900 hover:bg-purple-200/60'
            }`}
          >
            <Mic className="size-3.5" />
            <span>ভয়েস সহকারী</span>
          </button>
        </div>
      </div>

      {/* MODE 1: DRAFT GENERATOR */}
      {mode === 'draft' && (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Situation Filters, Input Card, Result Card (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Scrollable Situation Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {situations.map((sit) => {
                const isSelected = selectedSituationId === sit.id;
                return (
                  <button
                    key={sit.id}
                    type="button"
                    onClick={() => handleSelectSituation(sit)}
                    className={`shrink-0 px-4 h-10 rounded-full text-[13px] font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-purple-700 text-white shadow-purple-200'
                        : 'glass text-slate-700 hover:bg-white/80 border border-slate-200'
                    }`}
                  >
                    <span>{sit.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Card */}
            <div className="glass rounded-3xl p-5 border border-purple-200/80 shadow-sm relative overflow-hidden space-y-4">
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-700" />

              <div className="space-y-4 pl-1">
                {/* Job Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700">
                    কোন কাজের জন্য?
                  </label>
                  <div className="relative">
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full bg-blue-50/70 border border-slate-200 text-ink rounded-xl h-12 px-4 text-[14px] font-bold appearance-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Textarea & Toolbar */}
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="কাজের বিবরণ আর আপনি যা বলতে চান — বাংলায় লিখলেও চলবে..."
                    className="w-full bg-purple-50/50 border border-slate-200 text-ink rounded-2xl p-4 text-[14.5px] font-medium resize-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none transition-colors"
                  />

                  <div className="flex justify-between items-center text-[12px] font-bold text-slate-400 px-1">
                    <span>{toBnDigits(promptText.length)}/৫০০</span>

                    {/* Length Chips */}
                    <div className="flex gap-1 bg-slate-200/60 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setLengthMode('short')}
                        className={`px-3 py-1 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer ${
                          lengthMode === 'short'
                            ? 'bg-white text-purple-700 shadow-2xs'
                            : 'text-slate-600 hover:text-ink'
                        }`}
                      >
                        সংক্ষিপ্ত
                      </button>
                      <button
                        type="button"
                        onClick={() => setLengthMode('detailed')}
                        className={`px-3 py-1 rounded-lg text-[12px] font-extrabold transition-all cursor-pointer ${
                          lengthMode === 'detailed'
                            ? 'bg-white text-purple-700 shadow-2xs'
                            : 'text-slate-600 hover:text-ink'
                        }`}
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generate Action Button */}
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingDraft}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-[15px] py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingDraft ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      <span>খসড়া জেনারেট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-5" />
                      <span>খসড়া তৈরি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Draft Result Card */}
            {draftResult && (
              <div className="glass rounded-3xl border border-purple-200 shadow-sm overflow-hidden space-y-0 animate-in fade-in duration-200">
                {/* Draft Content Area */}
                <div className="bg-purple-50/80 p-5 relative group border-b border-purple-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-extrabold text-purple-800 uppercase tracking-wider">
                      প্রস্তুতকৃত বার্তা খসড়া
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingDraft(!isEditingDraft)}
                        className="p-1.5 bg-white hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-xl transition-all cursor-pointer shadow-2xs"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyDraft(isEditingDraft ? editableDraftText : draftResult.text)}
                        className="p-1.5 bg-white hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-xl transition-all cursor-pointer shadow-2xs"
                        title="কপি করুন"
                      >
                        {copiedDraft ? (
                          <Check className="size-4 text-emerald-600 stroke-[3]" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isEditingDraft ? (
                    <textarea
                      rows={5}
                      value={editableDraftText}
                      onChange={(e) => setEditableDraftText(e.target.value)}
                      className="w-full p-3 bg-white border border-purple-300 rounded-xl text-[14px] font-medium text-ink focus:ring-1 focus:ring-purple-600 outline-none"
                    />
                  ) : (
                    <p className="text-[14px] font-medium text-ink leading-relaxed font-mono whitespace-pre-line">
                      {draftResult.text}
                    </p>
                  )}
                </div>

                {/* Explanation Breakdown Area */}
                <div className="p-5 space-y-4 font-bn">
                  <h3 className="text-[13.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                    কোন অংশ কী করছে
                  </h3>

                  <div className="space-y-2.5">
                    {draftResult.explanations.map((item) => (
                      <div key={item.num} className="flex gap-3 items-start">
                        <span className="size-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[12px] font-extrabold shrink-0 mt-0.5">
                          {toBnDigits(item.num)}
                        </span>
                        <p className="text-[13.5px] font-bold text-slate-700 leading-snug">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateDraft}
                      className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="size-4" />
                      <span>আবার লিখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyDraft(isEditingDraft ? editableDraftText : draftResult.text)}
                      className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="size-4 stroke-[3]" />
                          <span>কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleLinkDraftToJob}
                      disabled={linkingToJob}
                      className="text-purple-700 font-bold text-[13px] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <LinkIcon className="size-3.5" />
                      <span>{linkingToJob ? 'সংযুক্ত হচ্ছে...' : 'এই কাজের সাথে যুক্ত করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Column: AI Best Practices (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="glass p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3 bg-gradient-to-br from-purple-50/60 to-white">
              <h3 className="text-[15.5px] font-extrabold text-purple-950 flex items-center gap-2">
                <Zap className="size-4 text-purple-600 fill-current" />
                স্মার্ট কম্যুনিকেশন টিপস
              </h3>
              <ul className="text-[12.5px] text-purple-900 leading-relaxed space-y-2 font-medium">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  কখনোই অস্পষ্ট কথা বলবেন না — সময় ও বাজেট প্রথম মেসেজেই পরিষ্কার রাখুন।
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-600 font-bold">•</span>
                  বাংলায় প্রম্পট লিখলেও AI তা পেশাদার ইংরেজিতে রূপান্তরিত করে দিবে।
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: AI LIVE CHATTING (100% Dynamic & Functional) */}
      {mode === 'chat' && (
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="glass rounded-3xl border border-purple-200 shadow-sm p-4 sm:p-6 space-y-4">
            
            {/* Quick Prompt Suggestion Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setChatInput('ক্লায়েন্টকে আওয়ারলি রেট কিভাবে বলব?')}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[12px] font-bold transition-all cursor-pointer"
              >
                💡 ক্লায়েন্টকে আওয়ারলি রেট কিভাবে বলব?
              </button>
              <button
                type="button"
                onClick={() => setChatInput('কাজ দেরির সঠিক নোটিশ কিভাবে দেব?')}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[12px] font-bold transition-all cursor-pointer"
              >
                ⏱️ কাজ দেরির সঠিক নোটিশ কিভাবে দেব?
              </button>
              <button
                type="button"
                onClick={() => setChatInput('বকেয়া বিল আদায়ের সঠিক উপায় কি?')}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[12px] font-bold transition-all cursor-pointer"
              >
                💰 বকেয়া বিল আদায়ের সঠিক উপায় কি?
              </button>
            </div>

            {/* Live Message Feed Container */}
            <div className="min-h-[350px] max-h-[500px] overflow-y-auto space-y-3 p-2 font-bn">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-purple-700 text-white rounded-br-2xs shadow-2xs'
                        : 'bg-purple-50/90 border border-purple-200/80 text-ink rounded-bl-2xs'
                    }`}
                  >
                    <p className="text-[14px] font-medium leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>
                    <span
                      className={`text-[10px] font-semibold block text-right ${
                        msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="flex justify-start">
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex items-center gap-2 text-purple-800 text-[13px] font-bold">
                    <Loader2 className="size-4 animate-spin text-purple-700" />
                    <span>AI উত্তর তৈরি করছে...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVoiceOverlayOpen(true)}
                className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-2xl transition-all"
                title="ভয়েস সাহায্য"
              >
                <Mic className="size-5" />
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="আপনার প্রশ্ন বাংলায় লিখুন..."
                className="flex-1 bg-purple-50/40 border border-slate-300 rounded-2xl px-4 py-3 text-[14px] font-bold text-ink focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="px-5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[14px] flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MODE 3: PROFESSIONAL REALTIME WEBRTC VOICE ASSISTANT */}
      {mode === 'voice' && (
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          
          {/* Main Voice Visualizer Card */}
          <div className="glass rounded-3xl border border-purple-200 shadow-lg p-8 text-center space-y-6 font-bn bg-gradient-to-b from-purple-50/50 via-white to-white relative overflow-hidden">
            
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[12px] font-extrabold mb-2 border border-purple-200">
                <Volume2 className="size-3.5 text-purple-700 animate-bounce" />
                Easy Rise AI Voice Assistant
              </span>
              <h2 className="text-[22px] font-black text-ink">
                {voiceStatus === 'active'
                  ? 'আপনার কথা শুনছি...'
                  : voiceStatus === 'connecting'
                  ? 'সংযোগ স্থাপন করা হচ্ছে...'
                  : 'কথা বলে নির্দেশ দিন'}
              </h2>
              <p className="text-[13px] font-bold text-slate-500 mt-1">
                বাংলায় আপনার যেকোনো প্রস্তাবনা, বাজেট বা কাজের প্রশ্ন সরাসরি বলুন
              </p>
            </div>

            {/* Visualizer & Mic Button Container */}
            <div className="py-6 flex justify-center items-center relative h-52">
              {/* Rhythmic canvas spectrum visualizer */}
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className={`absolute inset-0 mx-auto h-52 w-52 transition-opacity duration-300 ${
                  voiceStatus === 'active' ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Pulsating Ring indicator when active */}
              {voiceStatus === 'active' && (
                <>
                  <div className="absolute size-36 bg-purple-400/30 rounded-full animate-ping pointer-events-none" />
                  <div className="absolute size-48 bg-purple-300/20 rounded-full animate-pulse pointer-events-none" />
                </>
              )}

              {/* Interactive Mic / Session Button */}
              <button
                type="button"
                onClick={() => {
                  if (voiceStatus === 'active' || voiceStatus === 'connecting') {
                    stopVoiceSession();
                  } else {
                    startVoiceSession();
                  }
                }}
                className={`relative z-10 size-24 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all cursor-pointer active:scale-95 ${
                  voiceStatus === 'active'
                    ? 'bg-emerald-600 ring-8 ring-emerald-200 shadow-emerald-300'
                    : voiceStatus === 'connecting'
                    ? 'bg-amber-600 ring-8 ring-amber-200 shadow-amber-300'
                    : 'bg-purple-700 hover:bg-purple-800 ring-8 ring-purple-100 shadow-purple-300'
                }`}
              >
                {voiceStatus === 'connecting' ? (
                  <Loader2 className="size-9 animate-spin text-white" />
                ) : (
                  <Mic className="size-9 stroke-[2.5]" />
                )}
                <span className="text-[10px] font-extrabold mt-1">
                  {voiceStatus === 'active'
                    ? 'সংযুক্ত'
                    : voiceStatus === 'connecting'
                    ? 'সংযোগ...'
                    : 'শুরু করুন'}
                </span>
              </button>
            </div>

            {/* Live active connection indicator badge */}
            {voiceStatus === 'active' && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-extrabold">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>লাইভ ভয়েস সংযোগ সক্রিয় — কথা বলুন</span>
              </div>
            )}

            {/* Error banner */}
            {voiceError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-[12.5px] font-bold rounded-2xl max-w-sm mx-auto">
                {voiceError}
              </div>
            )}

            {/* Audio Controls */}
            <div className="flex justify-center items-center gap-4 pt-2">
              <button
                type="button"
                onClick={toggleMuteVoiceSession}
                disabled={voiceStatus !== 'active'}
                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-[13px] font-bold ${
                  isMuted
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40'
                }`}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                <span>{isMuted ? 'আনমিউট' : 'মিউট'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVoiceOverlayOpen(true)}
                className="p-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200 transition-all flex items-center gap-2 text-[13px] font-bold"
              >
                <Radio className="size-4 text-purple-700" />
                <span>ফুলস্ক্রিন ভয়েস মোড</span>
              </button>

              {(voiceStatus === 'active' || voiceStatus === 'connecting') && (
                <button
                  type="button"
                  onClick={stopVoiceSession}
                  className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white transition-all flex items-center gap-2 text-[13px] font-bold"
                >
                  <X className="size-4" />
                  <span>বন্ধ করুন</span>
                </button>
              )}
            </div>



          </div>
        </div>
      )}

      {/* Fullscreen Voice Chat Overlay Modal */}
      <VoiceChatOverlay
        open={voiceOverlayOpen}
        onClose={() => setVoiceOverlayOpen(false)}
      />
    </div>
  );
}
