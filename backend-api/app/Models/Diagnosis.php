<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'disease',
        'confidence',
        'severity',
        'description',
        'explanation',
        'recommendations',
        'alternative_diagnoses',
        'image_path',
        'heatmap_path',
        'symptoms_data',
        'analysis_method',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'confidence' => 'float',
        'recommendations' => 'array',
        'alternative_diagnoses' => 'array',
        'symptoms_data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the diagnosis.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
