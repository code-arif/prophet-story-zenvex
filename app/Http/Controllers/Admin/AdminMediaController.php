<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Services\AppSettings;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminMediaController extends Controller
{
    /**
     * Display media file manager.
     */
    public function index(Request $request)
    {
        $currentFolder = $request->query('folder');
        $type = $request->query('type');

        // Get folders in current directory
        $folders = [];
        if (!$currentFolder) {
            // Root view - show all top-level folders
            $allCollections = MediaFile::query()
                ->whereNotNull('collection')
                ->where('collection', '!=', '')
                ->distinct()
                ->pluck('collection')
                ->toArray();

            $topLevelFolders = [];
            foreach ($allCollections as $collection) {
                $parts = explode('/', $collection);
                $topLevel = $parts[0];
                if (!isset($topLevelFolders[$topLevel])) {
                    $topLevelFolders[$topLevel] = 0;
                }
                // Count files at all levels under this top folder
                $fileCount = MediaFile::query()
                    ->where('collection', $topLevel)
                    ->orWhere('collection', 'like', $topLevel . '/%')
                    ->count();
                $topLevelFolders[$topLevel] = $fileCount;
            }

            foreach ($topLevelFolders as $folder => $count) {
                $folders[] = [
                    'name' => $folder,
                    'path' => $folder,
                    'file_count' => $count,
                ];
            }
        } else {
            // Inside a folder - show subfolders
            // Get all collections that start with current folder path
            $allCollections = MediaFile::query()
                ->whereNotNull('collection')
                ->where('collection', 'like', $currentFolder . '/%')
                ->distinct()
                ->pluck('collection')
                ->toArray();

            $subfolders = [];
            $currentDepth = substr_count($currentFolder, '/') + 1;
            
            foreach ($allCollections as $collection) {
                // Get the relative path from current folder
                if (str_starts_with($collection, $currentFolder . '/')) {
                    $relativePath = substr($collection, strlen($currentFolder) + 1);
                    $parts = explode('/', $relativePath);
                    
                    // Only show immediate subdirectories
                    if (count($parts) > 0 && $parts[0]) {
                        $subfolder = $parts[0];
                        $subfolderPath = $currentFolder . '/' . $subfolder;
                        
                        if (!isset($subfolders[$subfolder])) {
                            // Count files in this subfolder and all its subdirectories
                            $fileCount = MediaFile::query()
                                ->where(function($query) use ($subfolderPath) {
                                    $query->where('collection', $subfolderPath)
                                          ->orWhere('collection', 'like', $subfolderPath . '/%');
                                })
                                ->count();
                            
                            $subfolders[$subfolder] = [
                                'name' => $subfolder,
                                'path' => $subfolderPath,
                                'file_count' => $fileCount,
                            ];
                        }
                    }
                }
            }

            $folders = array_values($subfolders);
        }

        // Get files in current folder (not in subfolders)
        $query = MediaFile::query()->orderByDesc('created_at');

        if ($currentFolder) {
            $query->where('collection', $currentFolder);
        } else {
            // At root, only show files without collection or in root
            $query->where(function($q) {
                $q->whereNull('collection')
                  ->orWhere('collection', '');
            });
        }

        if ($type) {
            $query->where('type', $type);
        }

        $perPage = app(\App\Services\AppSettings::class)->paginationMedia();
        $filesPaginated = $query->paginate($perPage);
        
        $files = $filesPaginated->map(function ($file) {
            return array_merge($file->toArray(), ['url' => $file->url()]);
        })->toArray();

        // Build breadcrumbs
        $breadcrumbs = [];
        if ($currentFolder) {
            $parts = explode('/', $currentFolder);
            $path = '';
            foreach ($parts as $part) {
                $path = $path ? $path . '/' . $part : $part;
                $breadcrumbs[] = [
                    'name' => $part,
                    'path' => $path,
                ];
            }
        }

        $lastSync = MediaFile::query()->max('updated_at');

        // Get base path info for display
        $basePath = config('filesystems.disks.imagekit.path', '');
        $baseUrl = config('filesystems.disks.imagekit.url_endpoint', '');
        $fullBaseUrl = $baseUrl . $basePath;

        // Get all folders for move dropdown
        $allFolders = MediaFile::query()
            ->whereNotNull('collection')
            ->where('collection', '!=', '')
            ->distinct()
            ->pluck('collection')
            ->toArray();

        return Inertia::render('Admin/Media/Index', [
            'folders' => $folders,
            'files' => $files,
            'currentFolder' => $currentFolder,
            'breadcrumbs' => $breadcrumbs,
            'pagination' => [
                'current_page' => $filesPaginated->currentPage(),
                'last_page' => $filesPaginated->lastPage(),
                'links' => $filesPaginated->linkCollection()->toArray(),
            ],
            'filters' => [
                'type' => $type,
            ],
            'types' => ['image', 'video', 'document', 'apk', 'file'],
            'lastSync' => $lastSync,
            'basePath' => $basePath,
            'baseUrl' => $baseUrl,
            'fullBaseUrl' => $fullBaseUrl,
            'allFolders' => $allFolders,
        ]);
    }

    /**
     * API endpoint to fetch media files for the picker.
     */
    public function api(Request $request)
    {
        $type = $request->query('type');
        $currentFolder = $request->query('folder');

        // Get folders in current directory
        $folders = [];
        if (!$currentFolder) {
            // Root view - show all top-level folders
            $allCollections = MediaFile::query()
                ->whereNotNull('collection')
                ->where('collection', '!=', '')
                ->distinct()
                ->pluck('collection')
                ->toArray();

            $topLevelFolders = [];
            foreach ($allCollections as $collection) {
                $parts = explode('/', $collection);
                $topLevel = $parts[0];
                if (!isset($topLevelFolders[$topLevel])) {
                    $topLevelFolders[$topLevel] = 0;
                }
                // Count files at all levels under this top folder
                $fileCount = MediaFile::query()
                    ->where('collection', $topLevel)
                    ->orWhere('collection', 'like', $topLevel . '/%')
                    ->count();
                $topLevelFolders[$topLevel] = $fileCount;
            }

            foreach ($topLevelFolders as $folder => $count) {
                $folders[] = [
                    'name' => $folder,
                    'path' => $folder,
                    'file_count' => $count,
                ];
            }
        } else {
            // Inside a folder - show subfolders
            $allCollections = MediaFile::query()
                ->whereNotNull('collection')
                ->where('collection', 'like', $currentFolder . '/%')
                ->distinct()
                ->pluck('collection')
                ->toArray();

            $subfolders = [];
            
            foreach ($allCollections as $collection) {
                // Get the relative path from current folder
                if (str_starts_with($collection, $currentFolder . '/')) {
                    $relativePath = substr($collection, strlen($currentFolder) + 1);
                    $parts = explode('/', $relativePath);
                    
                    // Only show immediate subdirectories
                    if (count($parts) > 0 && $parts[0]) {
                        $subfolder = $parts[0];
                        $subfolderPath = $currentFolder . '/' . $subfolder;
                        
                        if (!isset($subfolders[$subfolder])) {
                            // Count files in this subfolder and all its subdirectories
                            $fileCount = MediaFile::query()
                                ->where(function($query) use ($subfolderPath) {
                                    $query->where('collection', $subfolderPath)
                                          ->orWhere('collection', 'like', $subfolderPath . '/%');
                                })
                                ->count();
                            
                            $subfolders[$subfolder] = [
                                'name' => $subfolder,
                                'path' => $subfolderPath,
                                'file_count' => $fileCount,
                            ];
                        }
                    }
                }
            }

            $folders = array_values($subfolders);
        }

        // Get files in current folder (not in subfolders)
        $query = MediaFile::query()
            ->where('type', '!=', 'apk') // Exclude APKs from general media picker
            ->orderByDesc('created_at');

        if ($currentFolder) {
            $query->where('collection', $currentFolder);
        } else {
            // At root, only show files without collection or in root
            $query->where(function($q) {
                $q->whereNull('collection')
                  ->orWhere('collection', '');
            });
        }

        if ($type && $type !== 'all') {
            $query->where('type', $type);
        }

        $media = $query->limit(100)
            ->get(['id', 'name', 'path', 'disk', 'type', 'mime_type', 'size'])
            ->map(function ($file) {
                return [
                    'id' => $file->id,
                    'name' => $file->name,
                    'path' => $file->path,
                    'type' => $file->type,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'url' => $file->url(),
                ];
            });

        // Build breadcrumbs
        $breadcrumbs = [];
        if ($currentFolder) {
            $parts = explode('/', $currentFolder);
            $path = '';
            foreach ($parts as $part) {
                $path = $path ? $path . '/' . $part : $part;
                $breadcrumbs[] = [
                    'name' => $part,
                    'path' => $path,
                ];
            }
        }

        return response()->json([
            'files' => $media,
            'folders' => $folders,
            'breadcrumbs' => $breadcrumbs,
        ]);
    }

    /**
     * Store a new media file.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:102400'], // 100MB max
            'name' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'collection' => ['nullable', 'string', 'max:100'],
        ]);

        /** @var UploadedFile $file */
        $file = $validated['file'];
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType() ?? 'application/octet-stream';
        $size = $file->getSize();

        // Determine file type
        $type = $this->determineFileType($mimeType, $extension);

        // Determine storage folder based on type
        $folder = $this->getStorageFolder($type);

        // Generate unique filename
        $filename = Str::uuid() . '.' . $extension;
        $disk = config('filesystems.default', 'public');
        $path = $file->storeAs($folder, $filename, $disk);

        $media = MediaFile::create([
            'name' => $validated['name'] ?? pathinfo($originalName, PATHINFO_FILENAME),
            'original_name' => $originalName,
            'path' => $path,
            'disk' => config('filesystems.default', 'public'),
            'mime_type' => $mimeType,
            'size' => $size,
            'type' => $type,
            'collection' => $validated['collection'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        // Return JSON for AJAX requests (TinyMCE, fetch(), etc.) but NOT for Inertia
        if (($request->expectsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return response()->json([
                'location' => $media->url(),
                'media' => $media,
            ]);
        }

        return back()->with('status', 'File uploaded successfully.');
    }

    /**
     * Update media file metadata.
     */
    public function update(Request $request, MediaFile $media)
    {
        $rules = [
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:1000'],
            'collection' => ['nullable', 'string', 'max:100'],
        ];

        // Add APK-specific fields if updating an APK file
        if ($media->type === 'apk') {
            $rules['version'] = ['nullable', 'string', 'max:50'];
            $rules['download_filename'] = ['nullable', 'string', 'max:200', 'regex:/^[a-zA-Z0-9_-]+\\.apk$/'];
            $rules['is_active'] = ['nullable', 'boolean'];
        }

        $validated = $request->validate($rules);

        // If setting APK as active, deactivate all other APKs
        if ($media->type === 'apk' && ($validated['is_active'] ?? false)) {
            MediaFile::query()
                ->where('type', 'apk')
                ->where('id', '!=', $media->id)
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        $media->update($validated);

        return back()->with('status', 'File updated successfully.');
    }

    /**
     * Delete a media file.
     */
    public function destroy(MediaFile $media)
    {
        $media->delete();

        return back()->with('status', 'File deleted successfully.');
    }

    /**
     * Move a media file to a different folder.
     */
    public function move(Request $request, MediaFile $media)
    {
        $validated = $request->validate([
            'folder' => ['nullable', 'string', 'max:200'],
        ]);

        $newFolder = $validated['folder'] ?? null;
        
        // Update the collection (folder) in the database
        $media->update([
            'collection' => $newFolder ?: null,
        ]);

        return back()->with('status', 'File moved successfully.');
    }

    /**
     * Rename a media file.
     */
    public function rename(Request $request, MediaFile $media)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
        ]);

        $media->update([
            'name' => $validated['name'],
        ]);

        return back()->with('status', 'File renamed successfully.');
    }

    /**
     * Sync/refresh media files.
     */
    public function sync(Request $request)
    {
        $disk = config('filesystems.default', 'public');
        
        // If using ImageKit, fetch all files from their API
        if ($disk === 'imagekit') {
            try {
                $adapter = Storage::disk('imagekit')->getAdapter();
                
                // Get the underlying ImageKitStorage instance
                if (method_exists($adapter, 'listAllFiles')) {
                    $imageKitFiles = $adapter->listAllFiles();
                } elseif ($adapter instanceof \App\Services\ImageKitFilesystemAdapter) {
                    // Access the protected property through reflection
                    $reflection = new \ReflectionClass($adapter);
                    $property = $reflection->getProperty('imageKitAdapter');
                    $property->setAccessible(true);
                    $imageKitAdapter = $property->getValue($adapter);
                    $imageKitFiles = $imageKitAdapter->listAllFiles();
                } else {
                    return back()->with('error', 'ImageKit adapter not found.');
                }
                
                \Log::info('Media sync started', [
                    'files_found' => count($imageKitFiles),
                ]);
                
                // If no files found, return early
                if (empty($imageKitFiles)) {
                    return back()->with('status', 'No files found in ImageKit. Check that files exist in the configured path.');
                }
                
                // Sync files to database
                $synced = 0;
                $syncedPaths = [];
                foreach ($imageKitFiles as $file) {
                    // Extract path from ImageKit file
                    // filePath comes as: /sports/media/images/test.jpg
                    $ikFilePath = $file['filePath'] ?? '';
                    
                    if (empty($ikFilePath)) {
                        \Log::warning('Skipping file with empty path', ['file' => $file]);
                        continue;
                    }
                    
                    // Remove basePath prefix to get clean app-relative path
                    // Use the adapter's stripBasePath method for consistency
                    // We want to store: media/images/test.jpg (without /sports)
                    try {
                        if (method_exists($adapter, 'stripBasePath')) {
                            $cleanPath = $adapter->stripBasePath($ikFilePath);
                        } elseif ($adapter instanceof \App\Services\ImageKitFilesystemAdapter) {
                            $reflection = new \ReflectionClass($adapter);
                            $property = $reflection->getProperty('imageKitAdapter');
                            $property->setAccessible(true);
                            $imageKitAdapter = $property->getValue($adapter);
                            $cleanPath = $imageKitAdapter->stripBasePath($ikFilePath);
                        } else {
                            // Fallback: manual strip
                            $ikFilePath = ltrim($ikFilePath, '/');
                            $basePath = config('filesystems.disks.imagekit.path', '');
                            $basePath = trim($basePath, '/');
                            if ($basePath && str_starts_with($ikFilePath, $basePath . '/')) {
                                $cleanPath = substr($ikFilePath, strlen($basePath) + 1);
                            } else {
                                $cleanPath = $ikFilePath;
                            }
                        }
                    } catch (\Exception $e) {
                        \Log::error('Failed to strip base path', [
                            'file_path' => $ikFilePath,
                            'error' => $e->getMessage(),
                        ]);
                        continue;
                    }
                    
                    // Extract folder/collection from clean path
                    $folder = dirname($cleanPath);
                    if ($folder === '.') {
                        $folder = null;
                    }
                    
                    // Determine file type
                    $fileType = $file['fileType'] ?? 'non-image';
                    $type = match ($fileType) {
                        'image' => 'image',
                        'video' => 'video',
                        'non-image' => $this->determineTypeFromExtension($file['name'] ?? ''),
                        default => 'file',
                    };
                    
                    // Create or update MediaFile record with clean path
                    MediaFile::updateOrCreate(
                        [
                            'path' => $cleanPath,
                            'disk' => 'imagekit',
                        ],
                        [
                            'name' => pathinfo($file['name'] ?? '', PATHINFO_FILENAME),
                            'original_name' => $file['name'] ?? '',
                            'mime_type' => $file['mime'] ?? 'application/octet-stream',
                            'size' => $file['size'] ?? 0,
                            'type' => $type,
                            'collection' => $folder,
                        ]
                    );
                    
                    $syncedPaths[] = $cleanPath;
                    $synced++;
                }
                
                // Remove database entries for files that no longer exist in ImageKit
                $deleted = MediaFile::query()
                    ->where('disk', 'imagekit')
                    ->whereNotIn('path', $syncedPaths)
                    ->delete();
                
                \Log::info('Media sync completed', [
                    'total_files' => count($imageKitFiles),
                    'synced' => $synced,
                    'deleted' => $deleted,
                ]);
                
                $message = "Media library synced. {$synced} files imported from ImageKit.";
                if ($deleted > 0) {
                    $message .= " {$deleted} obsolete records removed.";
                }
                
                return back()->with('status', $message);
                
            } catch (\Exception $e) {
                \Log::error('Media sync failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                return back()->with('error', 'Sync failed: ' . $e->getMessage());
            }
        }
        
        // For local storage, just refresh the page
        return back()->with('status', 'Media library refreshed.');
    }

    private function determineTypeFromExtension(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        if ($extension === 'apk') {
            return 'apk';
        }
        
        if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'])) {
            return 'document';
        }
        
        return 'file';
    }

    /**
     * Create a new folder (collection).
     */
    public function createFolder(Request $request)
    {
        $validated = $request->validate([
            'folder_name' => ['required', 'string', 'max:100', 'regex:/^[a-zA-Z0-9_-]+$/'],
            'parent_folder' => ['nullable', 'string', 'max:200'],
        ]);

        $folderName = $validated['folder_name'];
        $parentFolder = $validated['parent_folder'] ?? null;

        // Build full folder path
        $folderPath = $parentFolder ? $parentFolder . '/' . $folderName : $folderName;

        // Check if folder already exists
        $exists = MediaFile::query()
            ->where('collection', $folderPath)
            ->exists();

        if ($exists) {
            return back()->with('error', 'Folder already exists.');
        }

        // Create a placeholder file to establish the folder
        // (We'll just mark it in the database - actual files will be added via upload)
        // For now, just return success since folders are virtual collections
        
        return back()->with('status', 'Folder created. Upload files to it to make it visible.');
    }

    /**
     * Delete a folder and all its contents.
     */
    public function deleteFolder(Request $request)
    {
        $validated = $request->validate([
            'folder_path' => ['required', 'string', 'max:200'],
        ]);

        $folderPath = $validated['folder_path'];

        // Delete all files in this folder and subfolders
        $deleted = MediaFile::query()
            ->where('collection', $folderPath)
            ->orWhere('collection', 'like', $folderPath . '/%')
            ->delete();

        if ($deleted > 0) {
            return back()->with('status', "Folder and {$deleted} file(s) deleted successfully.");
        }

        return back()->with('error', 'Folder not found or already empty.');
    }

    /**
     * Display APK manager page.
     */
    public function apkIndex()
    {
        $apks = MediaFile::query()
            ->where('type', 'apk')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($file) {
                return array_merge($file->toArray(), ['url' => $file->url()]);
            });

        $activeApk = MediaFile::activeApk();
        if ($activeApk) {
            $activeApk = array_merge($activeApk->toArray(), ['url' => $activeApk->url()]);
        }

        $lastSync = MediaFile::query()->where('type', 'apk')->max('updated_at');

        return Inertia::render('Admin/Media/ApkManager', [
            'apks' => $apks,
            'activeApk' => $activeApk,
            'lastSync' => $lastSync,
        ]);
    }

    /**
     * Upload a new APK file.
     */
    public function apkStore(Request $request, AppSettings $settings)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:102400'], // 100MB max
            'name' => ['nullable', 'string', 'max:200'],
            'version' => ['required', 'string', 'max:50'],
            'download_filename' => ['nullable', 'string', 'max:200', 'regex:/^[a-zA-Z0-9_-]+\.apk$/'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        /** @var UploadedFile $file */
        $file = $validated['file'];
        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());

        // Validate APK extension
        if ($extension !== 'apk') {
            return back()->with('error', 'Only APK files are allowed.');
        }

        $size = $file->getSize();

        // Generate unique filename
        $filename = 'app-v' . Str::slug($validated['version']) . '-' . Str::uuid() . '.' . $extension;
        $disk = config('filesystems.default', 'public');
        
        // Store file (Laravel automatically applies basePath for ImageKit)
        $path = $file->storeAs('apk', $filename, $disk);

        // If setting as active, deactivate all other APKs
        if ($validated['is_active'] ?? false) {
            MediaFile::query()
                ->where('type', 'apk')
                ->where('is_active', true)
                ->update(['is_active' => false]);
        }

        // Generate default download filename if not provided
        $brandSlug = Str::slug(strtolower($settings->brandName()));
        $downloadFilename = $validated['download_filename'] 
            ?? $brandSlug . '-v' . Str::slug($validated['version']) . '.apk';

        MediaFile::create([
            'name' => $validated['name'] ?? $settings->brandName() . ' App',
            'original_name' => $originalName,
            'download_filename' => $downloadFilename,
            'path' => $path,
            'disk' => $disk,
            'mime_type' => 'application/vnd.android.package-archive',
            'size' => $size,
            'type' => 'apk',
            'collection' => 'apk',
            'version' => $validated['version'],
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? false,
        ]);

        return back()->with('status', 'APK uploaded successfully.');
    }

    /**
     * Set an APK as the active download.
     */
    public function apkSetActive(MediaFile $media)
    {
        if ($media->type !== 'apk') {
            return back()->with('error', 'Invalid APK file.');
        }

        // Deactivate all other APKs
        MediaFile::query()
            ->where('type', 'apk')
            ->where('is_active', true)
            ->update(['is_active' => false]);

        $media->update(['is_active' => true]);

        return back()->with('status', 'APK set as active download.');
    }

    /**
     * Delete an APK file.
     */
    public function apkDestroy(MediaFile $media)
    {
        if ($media->type !== 'apk') {
            return back()->with('error', 'Invalid APK file.');
        }

        $media->delete();

        return back()->with('status', 'APK deleted successfully.');
    }

    /**
     * Determine file type based on mime type and extension.
     */
    private function determineFileType(string $mimeType, string $extension): string
    {
        $extension = strtolower($extension);

        if ($extension === 'apk') {
            return 'apk';
        }

        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        if (in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'])) {
            return 'document';
        }

        return 'file';
    }

    /**
     * Get storage folder based on file type.
     */
    private function getStorageFolder(string $type): string
    {
        return match ($type) {
            'image' => 'media/images',
            'video' => 'media/videos',
            'document' => 'media/documents',
            'apk' => 'apk',
            default => 'media/files',
        };
    }
}
