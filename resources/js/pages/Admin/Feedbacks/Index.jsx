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
            <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              ব্যবহারকারীদের মতামত (User Feedbacks)
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              ইউজারদের পাঠানো রিভিউ, মতামত ও পরামর্শসমূহ
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm text-[hsl(var(--card-foreground))]">
          <div className="divide-y divide-[hsl(var(--border))]">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[hsl(var(--muted))/0.3] transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-[hsl(var(--foreground))] text-base">
                      {item.name || 'User'}
                    </span>
                    {item.contact && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[hsl(var(--muted))/0.6] text-[hsl(var(--muted-foreground))] text-xs font-semibold">
                        {item.contact}
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'reviewed'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
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
                            : 'text-[hsl(var(--muted-foreground))/0.3]'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-[hsl(var(--muted-foreground))] font-bold ml-1">
                      ({item.rating}/5)
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-[hsl(var(--foreground))] text-sm font-medium leading-relaxed bg-[hsl(var(--muted))/0.4] p-3 rounded-xl border border-[hsl(var(--border))]">
                    "{item.message}"
                  </p>

                  <span className="text-xs text-[hsl(var(--muted-foreground))] block">
                    তারিখ: {new Date(item.created_at).toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      item.status === 'reviewed'
                        ? 'bg-[hsl(var(--muted))/0.6] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle className="size-3.5" />
                    <span>{item.status === 'reviewed' ? 'নতুন চিহ্নিত করুন' : 'রিভিউ করা হয়েছে'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {feedbackList.length === 0 && (
              <div className="p-12 text-center text-[hsl(var(--muted-foreground))] font-bold space-y-2">
                <MessageSquare className="size-10 mx-auto text-[hsl(var(--muted-foreground))/0.4]" />
                <p>এখনো কোনো ব্যবহারকারী মতামত দেননি।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
