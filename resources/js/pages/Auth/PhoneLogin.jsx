import { Head, useForm, Link, usePage } from '@inertiajs/react';
import React from 'react';

import { Button } from '../../components/ui/button';
import { Download} from 'lucide-react';
import UnsubscribeManualModal from '../../components/UnsubscribeManualModal';


export default function PhoneLogin({ brandName, logoUrl, guestModeEnabled, appChargeText }) {
  const form = useForm({
    msisdn: '',
  });
  const { flash } = usePage().props;
  
  const [showUnsubscribeModal, setShowUnsubscribeModal] = React.useState(false);
  const [unsubscribeInfo, setUnsubscribeInfo] = React.useState(null);

  // Parse error message for manual unsubscribe instructions
  React.useEffect(() => {
    if (flash?.error && flash.error.includes('send SMS')) {
      // Extract the instruction from error message
      // Format: "...Please send SMS: STOP {source} to 21213..."
      const match = flash.error.match(/send SMS:\s*(.+?)\s*to\s*(\d+)/i);
      if (match) {
        setUnsubscribeInfo({
          message: flash.error.split('Please send SMS')[0].trim() + '.',
          instruction: `${match[1]} to ${match[2]}`
        });
        setShowUnsubscribeModal(true);
      }
    }
  }, [flash?.error]);

  return (
    <div className="min-h-dvh bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Head title="Login" />

      <div className="mx-auto flex min-h-dvh w-full max-w-md items-center justify-center px-5 py-10">
        <div className="w-full">
          {/* Flash messages */}
          {flash?.error && (
            <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
              {flash.error}
            </div>
          )}
          {flash?.status && (
            <div className="mb-4 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400 ring-1 ring-green-500/20">
              {flash.status}
            </div>
          )}

          <div className="mb-6 flex flex-col items-center text-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="mb-4 size-24 rounded-full bg-white/5 object-cover ring-1 ring-[hsl(var(--border))]"
              />
            ) : (
              <div className="mb-4 grid size-24 place-items-center rounded-full bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
                <span className="text-2xl font-semibold">BD</span>
              </div>
            )}

            <div className="text-2xl font-semibold leading-tight">{brandName}</div>
            <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Login with phone + OTP</div>
          </div>

          <div className="rounded-3xl bg-[hsl(var(--card))] p-5 ring-1 ring-[hsl(var(--border))]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.post('/login/send-otp');
              }}
              className="space-y-4"
            >
              <label className="block text-sm text-[hsl(var(--muted-foreground))]">Mobile number</label>

              <div className="rounded-2xl bg-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]">
                <div className="flex items-center gap-3 px-4 py-3">
                  <input
                    value={form.data.msisdn}
                    onChange={(e) => form.setData('msisdn', e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="8801XXXXXXXXX"
                    className="w-full bg-transparent text-lg tracking-wide text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
                  />
                </div>
              </div>

              {form.errors.msisdn ? (
                <div className="text-sm text-red-400">{form.errors.msisdn}</div>
              ) : null}

              <Button type="submit" className="w-full" disabled={form.processing}>
                Get OTP
              </Button>
            </form>

            <div className="mt-4 text-xs text-[hsl(var(--muted-foreground))]">
              Use format: 8801XXXXXXXXX (no +). Also accepts: 01XXXXXXXXX
            </div>
          </div>

          {guestModeEnabled && (
            <div className="mt-4 text-center">
              <Link
                href="/guest"
                className="inline-block text-sm text-[hsl(var(--primary))] hover:underline"
              >
                Continue as Guest
              </Link>
            </div>
          )}

          {/*Charging Info*/}
          {appChargeText && (
            <div className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
              {appChargeText}
            </div>
          )}

          {/* app download link */}
          <div className="mt-6 text-center">
            <Link
              href="/app"
              className="inline-block rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm text-white hover:bg-[hsl(var(--primary))]/90 transition-colors"
            >
              <Download className="inline-block mr-2 h-4 w-4" />
              Download our app
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Unsubscribe Modal */}
      {showUnsubscribeModal && unsubscribeInfo && (
        <UnsubscribeManualModal
          message={unsubscribeInfo.message}
          instruction={unsubscribeInfo.instruction}
          onClose={() => setShowUnsubscribeModal(false)}
        />
      )}
    </div>
  );
}
