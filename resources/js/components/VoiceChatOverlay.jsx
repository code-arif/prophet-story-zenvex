import React from 'react';
import { Mic, Volume2, VolumeX, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { SegmentedControl } from './SegmentedControl';

const TOKEN_URL = '/ai/realtime/token';
// OpenAI Realtime WebRTC SDP endpoint (same flow as the Full Fit voice chat).
const REALTIME_SDP_URL = 'https://api.openai.com/v1/realtime/calls?model=gpt-realtime';

/**
 * VoiceChatOverlay — fullscreen realtime voice assistant (OpenAI Realtime
 * WebRTC), the same UI & flow as the Full Fit app. The ephemeral token comes
 * from POST /ai/realtime/token (the API key stays server-side) and the system
 * prompt is pinned server-side, made scenario-aware via the `scenario` prop.
 */
export function VoiceChatOverlay({ open, onClose, scenario = null, voiceName = 'coral', voiceLevel = 'beginner' }) {
  const { t } = useI18n();
  const [status, setStatus] = React.useState('idle'); // idle | connecting | active | error
  const [isMuted, setIsMuted] = React.useState(false);
  const [voiceError, setVoiceError] = React.useState('');
  const [level, setLevel] = React.useState(voiceLevel); // beginner | intermediate
  const levelRef = React.useRef(voiceLevel);

  const peerConnection = React.useRef(null);
  const localStream = React.useRef(null);
  const audioEl = React.useRef(null);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const animFrameRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  // Monotonic session counter — stopChat() bumps it so any in-flight async
  // startChat (StrictMode double-mount, rapid open/close) can detect it was
  // superseded and abandon its connection instead of leaking it.
  const sessionRef = React.useRef(0);
  const openRef = React.useRef(open);

  React.useEffect(() => {
    openRef.current = open;
  }, [open]);

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
        gradient.addColorStop(0, '#a78bfa');
        gradient.addColorStop(1, '#6d28d9');

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
      // A fresh session starts with a live (unmuted) mic track — always
      // resync the muted flag so a level-change restart can't leave the UI
      // showing 'muted' while the new track is actually unmuted.
      setIsMuted(false);

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const tokenResponse = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ scenario: scenario?.slug || 'open-chat', level: levelRef.current }),
      });

      // Guest requests get redirected to /login — surface a friendly message.
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
          // Voice can't be set on the token-request session (API rejects it) —
          // it must be applied here on the data channel, like the Full Fit app.
          // session.type is required by the current API ('Missing required
          // parameter: session.type' otherwise).
          session: { type: 'realtime', voice: voiceName, temperature: 0.7, modalities: ['text', 'audio'] },
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
      if (sessionId !== sessionRef.current) return; // superseded — drop quietly
      console.error('Voice Chat Error:', err);
      setVoiceError(err.message || t('ভয়েস চ্যাট সংযোগ করতে সমস্যা হয়েছে।'));
      setStatus('error');
    }
  };

  const stopChat = React.useCallback(() => {
    sessionRef.current++; // invalidate any in-flight startChat
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

  // Switch the speaking level. The level is baked into the session when the
  // token is minted, so an open session is restarted to pick up the new level.
  // levelRef is updated synchronously so the (re-)started session always sends
  // the freshly selected level, even through the delayed restart closure.
  const changeLevel = (next) => {
    if (next === level) return;
    levelRef.current = next;
    setLevel(next);
    if (status === 'active' || status === 'connecting') {
      stopChat();
      setTimeout(() => {
        if (openRef.current) startChat();
      }, 300);
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
    <div className="fixed inset-0 z-[60] flex max-h-dvh flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-learn-ai-tint via-learn-bg to-learn-bg p-6 animate-fade-in">
      {/* Decorative blurred violet orbs (learn theme) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-learn-ai/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-learn-ai/10 blur-3xl" />

      {/* Header info */}
      <div className="relative mb-8 max-w-sm text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-learn-ai/20 bg-learn-ai-tint px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-learn-ai">
          <Mic className="size-3.5 animate-pulse" />
          <span>Learn English AI Voice</span>
        </div>
        <h3 className="font-learn-bn text-xl font-bold text-learn-ink">
          {status === 'active'
            ? t('আপনার কথা শুনছি...')
            : status === 'connecting'
              ? t('সংযোগ স্থাপন করা হচ্ছে...')
              : t('ভয়েস অ্যাসিস্ট্যান্ট')}
        </h3>
        <p className="font-learn-bn mt-2 text-xs text-learn-muted">
          {t('বাংলা বা ইংরেজিতে কথা বলুন — AI সঙ্গী শুনে উত্তর দেবে কণ্ঠে')}
        </p>

        {/* Speaking level toggle */}
        <div className="mx-auto mt-5 w-64">
          <SegmentedControl
            tone="ai"
            value={level}
            onChange={changeLevel}
            options={[
              { label: t('নতুন'), value: 'beginner' },
              { label: t('মাঝারি'), value: 'intermediate' },
            ]}
          />
        </div>
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
          className={`absolute inset-6 flex items-center justify-center rounded-full border bg-white shadow-[0_8px_30px_rgba(124,107,245,0.12)] transition-all duration-500 ${
            status === 'active'
              ? 'scale-105 border-learn-ai/40 shadow-[0_0_40px_rgba(124,107,245,0.28)]'
              : 'scale-100 border-learn-border'
          }`}
        >
          {status === 'connecting' ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-learn-ai" />
          ) : (
            <Mic className={`size-8 ${status === 'active' ? 'text-learn-ai' : 'text-learn-disabled'}`} />
          )}
        </div>
      </div>

      {/* Live indicator badge */}
      {status === 'active' && (
        <div className="mb-6 flex items-center gap-1.5 rounded-full border border-learn-success/25 bg-learn-success-tint px-3 py-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-learn-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-learn-success" />
          </span>
          <span className="font-learn-bn text-[10px] font-extrabold uppercase tracking-wide text-learn-success">
            {t('লাইভ সংযোগ সক্রিয়')}
          </span>
        </div>
      )}

      {/* Error message */}
      {voiceError && (
        <div className="font-learn-bn mb-6 max-w-xs rounded-xl border border-learn-danger/20 bg-learn-danger-tint px-4 py-2.5 text-center text-xs font-semibold text-learn-danger">
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
              ? 'border-learn-danger/30 bg-learn-danger-tint text-learn-danger'
              : 'border-learn-border bg-white text-learn-muted hover:border-learn-ai/40 hover:text-learn-ai disabled:opacity-40'
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
          className="flex size-14 items-center justify-center rounded-full bg-learn-ai text-white shadow-[0_10px_30px_rgba(124,107,245,0.4)] transition-all hover:bg-learn-ai/90 active:scale-95"
          title={t('বন্ধ করুন')}
        >
          <X className="size-6" />
        </button>
      </div>
    </div>
  );
}
