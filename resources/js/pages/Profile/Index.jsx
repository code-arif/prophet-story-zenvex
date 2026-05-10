import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import AppShell from '../../layouts/AppShell';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Download, Package, Smartphone, Shield, Zap } from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';

export default function ProfileIndex({ subscriber: subscriberProp, brandName, logoUrl, apk }) {
  const { auth, subscriber, flash } = usePage().props;
  const effectiveSubscriber = subscriberProp ?? subscriber;
  const form = useForm({
    name: effectiveSubscriber?.name || '',
    dob: effectiveSubscriber?.dob || '',
    avatar: null,
  });

  const unsubscribeForm = useForm({});
  const subscribeForm = useForm({});
  const logoutForm = useForm({});

  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState(null);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = React.useState(false);

  // Check for manual unsubscribe instruction
  React.useEffect(() => {
    if (flash?.unsubscribe_manual) {
      setShowUnsubscribeModal(true);
    }
  }, [flash?.unsubscribe_manual]);

  React.useEffect(() => {
    if (!form.data.avatar) {
      setAvatarPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.data.avatar);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.data.avatar]);

  const currentAvatarUrl = avatarPreviewUrl ?? effectiveSubscriber?.avatar_url ?? null;

  return (
    <AppShell title="Profile">
      <Head title="Profile" />

      <div className="grid grid-cols-1 gap-6">
        <div className='flex flex-col gap-4'>
          <div className="text-lg font-semibold">Profile Settings</div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.post('/profile', {
                forceFormData: true,
              });
            }}
            className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]"
          >
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Phone</div>
            <div className="mb-4 text-base font-semibold">{auth?.msisdn}</div>

            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]">
                {currentAvatarUrl ? (
                  <img src={currentAvatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[hsl(var(--muted-foreground))]">
                      <img alt="Profile" className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high shadow-[0px_24px_48px_rgba(0,0,0,0.4)]w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJZsLuk6HKRt12eOiqo6Kz2emjVWbl9xlJbquwmCWyJKNpgJxotD_RXP8G0rZPzdSfnms-RPgedMILeksQ453zUExrHQB6C_KhF40cjVjlN7GCJB3stkCGclRTYuRYegfeztCtfLbZN5eLMZEYFfl73jjZ7YyyfLzo1HCkZuOUmPgJwiKsHdhxLLe-W6B0F2-un4Ltl6HH-LD2IKTEe2tpUfFdSEdt34vzqensvOUFF8upTSfaoTg6naTZFaWuu3V_g7WFQGVQd60B" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium">Profile image</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">PNG/JPG up to 2MB</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-[hsl(var(--muted-foreground))]">Name</label>
                <Input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                {form.errors.name ? <div className="mt-1 text-sm text-red-400">{form.errors.name}</div> : null}
              </div>

              <div>
                <label className="mb-1 block text-sm text-[hsl(var(--muted-foreground))]">Date of birth</label>
                <Input type="date" value={form.data.dob || ''} onChange={(e) => form.setData('dob', e.target.value)} />
                {form.errors.dob ? <div className="mt-1 text-sm text-red-400">{form.errors.dob}</div> : null}
              </div>

              <div>
                <label className="mb-1 block text-sm text-[hsl(var(--muted-foreground))]">Profile image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => form.setData('avatar', e.target.files?.[0] ?? null)}
                  className="block w-full rounded-2xl bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] ring-1 ring-[hsl(var(--border))]"
                />
                {form.errors.avatar ? <div className="mt-1 text-sm text-red-400">{form.errors.avatar}</div> : null}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button type="submit" className="flex-1" disabled={form.processing}>
                Save
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {!auth?.msisdn ? (
              <div className="rounded-2xl bg-[hsl(var(--muted))] px-4 py-3 text-center text-sm text-[hsl(var(--muted-foreground))]">
                Identify your phone above to continue.
              </div>
            ) : (
              <>
                {effectiveSubscriber && effectiveSubscriber.is_active ? (
                  <>
                    <div className="rounded-2xl bg-[hsl(var(--muted))] px-4 py-3 text-center text-sm text-[hsl(var(--muted-foreground))]">
                      You are currently subscribed.
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to unsubscribe? You will no longer receive updates and notifications.')) {
                          unsubscribeForm.post('/unsubscribe');
                        }
                      }}
                    >
                      <Button type="submit" variant="outline" className="w-full" disabled={unsubscribeForm.processing}>
                        {unsubscribeForm.processing ? 'Processing...' : 'Cancel subscription'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl bg-[hsl(var(--muted))] px-4 py-3 text-center text-sm text-[hsl(var(--muted-foreground))]">
                      You are not subscribed yet.
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        subscribeForm.post('/subscribe');
                      }}
                    >
                      <Button type="submit" className="w-full" disabled={subscribeForm.processing}>
                        {subscribeForm.processing ? 'Processing...' : 'Subscribe now'}
                      </Button>
                    </form>
                  </>
                )}
              </>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to logout?')) {
                  logoutForm.post('/logout');
                }
              }}
            >
              <Button type="submit" variant="destructive" className="w-full" disabled={logoutForm.processing}>
                {logoutForm.processing ? 'Logging out...' : 'Logout'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Manual Unsubscribe Modal */}
      {showUnsubscribeModal && flash?.unsubscribe_manual && (
        <UnsubscribeManualModal
          message={flash.unsubscribe_manual.message}
          instruction={flash.unsubscribe_manual.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </AppShell>
  );
}
