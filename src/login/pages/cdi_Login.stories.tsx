import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "cdi/login",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

import { realm, social, localeEN, localeDE, messagesPerField } from "./cdi_stories_shared";

export const BlankLoginEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                social,
                locale: localeEN
            }}
        />
    )
};

export const BlankLoginGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                social,
                locale: localeDE
            }}
        />
    )
};

export const WithWrongPasswordEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                social,
                locale: localeEN,

                login: {
                    username: "johndoe"
                },
                messagesPerField: messagesPerField(["username", "password"], "Invalid username or password.")
            }}
        />
    )
};

export const WithWrongPasswordGerman: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                social,
                locale: localeDE,
                login: {
                    username: "johndoe"
                },
                messagesPerField: messagesPerField(["username", "password"], "Falscher Nutzername oder Passwort.")
            }}
        />
    )
};

export const WithErrorMessageEnglish: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm,
                social,
                locale: localeEN,
                message: {
                    summary: "Some random error message here - probably login with SSO failed",
                    type: "error"
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
                social,
                locale: localeDE,
                message: {
                    summary: "Irgendeine Fehlermeldung hier - wahrscheinlich ging SSO login schief",
                    type: "error"
                }
            }}
        />
    )
};
