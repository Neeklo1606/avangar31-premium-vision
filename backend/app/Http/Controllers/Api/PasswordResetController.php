<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Запрос на восстановление пароля
     */
    public function forgot(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = $validated['email'];
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => hash('sha256', $token), 'created_at' => now()]
        );

        // TODO: отправить email со ссылкой /reset-password?token=...
        // Mail::to($email)->send(new ResetPasswordMail($token, $email));

        $resetUrl = config('app.frontend_url', 'http://localhost:3000') . '/reset-password/' . $token . '?email=' . urlencode($email);

        // TODO: Mail::to($email)->send(new ResetPasswordMail($resetUrl));

        return response()->json([
            'message' => 'Инструкции по восстановлению пароля отправлены на email.',
            'reset_url' => config('app.debug') ? $resetUrl : null, // только при APP_DEBUG=true
        ]);
    }

    /**
     * Сброс пароля по токену
     */
    public function reset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', hash('sha256', $validated['token']))
            ->first();

        if (! $record) {
            throw ValidationException::withMessages([
                'token' => ['Токен недействителен или устарел. Запросите новую ссылку.'],
            ]);
        }

        $user = \App\Models\User::where('email', $validated['email'])->firstOrFail();
        $user->update(['password' => Hash::make($validated['password'])]);
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return response()->json([
            'message' => 'Пароль успешно изменён.',
        ]);
    }
}
