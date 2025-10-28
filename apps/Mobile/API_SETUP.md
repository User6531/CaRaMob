# API Setup Guide

## Проблема з API

Якщо ви бачите помилку `Expected JSON response but got: text/html`, це означає що API сервер недоступний або не працює правильно.

## Рішення

### 1. Автоматичне рішення
Додаток тепер автоматично:
- Визначає коли API недоступний
- Автоматично переходить на ProfileSetupScreen
- Показує кнопку "Пропустити перевірку" після 3 секунд

### 2. Налаштування API

#### Для розробки (Development):
```typescript
BASE_URL: 'http://localhost:5001/api'  // Docker контейнер
```

#### Для продакшну (Production):
```typescript
BASE_URL: 'https://kivvo3k-bublick-8082.exp.direct/api'
```

### 3. Запуск локального API сервера

1. Перейдіть в папку з API сервером:
```bash
cd Services/Main/MainHub.Api
```

2. Запустіть сервер:
```bash
dotnet run
```

3. Перевірте що сервер працює:
```bash
curl http://localhost:5001/api/users/me
```

### 4. Тестування без API

Якщо API недоступний, додаток:
- Покаже кнопку "Пропустити перевірку" через 3 секунди
- Автоматично перейде на ProfileSetupScreen при помилці API
- Дозволить створювати користувачів навіть без перевірки

### 5. Налагодження

Додано детальне логування помилок:
- Перевірте консоль для деталей помилок
- API клієнт показує тип помилки та відповідь сервера
- React Query автоматично повторює запити

## Структура API

### Очікувані ендпоінти:

- `GET /api/users/me` - перевірка статусу користувача
- `POST /api/users` - створення нового користувача

### Формат відповіді `/api/users/me`:
```json
{
  "isRegistered": true,
  "userData": {
    "name": "string",
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "string"
  }
}
```

### Формат запиту `POST /api/users`:
```json
{
  "name": "string",
  "email": "string"
}
```

### Формат запиту `PUT /api/users/update`:
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "email": "string"
}
```
