import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { TELEGRAM_WEB_LOGIN_URL } from "../../config/api";
import { DEFAULT_ROUTE } from "../../config/navigation";
import { useAuth } from "../../auth/AuthContext";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { isAuthenticated, loginFromRedirect } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const error = query.get("error");

  useEffect(() => {
    loginFromRedirect(query);
    if (isAuthenticated) {
      navigate(DEFAULT_ROUTE, { replace: true });
    }
  }, [isAuthenticated, loginFromRedirect, navigate, query]);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logoMark}>C</div>
        <h1 className={styles.title}>CaRaMob Admin</h1>
        <p className={styles.subtitle}>
          Увійдіть через Telegram, щоб перейти до адміністративної панелі.
        </p>

        {error ? (
          <p className={styles.error}>
            Авторизація не вдалась: <span>{error}</span>
          </p>
        ) : null}

        <Button
          fullWidth
          onClick={() => {
            window.location.href = TELEGRAM_WEB_LOGIN_URL;
          }}
        >
          Увійти через Telegram
        </Button>
      </section>
    </main>
  );
}
