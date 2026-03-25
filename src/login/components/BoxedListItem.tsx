import type { ReactNode } from "react";
import styles from "./BoxedListItem.module.css";

export default function BoxedListItem(props: { id?: string; children: ReactNode }) {
    const { id, children } = props;
    return (
        <li id={id} className={styles.item}>
            {children}
        </li>
    );
}
