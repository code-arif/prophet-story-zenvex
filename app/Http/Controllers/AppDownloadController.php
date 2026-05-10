<?php

namespace App\Http\Controllers;

use App\Models\MediaFile;
use App\Services\AppSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AppDownloadController extends Controller
{
    /**
     * Display the app download page.
     */
    public function show(AppSettings $settings)
    {
        $activeApk = MediaFile::activeApk();

        return Inertia::render('AppDownload', [
            'brandName' => $settings->brandName(),
            'logoUrl' => $settings->logoUrl(),
            'apk' => $activeApk ? [
                'id' => $activeApk->id,
                'name' => $activeApk->name,
                'version' => $activeApk->version,
                'description' => $activeApk->description,
                'size' => $activeApk->formattedSize(),
                'downloadCount' => $activeApk->download_count,
                'updatedAt' => $activeApk->updated_at->format('M d, Y'),
            ] : null,
            'appChargeText' => (string) $settings->get('app.download_charge_text', 'Charge: Tk 4.00+ (VAT+SD+SC) per day with Auto Renewal.'),
            'appFeatures' => is_array($settings->get('app.download_features', [])) ? $settings->get('app.download_features', []) : (array) $settings->get('app.download_features', []),
        ]);
    }

    /**
     * Download the active APK file.
     */
    public function download(AppSettings $settings)
    {
        $activeApk = MediaFile::activeApk();

        if (!$activeApk) {
            return back()->with('error', 'No app available for download.');
        }

        $activeApk->incrementDownloads();

        $disk = Storage::disk($activeApk->disk);
        $path = $activeApk->path;

        if (!$disk->exists($path)) {
            return back()->with('error', 'File not found.');
        }

        $downloadName = $activeApk->download_filename 
            ?? ($this->generateApkFilename($settings->brandName(), $activeApk->version));

        return $disk->download($path, $downloadName);
    }

    /**
     * Public download endpoint for clean URLs like /apk/{filename}.
     */
    public function publicDownload(string $filename, AppSettings $settings, bool $increment = true)
    {
        $activeApk = MediaFile::activeApk();

        if (!$activeApk) {
            abort(404);
        }

        $expectedName = $activeApk->download_filename 
            ?? $this->generateApkFilename($settings->brandName(), $activeApk->version);

        if ($filename !== $expectedName) {
            abort(404);
        }

        if ($increment) {
            $activeApk->incrementDownloads();
        }

        $disk = Storage::disk($activeApk->disk);
        $path = $activeApk->path;

        if (!$disk->exists($path)) {
            abort(404);
        }

        return $disk->download($path, $expectedName);
    }

    /**
     * Generate a clean APK filename from brand name.
     */
    private function generateApkFilename(string $brandName, ?string $version): string
    {
        // Convert brand name to a safe filename format
        $safeName = strtolower($brandName);
        $safeName = preg_replace('/[^a-z0-9]+/', '-', $safeName);
        $safeName = trim($safeName, '-');
        
        return $safeName . '-v' . ($version ?? '1.0') . '.apk';
    }
}
