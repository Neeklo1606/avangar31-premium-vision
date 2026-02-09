<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Пользователь', 'slug' => 'user', 'level' => 0, 'description' => 'Обычный пользователь'],
            ['name' => 'Модератор', 'slug' => 'moderator', 'level' => 10, 'description' => 'Модератор контента'],
            ['name' => 'Администратор', 'slug' => 'admin', 'level' => 100, 'description' => 'Полный доступ'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
