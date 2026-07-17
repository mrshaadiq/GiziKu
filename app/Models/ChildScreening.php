<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChildScreening extends Model
{
    protected $fillable = [
        'user_id',
        'nama_anak',
        'usia_bulan',
        'jenis_kelamin',
        'berat_badan',
        'tinggi_badan',
        'status_stunting',
        'status_anemia',
        'level_urgensi',
        'catatan',
        'foto_muka',
        'foto_mata',
        'foto_kuku',
    ];
}
