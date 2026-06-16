import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./DataTable.module.css";

interface TableActionLinkProps {
  to: string;
  children: ReactNode;
}

export function TableActionLink({ to, children }: TableActionLinkProps) {
  return (
    <Link className={styles.actionLink} to={to}>
      {children}
    </Link>
  );
}

export function TableActions({ children }: { children: ReactNode }) {
  return <div className={styles.actionsCell}>{children}</div>;
}
