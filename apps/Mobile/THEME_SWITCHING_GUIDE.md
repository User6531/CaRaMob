# Швидка зміна кольорової палітри

Цей гід показує, як швидко змінити кольорову палітру всього додатку.

## 🎨 Доступні теми

### 1. Поточна темна тема (GitHub-стиль)
- Основний фон: `#0D1117`
- Картки: `#161B22`
- Текст: `#F0F6FC`
- Акцент: `#58A6FF`

### 2. Синя тема
- Основний фон: `#0A0E27`
- Картки: `#1A1F3A`
- Текст: `#E8F4FD`
- Акцент: `#4A9EFF`

### 3. Зелена тема
- Основний фон: `#0D1B0D`
- Картки: `#1A2B1A`
- Текст: `#E8F5E8`
- Акцент: `#4CAF50`

### 4. Фіолетова тема
- Основний фон: `#1A0D1A`
- Картки: `#2A1A2A`
- Текст: `#F5E8F5`
- Акцент: `#9C27B0`

## 🔄 Як змінити тему

### Крок 1: Відкрийте файл теми
```bash
src/styles/theme.ts
```

### Крок 2: Замініть кольорову палітру
Знайдіть об'єкт `darkTheme` та замініть його на одну з тем з `themeVariants.ts`:

```typescript
// Замість поточної теми
export const darkTheme = {
  background: {
    primary: '#0D1117',
    // ... інші кольори
  }
};

// Використайте одну з альтернативних тем
export const darkTheme = blueTheme; // або greenTheme, purpleTheme
```

### Крок 3: Оновіть CSS змінні
Оновіть об'єкт `cssVariables` відповідно до нової теми:

```typescript
export const cssVariables = {
  '--bg-primary': darkTheme.background.primary,
  '--bg-secondary': darkTheme.background.secondary,
  // ... інші змінні
};
```

### Крок 4: Перезапустіть додаток
```bash
npm start
# або
expo start
```

## 🎯 Створення власної теми

### 1. Створіть нову палітру
```typescript
export const myCustomTheme = {
  background: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    tertiary: '#YOUR_COLOR',
    quaternary: '#YOUR_COLOR',
  },
  text: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    tertiary: '#YOUR_COLOR',
    inverse: '#YOUR_COLOR',
  },
  accent: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    success: '#YOUR_COLOR',
    warning: '#YOUR_COLOR',
    error: '#YOUR_COLOR',
    info: '#YOUR_COLOR',
  },
  // ... інші кольори
};
```

### 2. Додайте до themeVariants.ts
```typescript
export const myCustomTheme = {
  // ... ваша палітра
};
```

### 3. Застосуйте в theme.ts
```typescript
export const darkTheme = myCustomTheme;
```

## 🛠️ Корисні інструменти

### Генератор кольорів
- [Coolors.co](https://coolors.co/) - для створення палітр
- [Adobe Color](https://color.adobe.com/) - для гармонійних кольорів
- [Material Design Colors](https://materialui.co/colors) - для Material Design кольорів

### Перевірка контрасту
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Переконайтеся, що контраст між текстом та фоном не менше 4.5:1

## 📱 Тестування

Після зміни теми перевірте:

1. **Читабельність тексту** - чи добре видно текст на всіх фонах
2. **Контраст кнопок** - чи виділяються кнопки на фоні
3. **Статусні кольори** - чи правильно відображаються success/warning/error
4. **Тіні та ефекти** - чи гармонійно виглядають тіні з новими кольорами

## 🎨 Приклади використання

### В компонентах
```typescript
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Текст з темою
      </Text>
    </View>
  );
};
```

### З глобальними стилями
```typescript
import { globalStyles } from '../styles/globalStyles';

const MyComponent = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textPrimary}>
        Текст з глобальними стилями
      </Text>
    </View>
  );
};
```

## ⚡ Швидкі зміни

Для швидкого тестування кольорів ви можете тимчасово змінити кольори прямо в `theme.ts`:

```typescript
// Тимчасово змініть основний акцентний колір
accent: {
  primary: '#FF6B6B', // Червоний замість синього
  // ... інші кольори
}
```

Всі компоненти автоматично оновляться!
