import { NavLink } from "react-router-dom";
import { Button } from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { NAV_ITEMS } from "../../config/navigation";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { user, hasAnyPermission, logout } = useAuth();

  if (!user) {
    return null;
  }

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasAnyPermission(item.requiredPermissions),
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>C</div>
        <div>
          <p className={styles.brandTitle}>CaRaMob</p>
          <p className={styles.brandSubtitle}>Admin Panel</p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Головна навігація">
        {visibleItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.navItemActive : ""]
                .filter(Boolean)
                .join(" ")
            }
          >
            <svg
              className={styles.navIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d={item.icon} fill="currentColor" />
            </svg>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{user.displayName.charAt(0)}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.displayName}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <Button variant="ghost" fullWidth onClick={logout}>
          Вийти
        </Button>
      </div>
    </aside>
  );
}
