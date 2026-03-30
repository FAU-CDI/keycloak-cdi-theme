import styles from "./Collapsible.module.css";

export type CollapsibleProps = {
    label: React.ReactNode;
    defaultOpen?: boolean;
    frozen?: boolean;
    children: React.ReactNode;
};

const frozenCallback = (event: React.MouseEvent<HTMLDetailsElement>) => {
    const details = event.currentTarget;
    if (!details.open) {
        details.open = true;
    }
};

/**
 * Collapsible section using native <details> and <summary>. Expands downward.
 */
export default function Collapsible(props: CollapsibleProps) {
    const { label, defaultOpen = false, frozen = false, children } = props;

    return (
        <details
            className={styles.collapsible}
            open={frozen || defaultOpen}
            data-frozen={frozen ? "true" : undefined}
            onToggle={frozen ? frozenCallback : undefined}
        >
            <summary aria-disabled={frozen || undefined}>{label}</summary>
            <div>{children}</div>
        </details>
    );
}
