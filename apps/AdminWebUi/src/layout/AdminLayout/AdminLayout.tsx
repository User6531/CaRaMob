import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
