import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  BookOpen,
  Check,
  CheckSquare,
  ChevronRight,
  Edit2,
  Lock,
  Plus,
  Square,
  Trash2,
  Unlock,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import LearnerShell from '../../layouts/LearnerShell';
import { toBnDigits } from '../../lib/format';

export default function KidProfilesIndex({
  profiles = [],
  prophets = [],
  activeProfileId = null,
  isParentLoggedIn = true,
}) {
  const [editingProfile, setEditingProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    default_reader_mode: 'kid',
    unlocked_prophet_ids: [],
  });

  const openAddModal = () => {
    setEditingProfile(null);
    setData({
      name: '',
      default_reader_mode: 'kid',
      // By default unlock all prophets
      unlocked_prophet_ids: prophets.map((p) => p.id),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (profile) => {
    setEditingProfile(profile);
    setData({
      name: profile.name,
      default_reader_mode: profile.default_reader_mode || 'kid',
      unlocked_prophet_ids:
        profile.unlocked_prophet_ids && profile.unlocked_prophet_ids.length > 0
          ? profile.unlocked_prophet_ids.map(Number)
          : prophets.map((p) => p.id),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfile(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProfile) {
      put(`/kid-profiles/${editingProfile.id}`, {
        onSuccess: () => closeModal(),
      });
    } else {
      post('/kid-profiles', {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDelete = (profile) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${profile.name}"-এর প্রোফাইল মুছে ফেলতে চান?`)) {
      router.delete(`/kid-profiles/${profile.id}`);
    }
  };

  const handleSwitchContext = (profileId) => {
    router.post(
      '/kid-profiles/switch',
      { profile_id: profileId },
      {
        onSuccess: () => {
          router.visit('/library');
        },
      }
    );
  };

  const toggleProphet = (prophetId) => {
    const current = new Set(data.unlocked_prophet_ids);
    if (current.has(prophetId)) {
      current.delete(prophetId);
    } else {
      current.add(prophetId);
    }
    setData('unlocked_prophet_ids', Array.from(current));
  };

  const toggleAllProphets = () => {
    if (data.unlocked_prophet_ids.length === prophets.length) {
      setData('unlocked_prophet_ids', []);
    } else {
      setData('unlocked_prophet_ids', prophets.map((p) => p.id));
    }
  };

  return (
    <LearnerShell title="সন্তানের প্রোফাইল" showBack={true}>
      <Head title="সন্তানের প্রোফাইল — অভিভাবক নিয়ন্ত্রণ" />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[26px] sm:text-[30px] font-black tracking-tight text-ink">
            সন্তানের প্রোফাইল ও অভিভাবক নিয়ন্ত্রণ
          </h1>
          <p className="text-[14px] text-muted font-medium">
            সন্তানের উপযোগী গল্প বাছাই করুন এবং এক ক্লিকে তার জন্য নিরাপদ কিড মোড চালু করুন।
          </p>
        </div>

        {isParentLoggedIn && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[14px] font-bold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95 cursor-pointer"
          >
            <Plus className="size-4.5 stroke-[2.5]" />
            <span>নতুন সন্তান যোগ করুন</span>
          </button>
        )}
      </div>

      {!isParentLoggedIn ? (
        <div className="rounded-3xl border border-primary/20 bg-white/80 p-10 text-center shadow-xs">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            🔒
          </div>
          <h2 className="text-[18px] font-bold text-ink">অভিভাবক লগইন প্রয়োজন</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-muted">
            সন্তানের প্রোফাইল তৈরি ও গল্প নির্বাচন করতে অনুগ্রহ করে আপনার ফোন নম্বর দিয়ে লগইন করুন।
          </p>
          <div className="mt-5">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-bold text-white shadow-md"
            >
              লগইন করুন
            </Link>
          </div>
        </div>
      ) : profiles.length === 0 ? (
        /* Empty profiles state */
        <div className="rounded-3xl border border-dashed border-primary/25 bg-white/60 p-10 text-center sm:p-14">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-kid/15 text-3xl shadow-xs">
            🧒
          </div>
          <h2 className="text-[19px] font-bold text-ink">এখনো কোনো সন্তানের প্রোফাইল যোগ করা হয়নি</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-muted leading-relaxed">
            আপনার সন্তানের জন্য একটি প্রোফাইল তৈরি করুন। আপনি নির্ধারণ করতে পারবেন সে কোন কোন নবীর কাহিনী পড়তে পারবে।
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-kid px-5 py-3 text-[14px] font-bold text-white shadow-md shadow-kid/30 transition-all hover:bg-kid/90 active:scale-95 cursor-pointer"
            >
              <Plus className="size-5" />
              <span>প্রথম প্রোফাইল যোগ করুন</span>
            </button>
          </div>
        </div>
      ) : (
        /* Profiles list */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const isActive = activeProfileId === profile.id;
            const unlockedCount = profile.unlocked_prophet_ids?.length || 0;
            const isAllUnlocked = unlockedCount === 0 || unlockedCount === prophets.length;

            return (
              <div
                key={profile.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-white/85 p-5 shadow-xs transition-all ${
                  isActive
                    ? 'border-kid ring-2 ring-kid/30 shadow-md'
                    : 'border-primary/15 hover:border-primary/30'
                }`}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-kid px-3 py-1 text-[11.5px] font-bold text-white shadow-xs">
                    <UserCheck className="size-3.5" />
                    <span>বর্তমানে সক্রিয়</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-kid/15 text-3xl shadow-xs">
                      🧒
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-[18px] font-black text-ink">
                        {profile.name}
                      </h2>
                      <div className="flex items-center gap-1.5 text-[12.5px] text-muted font-medium">
                        <span>মোড:</span>
                        <span className="font-bold text-kid">কিড মোড (ডিফল্ট)</span>
                      </div>
                    </div>
                  </div>

                  {/* Unlocked status */}
                  <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 p-3 text-[12.5px]">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-muted">উন্মুক্ত গল্প:</span>
                      <span className="text-primary font-black">
                        {isAllUnlocked
                          ? 'সব গল্প উন্মুক্ত'
                          : `${toBnDigits(unlockedCount)}টি গল্প উন্মুক্ত`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 space-y-2 pt-3 border-t border-primary/10">
                  <button
                    type="button"
                    onClick={() => handleSwitchContext(profile.id)}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[13.5px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-kid text-white shadow-md shadow-kid/25 hover:bg-kid/90'
                        : 'border border-kid/30 bg-kid/10 text-kid hover:bg-kid hover:text-white'
                    }`}
                  >
                    <span>{isActive ? 'পড়া চালিয়ে যান' : 'এই প্রোফাইলে সুইচ করুন'}</span>
                    <ChevronRight className="size-4" />
                  </button>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(profile)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/15 bg-white/70 py-2 text-[12px] font-bold text-ink hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="size-3.5 text-secondary" />
                      <span>গল্প নির্বাচন / এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(profile)}
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-danger/20 text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-primary/15 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧒</span>
                <h3 className="text-[18px] font-black text-ink">
                  {editingProfile ? `${editingProfile.name}-এর প্রোফাইল সম্পাদনা` : 'নতুন সন্তানের প্রোফাইল'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-primary/10 hover:text-ink transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6 space-y-5">
              {/* Child Name Input */}
              <div>
                <label className="block text-[13px] font-bold text-ink mb-1.5">
                  সন্তানের নাম <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="যেমন: আয়ান, সারা..."
                  required
                  className="h-12 w-full rounded-2xl border border-primary/20 px-4 text-[15px] font-medium text-ink shadow-2xs outline-none focus:border-primary focus:ring-3 focus:ring-primary/10"
                />
                {errors.name && (
                  <p className="mt-1 text-[12px] font-semibold text-danger">{errors.name}</p>
                )}
              </div>

              {/* Default Mode Indicator */}
              <div className="rounded-2xl border border-kid/25 bg-kid/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-xl bg-kid text-white font-bold text-sm">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-[14px] font-bold text-kid">ডিফল্ট মোড: কিড মোড</h4>
                      <p className="text-[12px] text-muted">
                        সন্তানের প্রোফাইলে রিডার স্বয়ংক্রিয়ভাবে সহজ ভাষা ও বড় ছবিতে ওপেন হবে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prophet Checklist Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-[14px] font-bold text-ink">
                      অনুমোদিত গল্পের তালিকা
                    </h4>
                    <p className="text-[12px] text-muted">
                      যে যে নবীর গল্পে টিক চিহ্ন থাকবে, সন্তান শুধুমাত্র সেগুলো দেখতে পাবে।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAllProphets}
                    className="inline-flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-2.5 py-1 text-[12px] font-bold text-primary hover:bg-primary/15 transition-colors cursor-pointer"
                  >
                    {data.unlocked_prophet_ids.length === prophets.length ? (
                      <>
                        <Square className="size-3.5" />
                        <span>সব বাদ দিন</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="size-3.5" />
                        <span>সব নির্বাচন</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-2xl border border-primary/15 bg-white/70 p-2 divide-y divide-primary/10">
                  {prophets.map((prophet) => {
                    const isChecked = data.unlocked_prophet_ids.includes(prophet.id);
                    return (
                      <label
                        key={prophet.id}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleProphet(prophet.id)}
                            className="size-4.5 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                          />
                          <div>
                            <span className="text-[14px] font-bold text-ink">
                              {prophet.name}
                            </span>
                            {prophet.name_arabic && (
                              <span dir="rtl" className="ml-2 text-[13px] text-secondary">
                                {prophet.name_arabic}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11.5px] font-semibold text-muted">
                          {toBnDigits(prophet.chapter_count)}টি অধ্যায়
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-primary/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-primary/20 px-5 py-2.5 text-[14px] font-bold text-muted hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-2xl bg-primary px-6 py-2.5 text-[14px] font-bold text-white shadow-md shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {processing ? 'সংরক্ষণ হচ্ছে…' : editingProfile ? 'আপডেট করুন' : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LearnerShell>
  );
}
