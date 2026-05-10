<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * MediaFile Model - Represents uploaded files in the media library
 * 
 * This model manages file uploads with support for different disks (local, cloud),
 * file types, collections for organization, versioning, and download tracking.
 * Integrates with Laravel's Storage system for file operations.
 * 
 * @property int $id
 * @property string $name
 * @property string|null $original_name
 * @property string|null $download_filename
 * @property string $path
 * @property string $disk
 * @property string $mime_type
 * @property int $size
 * @property string|null $type
 * @property string|null $collection
 * @property string|null $description
 * @property string|null $version
 * @property bool $is_active
 * @property int $download_count
 * @property array|null $metadata
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class MediaFile extends Model
{
    /**
     * The attributes that are mass assignable.
     * 
     * @var array
     */
    protected $fillable = [
        'name',              // Display name for the file
        'original_name',     // Original filename when uploaded
        'download_filename', // Filename for downloads
        'path',              // Storage path relative to disk
        'disk',              // Storage disk (local, s3, imagekit, etc.)
        'mime_type',         // File MIME type
        'size',              // File size in bytes
        'type',              // File type category (image, document, etc.)
        'collection',        // Collection name for grouping files
        'description',       // Optional description
        'version',           // Version identifier
        'is_active',         // Whether file is active/available
        'download_count',    // Number of downloads
        'metadata',          // Additional metadata (JSON)
    ];

    /**
     * The attributes that should be cast to native types.
     * 
     * @var array
     */
    protected $casts = [
        'size' => 'integer',           // Cast to integer
        'is_active' => 'boolean',      // Cast to boolean
        'download_count' => 'integer', // Cast to integer
        'metadata' => 'array',         // JSON to array conversion
    ];

    /**
     * Get the full public URL of the media file.
     * 
     * Uses Laravel's Storage facade to generate a URL for the file
     * based on the configured disk.
     * 
     * @return string Full URL to the file
     */
    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Get formatted file size in human-readable format.
     * 
     * Converts bytes to human-readable format (KB, MB, GB, etc.)
     * 
     * @return string Formatted file size (e.g., "2.50 MB")
     */
    public function formattedSize(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Scope to filter by file type.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type File type to filter by
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by collection.
     */
    public function scopeInCollection($query, string $collection)
    {
        return $query->where('collection', $collection);
    }

    /**
     * Scope for active files only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the active APK file.
     */
    public static function activeApk(): ?self
    {
        return static::query()
            ->where('type', 'apk')
            ->where('is_active', true)
            ->orderByDesc('created_at')
            ->first();
    }

    /**
     * Increment download counter.
     */
    public function incrementDownloads(): void
    {
        $this->increment('download_count');
    }

    /**
     * Delete the file from storage.
     */
    public function deleteFile(): bool
    {
        if (Storage::disk($this->disk)->exists($this->path)) {
            return Storage::disk($this->disk)->delete($this->path);
        }

        return true;
    }

    /**
     * Boot method to handle file deletion.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (self $media) {
            $media->deleteFile();
        });
    }
}
