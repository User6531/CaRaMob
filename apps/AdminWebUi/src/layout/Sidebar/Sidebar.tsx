import { NavLink } from "react-router-dom";
import { Button } from "../../components/Button";
import { useAuth } from "../../auth/AuthContext";
import { NAV_ITEMS } from "../../config/navigation";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, hasAnyPermission, logout } = useAuth();

  if (!user) {
    return null;
  }

  const visibleItems = NAV_ITEMS.filter((item) =>
    hasAnyPermission(item.requiredPermissions),
  );

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ""}`}>
      <div className={styles.brand}>
        <div className={styles.brandInfo}>
          <div className={styles.logoMark}>C</div>
          <div>
            <p className={styles.brandTitle}>CaRaMob</p>
            <p className={styles.brandSubtitle}>Admin Panel</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Відкрити сайдбар" : "Згорнути сайдбар"}
          title={isCollapsed ? "Відкрити сайдбар" : "Згорнути сайдбар"}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isCollapsed ? (
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>
      
      <nav className={styles.nav} aria-label="Головна навігація">
        {visibleItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === "/sto"}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.navItemActive : ""]
                .filter(Boolean)
                .join(" ")
            }
            title={isCollapsed ? item.label : undefined}
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
