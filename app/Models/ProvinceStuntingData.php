<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProvinceStuntingData extends Model
{
    use HasFactory;

    protected $table = 'province_stunting_data';

    protected $fillable = [
        'province_code',
        'province_name',
        'stunting_prevalence',
        'status',
        'faskes_access',
        'urgency_priority',
        'data_year'
    ];
}
