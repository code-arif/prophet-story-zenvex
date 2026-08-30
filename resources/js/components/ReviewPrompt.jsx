import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Star, ThumbsUp, AlertTriangle, AlertCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ReviewPrompt({ serviceRequestId, onReviewSubmitted }) {
  const { data, setData, post, processing, errors } = useForm({
    service_request_id: serviceRequestId,
    rating: 5,
    price_fairness: 'fair',
    comment: '',
  });

  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('service-reviews.store'), {
      preserveScroll: true,
      onSuccess: () => onReviewSubmitted && onReviewSubmitted(),
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#FFC300] p-6 shadow-lg space-y-5 relative overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Star className="w-5 h-5 fill-[#FFC300] text-[#FFC300]" />
        <h3 className="text-base font-extrabold text-[#37474F]">
          কাজের মান ও প্রাইস ফেয়ারনেস রেটিং দিন (Review & Rating)
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
        {/* Interactive 5-Star Rating */}
        <div className="space-y-2 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            সামগ্রিক কাজের মান (Overall Service Rating)
          </label>
          <div className="flex items-center justify-center gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setData('rating', star)}
                className="p-1 transition transform active:scale-125 focus:outline-none cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                    (hoverRating || data.rating) >= star
                      ? 'fill-[#FFC300] text-[#FFC300] drop-shadow-xs'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-[#37474F] block">
            {data.rating === 5 ? 'অসাধারণ (5.0)' : data.rating === 4 ? 'খুব ভালো (4.0)' : data.rating === 3 ? 'মোটামুটি (3.0)' : data.rating === 2 ? 'খারাপ (2.0)' : 'খুবই বাজে (1.0)'}
          </span>
        </div>

        {/* Price Fairness Signal Chips */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            মূল্য ও খরচের সঠিকতা (Price Fairness Signal)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Fair */}
            <button
              type="button"
              onClick={() => setData('price_fairness', 'fair')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                data.price_fairness === 'fair'
                  ? 'bg-[#00B894] text-white border-[#00B894] shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${data.price_fairness === 'fair' ? 'text-white' : 'text-[#00B894]'}`} />
              <span className="text-xs">ন্যায্য মূল্য (Fair)</span>
            </button>

            {/* Slightly High */}
            <button
              type="button"
              onClick={() => setData('price_fairness', 'slightly_high')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                data.price_fairness === 'slightly_high'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${data.price_fairness === 'slightly_high' ? 'text-white' : 'text-amber-500'}`} />
              <span className="text-xs">সামান্য বেশি (Slightly High)</span>
            </button>

            {/* Overpriced */}
            <button
              type="button"
              onClick={() => setData('price_fairness', 'overpriced')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                data.price_fairness === 'overpriced'
                  ? 'bg-[#FF6F3C] text-white border-[#FF6F3C] shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${data.price_fairness === 'overpriced' ? 'text-white' : 'text-[#FF6F3C]'}`} />
              <span className="text-xs">অতিরিক্ত দাম (Overpriced)</span>
            </button>
          </div>
          {errors.price_fairness && <p className="text-xs text-red-500">{errors.price_fairness}</p>}
        </div>

        {/* Comment Box */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            কাজের অভিজ্ঞতা নিয়ে অতিরিক্ত মন্তব্য (Optional)
          </label>
          <textarea
            rows={3}
            value={data.comment}
            onChange={(e) => setData('comment', e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#37474F] outline-none"
            placeholder="মিস্ত্রি সময়মতো এসেছিলেন কি না, কাজের মান কেমন ছিল লিখুন..."
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#FFC300] hover:bg-[#e6b000] text-[#37474F] font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{processing ? 'জমা দেওয়া হচ্ছে...' : 'রিভিউ ও রেটিং জমা দিন'}</span>
        </button>
      </form>
    </div>
  );
}
