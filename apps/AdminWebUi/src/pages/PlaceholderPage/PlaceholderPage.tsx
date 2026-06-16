import styles from "./PlaceholderPage.module.css";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.card}>
        <p>Ця сторінка буде реалізована після підключення авторизації та API.</p>
      </div>
    </div>
  );
}
