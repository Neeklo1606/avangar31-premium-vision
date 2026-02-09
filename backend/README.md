# Live Grid — Backend API (Laravel + Sanctum)

API-бэкенд для React SPA. Аутентификация через Laravel Sanctum (Bearer токены).

## Роли и доступ

| Роль      | Slug       | Level | Описание          |
|-----------|------------|-------|-------------------|
| Пользователь | user    | 0     | Регистрация по умолчанию |
| Модератор | moderator  | 10    | Модерация контента |
| Администратор | admin  | 100   | Полный доступ     |

## Установка

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

## Настройка (.env)

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=dsc23ytp_agent
DB_USERNAME=dsc23ytp_agent
DB_PASSWORD="T2nQj%T*%y42"

APP_LOCALE=ru
APP_DEBUG=true
FRONTEND_URL=http://localhost:3000
```

## Миграции и сиды

```bash
php artisan migrate
php artisan db:seed
```

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/register | Регистрация (роль user по умолчанию) |
| POST | /api/login | Вход |
| POST | /api/forgot-password | Восстановление пароля (email) |
| POST | /api/reset-password | Сброс пароля (email, token, password, password_confirmation) |
| GET | /api/user | Текущий пользователь (Bearer токен) |
| POST | /api/logout | Выход (Bearer токен) |

## Валидация

Ответы валидации на русском языке (lang/ru/validation.php). Ошибки возвращаются в формате:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Поле email обязательно для заполнения."],
    "password": ["Поле password должно содержать не меньше 6 символов."]
  }
}
```

## CORS

Разрешённые origins: localhost:3000, localhost:3002, bot.siteaccess.ru. Настройка в `config/cors.php`.
