<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = ['name', 'slug', 'level', 'description'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function hasLevel(int $minLevel): bool
    {
        return $this->level >= $minLevel;
    }

    public function isAdmin(): bool
    {
        return $this->level >= 100;
    }

    public function isModerator(): bool
    {
        return $this->level >= 10;
    }
}
