<?php

namespace App\Services;

use Illuminate\Filesystem\FilesystemAdapter;

class ImageKitFilesystemAdapter extends FilesystemAdapter
{
    protected ImageKitStorage $imageKitAdapter;

    public function __construct($driver, ImageKitStorage $adapter, $config)
    {
        parent::__construct($driver, $adapter, $config);
        $this->imageKitAdapter = $adapter;
    }

    public function url($path): string
    {
        return $this->imageKitAdapter->publicUrl($path);
    }
}
