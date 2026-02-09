{{--
  Единственная точка входа админки: Vue SPA.
  Весь UI (меню, страницы, фильтры) — в resources/js:
  layouts/AdminLayout.vue, components/admin/, pages/, router/.
  Blade-шаблоны для админки не используются.
--}}
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>TrendAgent Admin Panel</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased">
    <div id="app"></div>
</body>
</html>
