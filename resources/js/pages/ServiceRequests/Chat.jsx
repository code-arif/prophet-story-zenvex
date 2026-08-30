import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { 
  Send, 
  ChevronLeft, 
  User, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function Chat({ serviceRequest, conversation, messages = [], currentUser }) {
  const [messageBody, setMessageBody] = useState('');
  const messagesEndRef = useRef(null);

  const customer = serviceRequest?.customer || {};
  const provider = serviceRequest?.provider?.user || {};
  const category = serviceRequest?.category || {};

  const isCustomer = currentUser?.id === serviceRequest?.customer_id;
  const otherPartyName = isCustomer ? provider.name || 'মিস্ত্রি' : customer.name || 'কাস্টমার';

  const { data, setData, post, processing, reset } = useForm({
    body: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!data.body.trim()) return;

    post(route('service-requests.messages.store', serviceRequest.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset('body');
        scrollToBottom();
      },
    });
  };

  return (
    <>
      <Head title={`চ্যাট: ${otherPartyName} — Mistri Call`} />

      <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
        {/* Sticky Chat Top Bar */}
        <header className="sticky top-0 z-30 bg-[#37474F] text-white shadow-md">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={route('providers.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFC300] text-[#37474F] font-bold flex items-center justify-center">
                  {otherPartyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-sm font-bold flex items-center gap-1.5">
                    {otherPartyName}
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/15 text-[#FFC300]">
                      {category.name || 'সার্ভিস'}
                    </span>
                  </h1>
                  <p className="text-[11px] text-white/70 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00B894] inline-block animate-pulse"></span>
                    কাজের চ্যাট সমন্বয়
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00B894]/20 text-[#00B894] border border-[#00B894]/30">
                {serviceRequest.status === 'accepted' ? 'গৃহীত কাজ' : serviceRequest.status}
              </span>
            </div>
          </div>
        </header>

        {/* Job Summary Banner */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 text-xs text-slate-600 shadow-2xs">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Wrench className="w-4 h-4 text-[#FFC300] shrink-0" />
              <span className="truncate font-medium">{serviceRequest.description}</span>
            </div>
            <span className="font-bold text-[#37474F] bg-slate-100 px-2 py-0.5 rounded shrink-0">
              {serviceRequest.district || 'ঢাকা'}
            </span>
          </div>
        </div>

        {/* Chat Messages Body */}
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 overflow-y-auto space-y-4 pb-28">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white rounded-3xl border border-slate-200 p-8 my-4">
              <div className="w-12 h-12 rounded-full bg-[#FFC300]/20 text-[#37474F] flex items-center justify-center mx-auto">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#37474F]">চ্যাট শুরু করুন</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                কাজের সময়সূচী, ঠিকানা ও বিশেষ কোনো নির্দেশনা থাকলে এখানে মেসেজে লিখুন
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser.id;
              const senderName = isMe ? 'আপনি' : msg.sender?.name || otherPartyName;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold px-1">
                    {senderName} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-[#37474F] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Fixed Message Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={data.body}
              onChange={(e) => setData('body', e.target.value)}
              placeholder="মেসেজ লিখুন..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#37474F] outline-none bg-slate-50 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={processing || !data.body.trim()}
              className="py-3 px-5 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
