import { type MouseEvent, useRef, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import CdiTemplate from "../components/CdiTemplate";
import BoxedListItem from "../components/BoxedListItem";

import styles from "../components/CdiLoginPage.module.css";
import pageContent from "../components/PageContent.module.css";

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

    return (
        <CdiTemplate kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("organization.select")}>
            <form ref={formRef} action={url.loginAction} className={styles.form} method="post">
                <div id="kc-user-organizations">
                    <ul className={shouldDisplayGrid ? pageContent.selectListGrid : pageContent.selectListColumn}>
                        {organizations.map(({ alias, name }) => (
                            <BoxedListItem key={alias}>
                                <button
                                    id={`organization-${alias}`}
                                    type="button"
                                    onClick={onOrganizationClick(alias)}
                                    disabled={isSubmitting}
                                    className={pageContent.optionButton}
                                >
                                    <span className={pageContent.optionButtonTitle}>{name ?? alias}</span>
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
        <svg className={pageContent.chevronIcon} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
    );
}
