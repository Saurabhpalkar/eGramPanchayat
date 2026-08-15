<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Service;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'user_id',
        'service_id',
        'status',
        'applied_date',
        'due_date',
        'approved_date',
        'remarks',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function service(){
        return $this->belongsTo(Service::class);
    }
}
