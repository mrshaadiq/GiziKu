<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'judul',
        'ringkasan',
        'konten',
        'kategori',
        'tipe',
        'quiz_data',
    ];
}
