<?php
namespace App\Models;

class File implements \JsonSerializable
{
    public $fullPath;
    public $basePath;
    public $path;
    public $name;
    public $extension;
    public $size;
    public $mime;
    public $url;
    public $created_at;
    public $updated_at;

    public function __construct($path)
    {
        $this->basePath = $this::path();
        $this->fullPath = $path;
        $this->path = substr($path, strlen($this->basePath) + 1);
        $this->name = basename($path);
        $this->extension = pathinfo($path, PATHINFO_EXTENSION);
        $this->size = filesize($path);
        $this->mime = mime_content_type($path);
        $this->url = url(urlencode($this->path));
        // $this->url = url(($this->path), [], true);
        $this->created_at = filectime($path);
        $this->updated_at = filemtime($path);
    }

    public static function getPattern($file = '*', $extension = '*')
    {
        if (is_array($extension)) {
            $extension = '{'.implode(',', $extension).'}';
        }
        if (is_array($file)) {
            $file = '{'.implode(',', $file).'}';
        }
        return $file . '.' . $extension;
    }
    public function jsonSerialize()
    {
        return [
            // 'fullPath' => $this->fullPath,
            // 'basePath' => $this->basePath,
            'path' => $this->path,
            'name' => $this->name,
            'extension' => $this->extension,
            'size' => $this->size,
            'mime' => $this->mime,
            'url' => $this->url,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
    public static function path($path = "")
    {
        $result = config('phylz.path', base_path('storage/phylz'));
        if ($path) {
            $result .= '/' . $path;
        }
        return $result;
    }
    public static function getPath($path = '', $file = '*', $extension = '*')
    {
        $pattern = self::getPattern($file, $extension);
        $result = self::path($path . '/' . $pattern);
        $result = str_replace('//', '/', $result);
        return $result;
    }
    public static function getFiles($path, $file = '*', $extension = '*')
    {
        $path = self::getPath($path, $file, $extension);
        $flags = 0;
        if (strpos($path, '{')) {
            $flags |= GLOB_BRACE;
        }
        $files = array_merge(glob($path, $flags), glob(dirname($path) . '/*', GLOB_ONLYDIR));
        $result = array_map(function ($file) {
            return new File($file);
        }, $files);
        return $result;
    }
}
