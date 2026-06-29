import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
