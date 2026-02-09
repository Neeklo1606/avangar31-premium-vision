<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Регистрация пользователя (роль по умолчанию: user)
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $roleUser = Role::where('slug', 'user')->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $roleUser->id,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('role'),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Вход
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Неверные учётные данные.'],
            ]);
        }

        // Отозвать старые токены (опционально — для одного устройства)
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('role'),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Выход (отзыв токена)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Вы вышли из аккаунта.']);
    }

    /**
     * Текущий пользователь
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
