import { type MouseEvent, useRef, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import MessageAlert from "../components/MessageAlert";
import BoxedListItem from "../components/BoxedListItem";

import styles from "../components/CdiLoginPage.module.css";

const listColumnStyle = {
    margin: 0,
    padding: 0,
    listStyle: "none" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem"
};

const listGridStyle = {
    margin: 0,
    padding: 0,
    listStyle: "none" as const,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(12rem, 1fr))",
    gap: "0.75rem"
};

const optionButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    width: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
    color: "var(--cdi-foreground)",
    font: "inherit"
};

export default function SelectOrganization(props: PageProps<Extract<KcContext, { pageId: "select-organization.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { url, user } = kcContext;

    const { msg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const organizationInputRef = useRef<HTMLInputElement>(null);

    const onOrganizationClick = (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!organizationInputRef.current || !formRef.current) {
            return;
        }

        organizationInputRef.current.value = organizationAlias;
        setIsSubmitting(true);

        if (typeof formRef.current.requestSubmit === "function") {
            formRef.current.requestSubmit();
            return;
        }

        formRef.current.submit();
    };

    const organizations = user.organizations ?? [];
    const shouldDisplayGrid = organizations.length > 3;

    const showMessage = kcContext.message !== undefined;
    const messageNode =
        showMessage && kcContext.message ? (
            <MessageAlert type={kcContext.message.type} summary={kcContext.message.summary} />
        ) : null;

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("organization.select")}>
            {messageNode}

            <form ref={formRef} action={url.loginAction} className={styles.form} method="post">
                <div id="kc-user-organizations">
                    <ul style={shouldDisplayGrid ? listGridStyle : listColumnStyle}>
                        {organizations.map(({ alias, name }) => (
                            <BoxedListItem key={alias}>
                                <button
                                    id={`organization-${alias}`}
                                    type="button"
                                    onClick={onOrganizationClick(alias)}
                                    disabled={isSubmitting}
                                    style={optionButtonStyle}
                                >
                                    <span style={{ fontWeight: 600 }}>{name ?? alias}</span>
                                    <ChevronRightIcon />
                                </button>
                            </BoxedListItem>
                        ))}
                    </ul>
                </div>
                <input ref={organizationInputRef} type="hidden" name="kc.org" />
            </form>
        </CdiTemplate>
    );
}

function ChevronRightIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden
            style={{ flexShrink: 0 }}
        >
            <path
                fill="currentColor"
                d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
            />
        </svg>
    );
}
