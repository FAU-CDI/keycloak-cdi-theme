import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-verify-email.ftl" });

const meta = {
    title: "cdi/login-verify-email.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

import { localeEN, localeDE, realm } from "./cdi_stories_shared";

export const DefaultEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                message: {
                    summary: "You need to verify your email to activate your account.",
                    type: "warning"
                },
                user: {
                    email: "john.doe@gmail.com"
                }
            }}
        />
    )
};

export const DefaultGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                message: {
                    summary: "Um fortzufahren, müssen ihre E-Mail Addresse verifizieren.",
                    type: "warning"
                },
                user: {
                    email: "john.doe@gmail.com"
                }
            }}
        />
    )
};

export const WithSuccessMessageEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                message: {
                    summary: "Your email has been successfully verified.",
                    type: "success"
                },
                user: {
                    email: "john.doe@gmail.com"
                },
                url: {
                    loginAction: "/mock-login-action"
                }
            }}
        />
    )
};

export const WithSuccessMessageGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                message: {
                    summary: "Ihre E-Mail Adresse wurde erfolgreich verifiziert.",
                    type: "success"
                },
                user: {
                    email: "john.doe@gmail.com"
                },
                url: {
                    loginAction: "/mock-login-action"
                }
            }}
        />
    )
};

export const WithErrorMessageEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeEN,
                message: {
                    summary: "There was an error verifying your email. Please try again.",
                    type: "error"
                },
                user: {
                    email: "john.doe@gmail.com"
                },
                url: {
                    loginAction: "/mock-login-action"
                }
            }}
        />
    )
};

export const WithErrorMessageGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                locale: localeDE,
                message: {
                    summary: "Es gab ein Problem bei der Verifizierung Ihrer E-Mail Addresse. Bitte versuchen Sie es nochmal.",
                    type: "error"
                },
                user: {
                    email: "john.doe@gmail.com"
                },
                url: {
                    loginAction: "/mock-login-action"
                }
            }}
        />
    )
};
