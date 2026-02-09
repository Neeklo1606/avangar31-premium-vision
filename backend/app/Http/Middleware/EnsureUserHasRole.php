<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Проверка уровня роли пользователя
     *
     * @param  string  $role  slug роли: user, moderator, admin
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        if (! $user || ! $user->role) {
            return response()->json(['message' => 'Доступ запрещён.'], 403);
        }

        $levels = ['user' => 0, 'moderator' => 10, 'admin' => 100];
        $minLevel = $levels[$role] ?? 0;

        if ($user->role->level < $minLevel) {
            return response()->json(['message' => 'Недостаточно прав доступа.'], 403);
        }

        return $next($request);
    }
}
