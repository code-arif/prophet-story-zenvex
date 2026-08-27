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

    let phase = 0;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 56;

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const intensity = avg / 255;

      phase += 0.04 + intensity * 0.06;

      // Multi-layered Siri / AI Glowing Fluid Wave Rings
      const ringConfigs = [
        { color1: 'rgba(168, 85, 247, 0.9)', color2: 'rgba(59, 130, 246, 0.4)', speedMultiplier: 1, waveCount: 5, amplitude: 10 },
        { color1: 'rgba(236, 72, 153, 0.8)', color2: 'rgba(147, 51, 234, 0.35)', speedMultiplier: -1.2, waveCount: 4, amplitude: 14 },
        { color1: 'rgba(16, 185, 129, 0.9)', color2: 'rgba(99, 102, 241, 0.4)', speedMultiplier: 1.5, waveCount: 6, amplitude: 12 },
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
        ctx.shadowBlur = 12 + intensity * 15;
        ctx.stroke();
        ctx.restore();
      });
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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-purple-950/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-xl text-white p-6 font-bn animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/35 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl animate-pulse" />

      {/* Header info */}
      <div className="relative mb-8 max-w-sm text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-purple-200">
          <Mic className="size-3.5 animate-pulse text-purple-300" />
          <span>Easy Rise AI Voice</span>
        </div>
        <h3 className="text-2xl font-black text-white">
          {status === 'active'
            ? t('আপনার কথা শুনছি...')
            : status === 'connecting'
              ? t('সংযোগ স্থাপন করা হচ্ছে...')
              : t('ভয়েস অ্যাসিস্ট্যান্ট')}
        </h3>
        <p className="mt-2 text-xs text-purple-200/80 font-medium">
          {t('বাংলায় ফ্রিল্যান্সিং, প্রস্তাবনা বা কাজের পরামর্শ জিজ্ঞেস করুন')}
        </p>
      </div>

      {/* Visualizer container */}
      <div className="relative mb-8 flex h-52 w-52 items-center justify-center">
        {/* Rhythmic canvas visualizer */}
        <canvas
          ref={canvasRef}
          width={220}
          height={220}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${status === 'active' ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Central icon/status bubble */}
        <div
          className={`absolute inset-7 flex items-center justify-center rounded-full border bg-purple-900/80 shadow-2xl transition-all duration-500 ${
            status === 'active'
              ? 'scale-105 border-purple-400/60 shadow-[0_0_50px_rgba(168,85,247,0.4)]'
              : 'scale-100 border-purple-700/50'
          }`}
        >
          {status === 'connecting' ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-purple-400" />
          ) : (
            <Mic className={`size-9 ${status === 'active' ? 'text-purple-300' : 'text-purple-400/60'}`} />
          )}
        </div>
      </div>

      {/* Live indicator badge */}
      {status === 'active' && (
        <div className="mb-6 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3.5 py-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-300">
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
              : 'border-purple-600/40 bg-purple-900/60 text-purple-200 hover:bg-purple-800/80 hover:text-white disabled:opacity-30'
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
