import React from 'react';
import { Mic, Volume2, VolumeX, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';

const TOKEN_URL = '/ai/realtime/token';
const REALTIME_SDP_URL = 'https://api.openai.com/v1/realtime/calls?model=gpt-realtime';

/**
 * VoiceChatOverlay — fullscreen realtime voice assistant (OpenAI Realtime WebRTC),
 * exact same logic and flow as the Full Fit app.
 */
export function VoiceChatOverlay({ open, onClose, scenario = null, voiceName = 'coral' }) {
  const { t } = useI18n();
  const [status, setStatus] = React.useState('idle'); // idle | connecting | active | error
  const [isMuted, setIsMuted] = React.useState(false);
  const [voiceError, setVoiceError] = React.useState('');

  const peerConnection = React.useRef(null);
  const localStream = React.useRef(null);
  const audioEl = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const animFrameRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const sessionRef = React.useRef(0);

  const drawVisualizer = React.useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * 20;
        const angle = (i / bufferLength) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, '#7c3aed');
        gradient.addColorStop(1, '#2563eb');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };
    draw();
  }, []);

  const startChat = async () => {
    const sessionId = ++sessionRef.current;
    try {
      setStatus('connecting');
      setVoiceError('');
      setIsMuted(false);

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const tokenResponse = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ scenario: scenario || 'assistant' }),
      });

      if (tokenResponse.redirected || tokenResponse.status === 401 || tokenResponse.status === 302) {
        setVoiceError(t('এই সেবা ব্যবহারের জন্য লগইন করতে হবে।'));
        setStatus('error');
        return;
      }
      if (sessionId !== sessionRef.current) return;

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.client_secret?.value) {
        throw new Error(tokenData.error || t('Token পাওয়া যায়নি'));
      }
      if (sessionId !== sessionRef.current) return;

      const ephemeralKey = tokenData.client_secret.value;
      const voice = tokenData.voice || voiceName || 'coral';

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
      if (sessionId !== sessionRef.current) {
        ms.getTracks().forEach((track) => track.stop());
        return;
      }
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
      if (sessionId !== sessionRef.current) return;

      const sdpResponse = await fetch(REALTIME_SDP_URL, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        const err = await sdpResponse.json().catch(() => ({}));
        throw new Error(err.error?.message || t('সংযোগ ব্যর্থ হয়েছে'));
      }
      if (sessionId !== sessionRef.current) return;

      await pc.setRemoteDescription({
        type: 'answer',
        sdp: await sdpResponse.text(),
      });
      if (sessionId !== sessionRef.current) return;

      setStatus('active');
    } catch (err) {
      if (sessionId !== sessionRef.current) return;
      console.error('Voice Chat Error:', err);
      setVoiceError(err.message || t('ভয়েস চ্যাট সংযোগ করতে সমস্যা হয়েছে।'));
      setStatus('error');
    }
  };

  const stopChat = React.useCallback(() => {
    sessionRef.current++;
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
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
    setStatus((prev) => (prev === 'error' ? 'error' : 'idle'));
  }, []);

  const toggleMute = () => {
    if (localStream.current) {
      const track = localStream.current.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  React.useEffect(() => {
    if (open) {
      startChat();
    } else {
      stopChat();
    }
    return () => stopChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stopChat]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white p-6 font-bn animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

      {/* Header info */}
      <div className="relative mb-8 max-w-sm text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-purple-300">
          <Mic className="size-3.5 animate-pulse text-purple-400" />
          <span>Easy Rise AI Voice</span>
        </div>
        <h3 className="text-2xl font-black text-slate-100">
          {status === 'active'
            ? t('আপনার কথা শুনছি...')
            : status === 'connecting'
              ? t('সংযোগ স্থাপন করা হচ্ছে...')
              : t('ভয়েস অ্যাসিস্ট্যান্ট')}
        </h3>
        <p className="mt-2 text-xs text-slate-400">
          {t('বাংলায় ফ্রিল্যান্সিং, প্রস্তাবনা বা কাজের পরামর্শ জিজ্ঞেস করুন')}
        </p>
      </div>

      {/* Visualizer container */}
      <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
        {/* Rhythmic canvas visualizer */}
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${status === 'active' ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Central icon/status bubble */}
        <div
          className={`absolute inset-6 flex items-center justify-center rounded-full border bg-slate-900 shadow-2xl transition-all duration-500 ${
            status === 'active'
              ? 'scale-105 border-purple-500/40 shadow-[0_0_40px_rgba(147,51,234,0.3)]'
              : 'scale-100 border-slate-800'
          }`}
        >
          {status === 'connecting' ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-purple-500" />
          ) : (
            <Mic className={`size-9 ${status === 'active' ? 'text-purple-400' : 'text-slate-500'}`} />
          )}
        </div>
      </div>

      {/* Live indicator badge */}
      {status === 'active' && (
        <div className="mb-6 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-400">
            {t('লাইভ সংযোগ সক্রিয়')}
          </span>
        </div>
      )}

      {/* Error message */}
      {voiceError && (
        <div className="mb-6 max-w-xs rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-center text-xs font-semibold text-red-400">
          {voiceError}
        </div>
      )}

      {/* Control buttons */}
      <div className="relative flex items-center gap-6">
        {/* Mute button */}
        <button
          type="button"
          onClick={toggleMute}
          disabled={status !== 'active'}
          className={`flex size-12 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95 ${
            isMuted
              ? 'border-rose-500/30 bg-rose-500/20 text-rose-400'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30'
          }`}
          title={isMuted ? t('আনমিউট করুন') : t('মিউট করুন')}
        >
          {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>

        {/* End session / close button */}
        <button
          type="button"
          onClick={() => {
            stopChat();
            onClose();
          }}
          className="flex size-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg transition-all hover:bg-rose-700 active:scale-95"
          title={t('বন্ধ করুন')}
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  );
}
