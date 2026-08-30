import React, { useState } from 'react';
import { useForm, usePage, Head, Link, router } from '@inertiajs/react';
import { 
  Wrench, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Play, 
  XCircle, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  User, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  TrendingUp,
  Briefcase,
  AlertCircle,
  ThumbsUp,
  Send,
  Plus
} from 'lucide-react';
import SendQuoteModal from '@/Components/SendQuoteModal';

export default function Dashboard({ 
  provider, 
  pendingRequests = [], 
  activeJobs = [], 
  completedJobs = [], 
  monthlyEarnings = 0, 
  completedThisMonthCount = 0 
}) {
  const { flash = {} } = usePage().props;
  const [activeTab, setActiveTab] = useState('new'); // 'new', 'active', 'completed'
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState(null);

  const [isAvailable, setIsAvailable] = useState(provider?.is_available_now ?? true);

  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    router.post(route('provider.toggle-availability'), {
      is_available_now: nextState,
    }, { preserveScroll: true });
  };

  const handleUpdateStatus = (requestId, newStatus) => {
    if (confirm(`আপনি কি স্ট্যাটাস '${newStatus}' এ পরিবর্তন করতে চান?`)) {
      router.post(route('service-requests.update-status', requestId), {
        status: newStatus,
      }, { preserveScroll: true });
    }
  };

  return (
    <>
      <Head title="প্রোভাইডার অপারেশনাল ড্যাশবোর্ড — Mistri Call" />

      <div className="min-h-screen bg-[#F7F8FA] text-[#37474F] font-sans pb-24">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#37474F] text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFC300] text-[#37474F] font-black text-xl flex items-center justify-center shadow-md">
                {provider.user?.name ? provider.user.name.charAt(0).toUpperCase() : <Wrench className="w-6 h-6" />}
              </div>
              <div>
                <h1 className="text-base font-bold flex items-center gap-1.5">
                  {provider.user?.name}
                  {provider.verification_status === 'verified' && (
                    <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                  )}
                </h1>
                <p className="text-xs text-white/70">প্রোভাইডার ড্যাশবোর্ড & জবস</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Emergency Availability Toggle Switch */}
              <button
                onClick={handleToggleAvailability}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isAvailable
                    ? 'bg-[#00B894] text-white'
                    : 'bg-slate-600 text-white/80 hover:bg-slate-500'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
                <span>{isAvailable ? 'এখন এভেইলএবল' : 'সার্ভিস বন্ধ'}</span>
              </button>

              <Link
                href={route('provider.schedule.index')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white"
                title="শিডিউল ম্যানেজার"
              >
                <Calendar className="w-4 h-4 text-[#FFC300]" />
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
          {flash.success && (
            <div className="p-4 rounded-2xl bg-[#00B894]/15 border border-[#00B894]/30 text-[#00B894] font-medium flex items-center gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{flash.success}</span>
            </div>
          )}

          {/* Monthly Earnings Analytics Banner */}
          <div className="bg-gradient-to-r from-[#37474F] via-[#2c383f] to-[#1f282d] text-white rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 relative z-10">
              <span className="text-xs font-bold text-[#FFC300] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> চলতি মাসের অর্জিত আয় (This Month's Earnings)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#FFC300]">
                  ৳{Number(monthlyEarnings).toLocaleString()}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  ({completedThisMonthCount} টি সম্পন্ন কাজ থেকে)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] text-white/70 block">সক্রিয় আদেশ</span>
                <span className="text-base font-bold text-white">{activeJobs.length} টি</span>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center flex-1 sm:flex-initial">
                <span className="text-[10px] text-white/70 block">প্রাইস ফেয়ারনেস</span>
                <span className="text-base font-bold text-[#00B894]">
                  👍 {provider.price_fairness_score ?? 100}%
                </span>
              </div>
            </div>
          </div>

          {/* 3 Interactive Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-[#37474F] text-[#FFC300] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>নতুন রিকোয়েস্ট</span>
              {pendingRequests.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF6F3C] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#37474F] text-[#FFC300] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>চলতি কাজ</span>
              {activeJobs.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#00B894] text-white text-[10px] font-black flex items-center justify-center">
                  {activeJobs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-[#37474F] text-[#FFC300] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>সম্পন্ন ({completedJobs.length})</span>
            </button>
          </div>

          {/* TAB 1: New Incoming Requests */}
          {activeTab === 'new' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#37474F]">নতুন কোনো ইনকামিং রিকোয়েস্ট নেই</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    আপনার নির্বাচিত ক্যাটাগরির নতুন কোনো সার্ভিস রিকোয়েস্ট আসলে এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              ) : (
                pendingRequests.map((req) => {
                  const customerUser = req.customer || {};
                  const category = req.category || {};

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl border-2 border-[#FFC300] p-5 shadow-md space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#37474F] text-[#FFC300]">
                            {category.name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {req.request_mode === 'broadcast' ? '📢 ওপেন ব্রডকাস্ট' : '🎯 সরাসরি রিকোয়েস্ট'}
                          </span>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          req.urgency === 'emergency_now'
                            ? 'bg-[#FF6F3C]/15 text-[#FF6F3C] border border-[#FF6F3C]/30 animate-pulse'
                            : 'bg-amber-500/15 text-amber-700'
                        }`}>
                          {req.urgency === 'emergency_now' ? '🔥 ইমার্জেন্সি' : '⚡ আজকের মধ্যে'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#37474F] flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" /> কাস্টমার: {customerUser.name}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6F3C]" /> {req.district || 'ঢাকা'}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                          {req.description}
                        </p>
                      </div>

                      {/* Action Buttons: Accept / Decline / Send Quote */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setSelectedRequestForQuote(req)}
                          className="flex-1 py-2.5 px-4 rounded-xl border border-[#37474F] text-[#37474F] font-bold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <DollarSign className="w-4 h-4 text-[#FFC300]" />
                          <span>কোটেশন পাঠান</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(req.id, 'declined')}
                          className="py-2.5 px-4 rounded-xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer"
                        >
                          প্রত্যাখ্যান
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(req.id, 'accepted')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-[#00B894] hover:bg-[#009678] text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>সরাসরি গ্রহণ করুন</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Active Jobs */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeJobs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Play className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#37474F]">বর্তমানে কোনো সক্রিয় কাজ নেই</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    নতুন রিকোয়েস্ট গ্রহণ করলে আপনার চলতি কাজগুলোর লিস্ট এখানে প্রদর্শিত হবে।
                  </p>
                </div>
              ) : (
                activeJobs.map((job) => {
                  const customerUser = job.customer || {};
                  const category = job.category || {};

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#37474F] text-[#FFC300]">
                          {category.name}
                        </span>

                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#00B894]/15 text-[#00B894] border border-[#00B894]/30">
                          {job.status === 'accepted' ? 'কনফার্মড' : job.status === 'en_route' ? 'অন রুট' : 'কাজ চলছে'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#37474F]">কাস্টমার: {customerUser.name}</span>
                          <span className="text-slate-500">{job.district}</span>
                        </div>

                        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          {job.description}
                        </p>
                      </div>

                      {/* Job Lifecycle Advancement Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <Link
                          href={route('service-requests.chat', job.id)}
                          className="py-2.5 px-4 rounded-xl bg-[#37474F] hover:bg-[#253137] text-white font-bold text-xs transition flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-4 h-4 text-[#FFC300]" />
                          <span>চ্যাট খুলুন</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          {job.status === 'accepted' && (
                            <button
                              onClick={() => handleUpdateStatus(job.id, 'en_route')}
                              className="py-2.5 px-4 rounded-xl bg-[#00B894] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>অন রুট</span>
                            </button>
                          )}

                          {job.status === 'en_route' && (
                            <button
                              onClick={() => handleUpdateStatus(job.id, 'in_progress')}
                              className="py-2.5 px-4 rounded-xl bg-[#00B894] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>কাজ শুরু</span>
                            </button>
                          )}

                          {job.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateStatus(job.id, 'completed')}
                              className="py-2.5 px-4 rounded-xl bg-[#00B894] text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>কাজ সম্পন্ন</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: Completed Jobs History */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedJobs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#37474F]">কোনো সম্পন্ন কাজের হিস্ট্রি নেই</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    কাজ সফলভাবে সম্পন্ন হলে সেটির হিস্ট্রি ও কাস্টমার রিভিউ এখানে সংরক্ষিত হবে।
                  </p>
                </div>
              ) : (
                completedJobs.map((job) => {
                  const customerUser = job.customer || {};
                  const category = job.category || {};
                  const acceptedQuote = job.service_quotes ? job.service_quotes.find(q => q.status === 'accepted') : null;
                  const earning = acceptedQuote ? acceptedQuote.estimated_total : (provider.visit_charge || 150);

                  return (
                    <div
                      key={job.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                        <span className="font-bold text-[#37474F]">{category.name}</span>
                        <span className="font-black text-[#00B894] text-sm">৳{Number(earning).toLocaleString()}</span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-semibold text-slate-800">কাস্টমার: {customerUser.name}</p>
                        <p className="text-slate-600 line-clamp-1">{job.description}</p>
                      </div>

                      {/* Customer Review display if submitted */}
                      {job.review && (
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1 text-[#37474F]">
                              <Star className="w-3.5 h-3.5 fill-[#FFC300] text-[#FFC300]" />
                              {job.review.rating}.0/5.0
                            </span>
                            <span className="text-[11px] text-[#00B894] font-semibold">
                              প্রাইস: {job.review.price_fairness}
                            </span>
                          </div>
                          {job.review.comment && (
                            <p className="text-slate-600 italic">"{job.review.comment}"</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal for Provider to Send Quote */}
        {selectedRequestForQuote && (
          <SendQuoteModal
            serviceRequest={selectedRequestForQuote}
            onClose={() => setSelectedRequestForQuote(null)}
          />
        )}
      </div>
    </>
  );
}
