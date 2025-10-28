# Налаштування статус бару для темної теми

## ✅ Проблема вирішена

Статус бар iOS тепер налаштований для темної теми з білими іконками, які добре видно на темному фоні додатку.

## 🔧 Що було зроблено

### 1. Оновлено App.tsx
- ✅ Додано `StatusBar` з `expo-status-bar`
- ✅ Налаштовано `style="light"` для білих іконок
- ✅ Встановлено `backgroundColor="#0D1117"` (основний фон теми)
- ✅ Додано `configureStatusBar()` функцію для додаткового налаштування

### 2. Створено хук useStatusBar
- ✅ **`src/hooks/useStatusBar.ts`** - хук для консистентного налаштування статус бару
- ✅ Автоматично використовує кольори теми
- ✅ Легко використовувати в будь-якому компоненті

### 3. Оновлено всі екрани
- ✅ **ProfileScreen** - додано StatusBar
- ✅ **HomeScreen** - додано StatusBar  
- ✅ **LoginScreen** - додано StatusBar
- ✅ **App.tsx** - глобальне налаштування

## 🎨 Налаштування статус бару

### Глобальне налаштування (App.tsx)
```typescript
import { StatusBar } from 'expo-status-bar';

<StatusBar style="light" backgroundColor="#0D1117" />
```

### Використання в компонентах
```typescript
import { useStatusBar } from '../hooks/useStatusBar';

const MyComponent = () => {
  return (
    <>
      {useStatusBar()}
      <View>
        {/* Ваш контент */}
      </View>
    </>
  );
};
```

### Ручне налаштування
```typescript
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <>
      <StatusBar 
        style="light" 
        backgroundColor={theme.colors.background.primary} 
      />
      <View>
        {/* Ваш контент */}
      </View>
    </>
  );
};
```

## 📱 Результат

Тепер статус бар:
- ✅ Має **білі іконки** (`style="light"`)
- ✅ Має **темний фон** (`#0D1117`)
- ✅ **Добре видно** на всіх екранах
- ✅ **Консистентний** по всьому додатку
- ✅ **Автоматично адаптується** до кольорів теми

## 🔄 Додаткові налаштування

### Зміна стилю статус бару
```typescript
// Для світлої теми (якщо потрібно)
<StatusBar style="dark" backgroundColor="#FFFFFF" />

// Для темної теми (поточне налаштування)
<StatusBar style="light" backgroundColor="#0D1117" />

// Автоматичне налаштування
<StatusBar style="auto" />
```

### Налаштування для Android
```typescript
import { StatusBar as RNStatusBar } from 'react-native';

// В useEffect або componentDidMount
RNStatusBar.setBarStyle('light-content', true);
RNStatusBar.setBackgroundColor('#0D1117', true);
```

## 📁 Структура файлів

```
src/hooks/
└── useStatusBar.ts          # Хук для StatusBar

App.tsx                      # Глобальне налаштування
```

## 🚀 Використання в нових екранах

При створенні нових екранів просто додайте:

```typescript
import { useStatusBar } from '../hooks/useStatusBar';

const NewScreen = () => {
  return (
    <>
      {useStatusBar()}
      <View>
        {/* Ваш контент */}
      </View>
    </>
  );
};
```

Тепер статус бар виглядає професійно на всіх екранах! 🎉
