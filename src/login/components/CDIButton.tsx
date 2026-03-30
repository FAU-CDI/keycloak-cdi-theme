import type {
    ComponentPropsWithoutRef,
    ElementType,
    PropsWithChildren,
    ReactElement
} from "react";
import styles from "./CDIButton.module.css";

function cx(...parts: Array<string | undefined | false>): string {
    return parts.filter(Boolean).join(" ");
}

export type CDIActionsProps = {
    layout?: "column" | "rowWrap";
    className?: string;
};

export function CDIActions(props: PropsWithChildren<CDIActionsProps>): ReactElement {
    const { layout = "column", className, children } = props;
    return (
        <div
            className={cx(
                layout === "rowWrap" ? styles.actionsRowWrap : styles.actionsColumn,
                className
            )}
        >
            {children}
        </div>
    );
}

type CDIButtonCommonProps = {
    secondary?: boolean;
    className?: string;
};

type CDIButtonAsProps<TAs extends ElementType> = {
    as?: TAs;
} & Omit<ComponentPropsWithoutRef<TAs>, keyof CDIButtonCommonProps | "as"> &
    CDIButtonCommonProps;

export function CDIButton<TAs extends Exclude<ElementType, "input"> = "button">(
    props: PropsWithChildren<CDIButtonAsProps<TAs>>
): ReactElement;
export function CDIButton(
    props: CDIButtonAsProps<"input"> & {
        as: "input";
        children?: never;
    }
): ReactElement;
export function CDIButton<TAs extends ElementType = "button">(
    props: PropsWithChildren<CDIButtonAsProps<TAs>>
): ReactElement {
    const { as, secondary = false, className, ...rest } = props as CDIButtonAsProps<TAs>;
    const Component = (as ?? "button") as ElementType;

    return (
        <Component
            {...(rest as ComponentPropsWithoutRef<TAs>)}
            className={cx(
                styles.button,
                secondary ? styles.secondary : styles.primary,
                className
            )}
        />
    );
}
