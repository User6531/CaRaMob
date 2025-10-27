# React Query Setup - Завершено ✅

Проєкт успішно налаштований для використання React Query (TanStack Query).

## Що було зроблено

### 1. Встановлення залежностей
- `@tanstack/react-query` - основна бібліотека
- `@tanstack/react-query-devtools` - інструменти розробки

### 2. Створена структура файлів
```
src/
├── lib/
│   └── queryClient.ts          # Конфігурація QueryClient
├── api/
│   └── client.ts               # Базовий API клієнт
├── config/
│   └── api.ts                  # Конфігурація API
├── queries/
│   ├── queryKeys.ts            # Ключі для кешування
│   ├── userQueries.ts          # Hooks для користувачів
│   ├── carQueries.ts           # Hooks для автомобілів
│   ├── index.ts                # Експорт всіх hooks
│   └── README.md               # Документація
├── types/
│   └── api.ts                  # TypeScript типи
├── utils/
│   └── queryUtils.ts           # Утиліти для роботи з кешем
└── screens/ProfileScreen/
    ├── ProfileScreenWithReactQuery.tsx  # Приклад з повним функціоналом
    └── ProfileScreenExample.tsx         # Простий приклад
```

### 3. Оновлені файли
- `App.tsx` - додано QueryClientProvider
- `AuthContext.tsx` - додано очищення кешу при логауті

## Як використовувати

### Базовий приклад
```typescript
import { useMe } from '../queries/userQueries';

function MyComponent() {
  const { data: user, isLoading, error } = useMe();
  
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return <Text>Hello, {user?.name}!</Text>;
}
```

### Мутації
```typescript
import { useCreateUser } from '../queries/userQueries';

function CreateUserForm() {
  const createUserMutation = useCreateUser();
  
  const handleSubmit = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: (newUser) => {
        console.log('User created:', newUser);
      }
    });
  };
  
  return (
    <Button 
      title="Create User" 
      onPress={handleSubmit}
      disabled={createUserMutation.isPending}
    />
  );
}
```

## Налаштування

### 1. Змініть API URL
В `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api'  // Development
    : 'https://your-production-api.com/api',  // Production
};
```

### 2. Додайте нові endpoints
В `src/config/api.ts`:
```typescript
export const ENDPOINTS = {
  // Ваші нові endpoints
  NEW_ENDPOINT: '/new-endpoint',
} as const;
```

### 3. Створіть нові query hooks
В `src/queries/` створіть новий файл або додайте до існуючого:
```typescript
export const useNewData = () => {
  const { getAccessToken } = useAuth();
  
  return useQuery({
    queryKey: ['new-data'],
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get('/new-endpoint');
    },
  });
};
```

## Переваги React Query

1. **Автоматичне кешування** - дані зберігаються в пам'яті
2. **Фонове оновлення** - дані оновлюються автоматично
3. **Оптимістичні оновлення** - UI оновлюється до завершення запиту
4. **Повторні спроби** - автоматичні повторні спроби при помилках
5. **Інвалідація** - автоматичне оновлення пов'язаних даних
6. **TypeScript** - повна типізація
7. **DevTools** - інструменти для розробки

## Наступні кроки

1. **Замініть API URL** на ваш реальний
2. **Протестуйте** з існуючими компонентами
3. **Додайте нові query hooks** для ваших endpoints
4. **Використовуйте** в компонентах замість звичайних fetch
5. **Налаштуйте DevTools** для розробки (опціонально)

## Приклади використання

Дивіться файли:
- `src/screens/ProfileScreen/ProfileScreenExample.tsx` - простий приклад
- `src/screens/ProfileScreen/ProfileScreenWithReactQuery.tsx` - повний приклад
- `src/queries/README.md` - детальна документація

## Підтримка

React Query автоматично:
- Кешує дані
- Оновлює їх у фоновому режимі
- Повторює запити при помилках
- Інвалідує пов'язані дані при мутаціях
- Очищає кеш при логауті

Авторизація залишається на звичайних запитах, як ви і просили.
