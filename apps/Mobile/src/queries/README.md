# React Query Setup

Цей проєкт налаштований для використання React Query (TanStack Query) для управління серверним станом.

## Структура

```
src/
├── lib/
│   └── queryClient.ts          # Конфігурація QueryClient
├── api/
│   └── client.ts               # Базовий API клієнт
├── queries/
│   ├── queryKeys.ts            # Ключі для кешування
│   ├── userQueries.ts          # Hooks для користувачів
│   ├── carQueries.ts           # Hooks для автомобілів
│   └── index.ts                # Експорт всіх hooks
├── types/
│   └── api.ts                  # TypeScript типи для API
└── context/
    └── AuthContext.tsx         # Оновлений з підтримкою React Query
```

## Основні компоненти

### QueryClient
Налаштований з оптимальними параметрами:
- `staleTime`: 5 хвилин
- `gcTime`: 10 хвилин
- Автоматичні повторні спроби для 5xx помилок
- Відключені повторні спроби для 4xx помилок

### API Client
Базовий клієнт для HTTP запитів з:
- Автоматичним додаванням токенів авторизації
- Обробкою помилок
- TypeScript підтримкою

### Query Hooks
Готові hooks для:
- **Користувачі**: `useMe`, `useUser`, `useUsers`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`
- **Автомобілі**: `useCars`, `useCar`, `useUserCars`, `useCreateCar`, `useUpdateCar`, `useDeleteCar`

## Використання

### Базовий приклад

```typescript
import { useMe, useCreateUser } from '../queries/userQueries';

function ProfileScreen() {
  const { data: user, isLoading, error } = useMe();
  const createUserMutation = useCreateUser();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Welcome, {user?.name}!</Text>
      <Button 
        title="Create User" 
        onPress={() => createUserMutation.mutate({ name: 'New User', email: 'user@example.com' })}
      />
    </View>
  );
}
```

### Мутації з обробкою стану

```typescript
function CreateUserForm() {
  const createUserMutation = useCreateUser();

  const handleSubmit = (userData) => {
    createUserMutation.mutate(userData, {
      onSuccess: (newUser) => {
        console.log('User created:', newUser);
        // Навігація або показ повідомлення
      },
      onError: (error) => {
        console.error('Error creating user:', error);
        // Показ помилки користувачу
      }
    });
  };

  return (
    <View>
      {/* Форма */}
      <Button 
        title="Create User" 
        onPress={handleSubmit}
        disabled={createUserMutation.isPending}
      />
      {createUserMutation.isPending && <Text>Creating...</Text>}
    </View>
  );
}
```

### Оптимістичні оновлення

```typescript
function UpdateUserForm({ userId }) {
  const queryClient = useQueryClient();
  const updateUserMutation = useUpdateUser();

  const handleUpdate = (data) => {
    // Оптимістичне оновлення
    queryClient.setQueryData(queryKeys.user(userId), (oldUser) => ({
      ...oldUser,
      ...data
    }));

    updateUserMutation.mutate({ id: userId, data });
  };

  return (
    // Форма
  );
}
```

## Ключі кешування

Всі ключі кешування визначені в `queryKeys.ts`:

```typescript
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  me: ['users', 'me'] as const,
  cars: ['cars'] as const,
  car: (id: string) => ['cars', id] as const,
  userCars: (userId: string) => ['users', userId, 'cars'] as const,
} as const;
```

## Інвалідація кешу

React Query автоматично інвалідує пов'язані запити при мутаціях:

```typescript
// При створенні користувача автоматично оновляється список користувачів
const createUser = useMutation({
  mutationFn: createUserAPI,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
  }
});
```

## Налаштування API URL

Змініть `API_BASE_URL` в `src/api/client.ts` на ваш реальний URL API:

```typescript
const API_BASE_URL = 'https://your-api-url.com/api';
```

## Авторизація

API клієнт автоматично додає токени авторизації з AuthContext. При логауті весь кеш React Query очищається.

## DevTools (опціонально)

Для розробки можна додати React Query DevTools:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// В App.tsx
<QueryClientProvider client={queryClient}>
  {/* Ваші компоненти */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Переваги

1. **Автоматичне кешування** - дані кешуються і перевикористовуються
2. **Фонове оновлення** - дані оновлюються автоматично
3. **Оптимістичні оновлення** - UI оновлюється до завершення запиту
4. **Повторні спроби** - автоматичні повторні спроби при помилках
5. **Інвалідація** - автоматичне оновлення пов'язаних даних
6. **TypeScript** - повна типізація для всіх запитів
