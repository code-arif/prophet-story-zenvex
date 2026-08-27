import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminShell from '../../../layouts/AdminShell';
import { Star, Trash2, CheckCircle, MessageSquare } from 'lucide-react';

export default function AdminFeedbacksIndex({ feedbacks }) {
  const feedbackList = feedbacks?.data || [];

  const handleToggleStatus = (id) => {
    router.post(`/admin/feedbacks/${id}/toggle-status`, {}, { preserveScroll: true });
  };

  const handleDelete = (id) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই মতামতটি মুছে ফেলতে চান?')) {
      router.delete(`/admin/feedbacks/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminShell title="User Feedbacks & Opinions">
      <Head title="User Feedbacks - Admin" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ব্যবহারকারীদের মতামত (User Feedbacks)</h1>
            <p className="text-sm text-slate-500 mt-1">
              ইউজারদের পাঠানো রিভিউ, মতামত ও পরামর্শসমূহ
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-200">
            {feedbackList.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-base">{item.name || 'User'}</span>
                    {item.contact && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {item.contact}
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'reviewed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status === 'reviewed' ? 'রিভিউ করা হয়েছে' : 'নতুন'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= (item.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-400 font-bold ml-1">
                      ({item.rating}/5)
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-slate-800 text-sm font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    "{item.message}"
                  </p>

                  <span className="text-xs text-slate-400 block">
                    তারিখ: {new Date(item.created_at).toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      item.status === 'reviewed'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle className="size-3.5" />
                    <span>{item.status === 'reviewed' ? 'নতুন চিহ্নিত করুন' : 'রিভিউ করা হয়েছে'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {feedbackList.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-bold space-y-2">
                <MessageSquare className="size-10 mx-auto text-slate-300" />
                <p>এখনো কোনো ব্যবহারকারী মতামত দেননি।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
