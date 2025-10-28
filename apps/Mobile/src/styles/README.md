# Dark Theme System

Ця система тем забезпечує єдину темну тему для всього додатку з використанням CSS змінних та React Native StyleSheet.

## Структура файлів

- `theme.ts` - Основна кольорова палітра та налаштування теми
- `globalStyles.ts` - Глобальні стилі для React Native
- `theme.css` - CSS змінні для веб-версії
- `useTheme.ts` - Хук для використання теми в компонентах
- `index.ts` - Експорт всіх стилів

## Використання

### В React Native компонентах

```typescript
import { useTheme } from '../hooks/useTheme';
import { globalStyles } from '../styles/globalStyles';

export default function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <Text style={globalStyles.textPrimary}>Привіт!</Text>
      <TouchableOpacity style={globalStyles.buttonPrimary}>
        <Text style={globalStyles.buttonPrimaryText}>Кнопка</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Використання кольорів теми

```typescript
const theme = useTheme();

// Пряме використання кольорів
<View style={{ backgroundColor: theme.colors.background.primary }}>
  <Text style={{ color: theme.colors.text.primary }}>Текст</Text>
</View>

// Використання з opacity
const colorWithOpacity = getColorWithOpacity(theme.colors.accent.primary, 0.5);
```

### Створення власних стилів з темою

```typescript
const styles = StyleSheet.create({
  customCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
  customText: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});
```

## Кольорова палітра

### Фонові кольори
- `background.primary` - Основний фон (`#0D1117`)
- `background.secondary` - Фон карток (`#161B22`)
- `background.tertiary` - Підняті поверхні (`#21262D`)
- `background.quaternary` - Межі та розділювачі (`#30363D`)

### Текстові кольори
- `text.primary` - Основний текст (`#F0F6FC`)
- `text.secondary` - Вторинний текст (`#8B949E`)
- `text.tertiary` - Приглушений текст (`#6E7681`)
- `text.inverse` - Текст на світлому фоні (`#0D1117`)

### Акцентні кольори
- `accent.primary` - Основний синій (`#58A6FF`)
- `accent.success` - Зелений (`#3FB950`)
- `accent.warning` - Помаранчевий (`#D29922`)
- `accent.error` - Червоний (`#F85149`)

### Інтерактивні елементи
- `interactive.primary` - Основна кнопка (`#238636`)
- `interactive.secondary` - Вторинна кнопка (`#21262D`)
- `interactive.danger` - Небезпечна кнопка (`#DA3633`)

## CSS змінні (для веб-версії)

Всі кольори доступні як CSS змінні:

```css
.my-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

## Зміна кольорової палітри

Для швидкої зміни кольорової палітри:

1. Відкрийте `theme.ts`
2. Змініть значення в об'єкті `darkTheme`
3. Оновіть `cssVariables` для веб-версії
4. Всі компоненти автоматично оновляться

## Глобальні стилі

Система включає готові глобальні стилі:

- `container` - Основний контейнер
- `pageBackground` - Фон сторінки (окрема змінна)
- `card` - Стиль картки
- `textPrimary`, `textSecondary`, `textTertiary` - Текстові стилі
- `buttonPrimary`, `buttonSecondary`, `buttonDanger` - Стилі кнопок
- `input` - Стиль полів вводу

## Додаткові утиліти

- `getColorWithOpacity()` - Додавання прозорості до кольору
- `createThemedStyles()` - Створення стилів з темою
- `spacing`, `borderRadius`, `fontSize`, `fontWeight` - Константи для розмірів
