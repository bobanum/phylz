<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\File;

class AppController extends Controller
{
    public function index($url = null)
    {
        $pattern = config('phylz.pattern', '*');
        $extensions = config('phylz.extensions', '*');
        $files = File::getFiles($url, $pattern, $extensions);
        return [
            'status' => 'success',
            'url' => $url ?? '/',
            'pattern' => File::getPattern($pattern, $extensions),
            'files' => $files
        ];
    }
}
