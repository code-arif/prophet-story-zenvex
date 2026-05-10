<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use League\Flysystem\FilesystemAdapter;
use League\Flysystem\Config;
use League\Flysystem\FileAttributes;
use League\Flysystem\UnableToWriteFile;
use League\Flysystem\UnableToReadFile;
use League\Flysystem\UrlGeneration\PublicUrlGenerator;

class ImageKitStorage implements FilesystemAdapter, PublicUrlGenerator
{
    private string $urlEndpoint;
    private string $publicKey;
    private string $privateKey;
    private string $basePath;

    public function __construct(array $config)
    {
        $this->urlEndpoint = rtrim($config['url_endpoint'], '/');
        $this->publicKey = $config['public_key'];
        $this->privateKey = $config['private_key'];
        $this->basePath = trim($config['path'] ?? '/', '/');
    }

    public function fileExists(string $path): bool
    {
        $url = $this->publicUrl($path);
        $http = Http::timeout(10);
        if (config('app.env') !== 'production') {
            $http = $http->withOptions(['verify' => false]);
        }
        $response = $http->head($url);
        return $response->successful();
    }

    public function directoryExists(string $path): bool
    {
        return true; // ImageKit doesn't have real directories
    }

    public function write(string $path, string $contents, Config $config): void
    {
        // Apply basePath to get the full ImageKit storage path
        // Input: media/images/test.jpg
        // With basePath /sports: /sports/media/images/test.jpg
        $fullPath = $this->prefixPath($path);
        
        $http = Http::withBasicAuth($this->privateKey, '');
        
        // Disable SSL verification in development
        if (config('app.env') !== 'production') {
            $http = $http->withOptions(['verify' => false]);
        }
        
        $response = $http
            ->attach('file', $contents, basename($path))
            ->post('https://upload.imagekit.io/api/v1/files/upload', [
                'fileName' => basename($fullPath),
                'folder' => '/' . dirname($fullPath),
                'useUniqueFileName' => 'false',
                'isPrivateFile' => 'false',
            ]);

        if ($response->failed()) {
            Log::error('ImageKit upload failed', [
                'path' => $path,
                'response' => $response->body(),
            ]);
            throw UnableToWriteFile::atLocation($path, 'ImageKit upload failed: ' . $response->body());
        }
    }

    public function writeStream(string $path, $contents, Config $config): void
    {
        $this->write($path, stream_get_contents($contents), $config);
    }

    public function read(string $path): string
    {
        $url = $this->publicUrl($path);
        $http = Http::timeout(30);
        if (config('app.env') !== 'production') {
            $http = $http->withOptions(['verify' => false]);
        }
        $response = $http->get($url);
        
        if ($response->failed()) {
            throw UnableToReadFile::fromLocation($path, 'Failed to read from ImageKit');
        }
        
        return $response->body();
    }

    public function readStream(string $path)
    {
        $contents = $this->read($path);
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $contents);
        rewind($stream);
        return $stream;
    }

    public function delete(string $path): void
    {
        // ImageKit requires fileId to delete
        // For simplicity, we'll skip deletion
    }

    public function deleteDirectory(string $path): void
    {
        // Not supported
    }

    public function createDirectory(string $path, Config $config): void
    {
        // ImageKit creates folders automatically
    }

    public function setVisibility(string $path, string $visibility): void
    {
        // All ImageKit files are public
    }

    public function visibility(string $path): FileAttributes
    {
        return new FileAttributes($path, null, 'public');
    }

    public function mimeType(string $path): FileAttributes
    {
        return new FileAttributes($path, null, null, null, $this->guessMimeType($path));
    }

    public function lastModified(string $path): FileAttributes
    {
        return new FileAttributes($path, null, null, time());
    }

    public function fileSize(string $path): FileAttributes
    {
        $url = $this->publicUrl($path);
        $http = Http::timeout(10);
        if (config('app.env') !== 'production') {
            $http = $http->withOptions(['verify' => false]);
        }
        
        $response = $http->head($url);
        
        $fileSize = null;
        if ($response->successful()) {
            $contentLength = $response->header('Content-Length');
            if ($contentLength !== null) {
                $fileSize = (int) $contentLength;
            }
        }
        
        // If we couldn't get size from HEAD, try to read the file
        if ($fileSize === null) {
            try {
                $contents = $this->read($path);
                $fileSize = strlen($contents);
            } catch (\Throwable $e) {
                $fileSize = 0;
            }
        }
        
        return new FileAttributes($path, $fileSize);
    }

    public function listContents(string $path, bool $deep): iterable
    {
        return [];
    }

    /**
     * List all files from ImageKit API.
     * Returns files with ImageKit storage paths (including basePath).
     */
    public function listAllFiles(?string $folderPath = null): array
    {
        $allFiles = [];
        $skip = 0;
        $limit = 1000;
        
        do {
            $http = Http::withBasicAuth($this->privateKey, '');
            
            // Disable SSL verification in development
            if (config('app.env') !== 'production') {
                $http = $http->withOptions(['verify' => false]);
            }
            
            $params = [
                'skip' => $skip,
                'limit' => $limit,
            ];
            
            // If folderPath provided, apply basePath to search in correct location
            if ($folderPath) {
                $fullPath = $this->prefixPath($folderPath);
                $params['path'] = '/' . ltrim($fullPath, '/');
            } elseif ($this->basePath) {
                // Default to listing files within basePath (our app root)
                $params['path'] = '/' . ltrim($this->basePath, '/');
            }
            
            $response = $http->get('https://api.imagekit.io/v1/files', $params);
            
            if ($response->failed()) {
                Log::error('ImageKit list files failed', [
                    'response' => $response->body(),
                ]);
                break;
            }
            
            $files = $response->json();
            if (empty($files)) {
                break;
            }
            
            $allFiles = array_merge($allFiles, $files);
            $skip += $limit;
            
        } while (count($files) === $limit);
        
        return $allFiles;
    }

    public function move(string $source, string $destination, Config $config): void
    {
        $this->copy($source, $destination, $config);
        $this->delete($source);
    }

    public function copy(string $source, string $destination, Config $config): void
    {
        $contents = $this->read($source);
        $this->write($destination, $contents, $config);
    }

    public function publicUrl(string $path, Config $config = null): string
    {
        // Apply basePath to get full ImageKit URL
        // Input path from DB: media/images/test.jpg
        // With basePath /sports: https://ik.imagekit.io/bdelection/sports/media/images/test.jpg
        $fullPath = $this->prefixPath($path);
        return $this->urlEndpoint . '/' . ltrim($fullPath, '/');
    }

    private function prefixPath(string $path): string
    {
        // Add basePath prefix to convert app-relative path to ImageKit storage path
        // This makes IMAGEKIT_PATH the "root" for all app operations
        return $this->basePath ? $this->basePath . '/' . ltrim($path, '/') : ltrim($path, '/');
    }

    public function stripBasePath(string $path): string
    {
        // Remove basePath prefix to convert ImageKit storage path to app-relative path
        // ImageKit path: /sports/media/images/test.jpg -> App path: media/images/test.jpg
        $path = ltrim($path, '/');
        if ($this->basePath && str_starts_with($path, $this->basePath . '/')) {
            return substr($path, strlen($this->basePath) + 1);
        }
        if ($this->basePath && str_starts_with($path, '/' . $this->basePath . '/')) {
            return substr($path, strlen($this->basePath) + 2);
        }
        return $path;
    }

    private function guessMimeType(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
        ];
        
        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }
}
