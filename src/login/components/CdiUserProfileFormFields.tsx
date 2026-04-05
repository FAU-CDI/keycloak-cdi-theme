import { Fragment, useEffect, useId } from "react";
import type { Dispatch } from "react";
import { assert } from "keycloakify/tools/assert";
import type { Attribute } from "keycloakify/login/KcContext";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    getButtonToDisplayForMultivaluedAttributeField,
    useUserProfileForm,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";

import styles from "./CdiUserProfileForm.module.css";
import { PasswordFieldWithReveal } from "./PasswordInputWithReveal";

export type CdiUserProfileFormFieldsProps = Omit<UserProfileFormFieldsProps, "kcClsx">;

const noopKcClsx: KcClsx = () => "";

export default function CdiUserProfileFormFields(props: CdiUserProfileFormFieldsProps) {
    const {
        kcContext,
        i18n,
        onIsFormSubmittableValueChange,
        doMakeUserConfirmPassword,
        BeforeField,
        AfterField
    } = props;
    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable, onIsFormSubmittableValueChange]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => (
                <Fragment key={attribute.name}>
                    <GroupLabel
                        attribute={attribute}
                        groupNameRef={groupNameRef}
                        i18n={i18n}
                    />
                    {BeforeField !== undefined && (
                        <BeforeField
                            attribute={attribute}
                            dispatchFormAction={
                                dispatchFormAction as Dispatch<FormAction>
                            }
                            displayableErrors={displayableErrors}
                            valueOrValues={valueOrValues}
                            kcClsx={noopKcClsx}
                            i18n={i18n}
                        />
                    )}
                    <FieldRow
                        attribute={attribute}
                        displayableErrors={displayableErrors}
                        valueOrValues={valueOrValues}
                        dispatchFormAction={dispatchFormAction}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                        i18n={i18n}
                        AfterField={AfterField}
                    />
                </Fragment>
            ))}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: { current: string };
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const { attribute, groupNameRef, i18n } = props;
    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";
        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);
            const group = attribute.group;
            return (
                <div
                    className={styles.groupSection}
                    {...Object.fromEntries(
                        Object.entries(group.html5DataAnnotations).map(([key, value]) => [
                            `data-${key}`,
                            value
                        ])
                    )}
                >
                    {(() => {
                        const groupDisplayHeader = group.displayHeader ?? "";
                        const groupHeaderText =
                            groupDisplayHeader !== ""
                                ? advancedMsg(groupDisplayHeader)
                                : group.name;
                        return (
                            <div>
                                <label
                                    id={`header-${group.name}`}
                                    className={styles.groupHeader}
                                >
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = group.displayDescription ?? "";
                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(
                                groupDisplayDescription
                            );
                            return (
                                <div className={styles.labelWrapper}>
                                    <label
                                        id={`description-${group.name}`}
                                        className={styles.fieldLabel}
                                    >
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            );
        }
    }
    return null;
}

function FieldRow(props: {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    valueOrValues: string | string[];
    dispatchFormAction: (action: FormAction) => void;
    doMakeUserConfirmPassword: boolean;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
    AfterField?: CdiUserProfileFormFieldsProps["AfterField"];
}) {
    const {
        attribute,
        displayableErrors,
        valueOrValues,
        dispatchFormAction,
        doMakeUserConfirmPassword,
        i18n,
        AfterField
    } = props;
    const { advancedMsg } = i18n;

    const fieldId = useId();
    const helpBeforeId = `${fieldId}-help-before`;
    const helpAfterId = `${fieldId}-help-after`;

    const hideFormGroup =
        attribute.annotations.inputType === "hidden" ||
        (attribute.name === "password-confirm" && !doMakeUserConfirmPassword);

    return (
        <div
            className={`${styles.formGroup}${hideFormGroup ? ` ${styles.formGroupHidden}` : ""}`}
        >
            <div className={styles.labelWrapper}>
                <label htmlFor={fieldId} className={styles.fieldLabel}>
                    {advancedMsg(attribute.displayName ?? "")}
                </label>
                {attribute.required ? " *" : null}
            </div>
            <div className={styles.inputWrapper}>
                {attribute.annotations.inputHelperTextBefore !== undefined && (
                    <div
                        className={styles.helperText}
                        id={helpBeforeId}
                        aria-live="polite"
                    >
                        {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                    </div>
                )}
                <InputFieldByType
                    fieldId={fieldId}
                    attribute={attribute}
                    valueOrValues={valueOrValues}
                    displayableErrors={displayableErrors}
                    dispatchFormAction={dispatchFormAction}
                    i18n={i18n}
                />
                <FieldErrors
                    attribute={attribute}
                    displayableErrors={displayableErrors}
                    fieldIndex={undefined}
                />
                {attribute.annotations.inputHelperTextAfter !== undefined && (
                    <div
                        className={styles.helperText}
                        id={helpAfterId}
                        aria-live="polite"
                    >
                        {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                    </div>
                )}
                {AfterField !== undefined && (
                    <AfterField
                        attribute={attribute}
                        dispatchFormAction={dispatchFormAction as Dispatch<FormAction>}
                        displayableErrors={displayableErrors}
                        valueOrValues={valueOrValues}
                        kcClsx={noopKcClsx}
                        i18n={i18n}
                    />
                )}
            </div>
        </div>
    );
}

function FieldErrors(props: {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex: number | undefined;
}) {
    const { attribute, fieldIndex } = props;
    const displayableErrors = props.displayableErrors.filter(
        error => error.fieldIndex === fieldIndex
    );
    if (displayableErrors.length === 0) {
        return null;
    }
    return (
        <span
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
            className={styles.fieldError}
            aria-live="polite"
        >
            {displayableErrors
                .filter(error => error.fieldIndex === fieldIndex)
                .map(({ errorMessage }, i, arr) => (
                    <Fragment key={i}>
                        {errorMessage}
                        {arr.length - 1 !== i ? <br /> : null}
                    </Fragment>
                ))}
        </span>
    );
}

function InputFieldByType(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const { attribute, valueOrValues, fieldId } = props;
    switch (attribute.annotations.inputType) {
        case "hidden":
            return (
                <input
                    type="hidden"
                    name={attribute.name}
                    value={typeof valueOrValues === "string" ? valueOrValues : ""}
                />
            );
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((_, i) => (
                            <MultivaluedInputRow
                                key={i}
                                fieldIndex={i}
                                firstFieldId={fieldId}
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={props.displayableErrors}
                                dispatchFormAction={props.dispatchFormAction}
                                i18n={props.i18n}
                            />
                        ))}
                    </>
                );
            }
            if (attribute.name === "password" || attribute.name === "password-confirm") {
                assert(typeof valueOrValues === "string");
                return (
                    <ProfilePasswordInput
                        fieldId={fieldId}
                        attribute={attribute}
                        valueOrValues={valueOrValues}
                        displayableErrors={props.displayableErrors}
                        dispatchFormAction={props.dispatchFormAction}
                        i18n={props.i18n}
                    />
                );
            }
            return <InputTag {...props} fieldIndex={undefined} fieldId={fieldId} />;
        }
    }
}

function ProfilePasswordInput(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string;
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const {
        fieldId,
        attribute,
        valueOrValues,
        displayableErrors,
        dispatchFormAction,
        i18n
    } = props;
    const { advancedMsgStr } = i18n;
    const hasError =
        displayableErrors.find(e => e.fieldIndex === undefined) !== undefined;

    return (
        <PasswordFieldWithReveal
            inputId={fieldId}
            hasFieldError={hasError}
            i18n={i18n}
            inputProps={{
                name: attribute.name,
                value: valueOrValues,
                "aria-invalid": hasError,
                disabled: attribute.readOnly,
                autoComplete: attribute.autocomplete,
                placeholder:
                    attribute.annotations.inputTypePlaceholder === undefined
                        ? undefined
                        : advancedMsgStr(attribute.annotations.inputTypePlaceholder),
                pattern: attribute.annotations.inputTypePattern,
                size:
                    attribute.annotations.inputTypeSize === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeSize}`, 10),
                maxLength:
                    attribute.annotations.inputTypeMaxlength === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10),
                minLength:
                    attribute.annotations.inputTypeMinlength === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeMinlength}`, 10),
                max: attribute.annotations.inputTypeMax,
                min: attribute.annotations.inputTypeMin,
                step: attribute.annotations.inputTypeStep,
                ...Object.fromEntries(
                    Object.entries(attribute.html5DataAnnotations ?? {}).map(
                        ([key, value]) => [`data-${key}`, value]
                    )
                ),
                onChange: event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: event.target.value
                    }),
                onBlur: () =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
            }}
        />
    );
}

function MultivaluedInputRow(props: {
    fieldIndex: number;
    firstFieldId: string;
    attribute: Attribute;
    valueOrValues: string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const {
        fieldIndex,
        firstFieldId,
        attribute,
        valueOrValues,
        displayableErrors,
        dispatchFormAction,
        i18n
    } = props;
    const fallbackId = useId();
    const inputId = fieldIndex === 0 ? firstFieldId : fallbackId;

    return (
        <InputTag
            fieldId={inputId}
            attribute={attribute}
            valueOrValues={valueOrValues}
            displayableErrors={displayableErrors}
            dispatchFormAction={dispatchFormAction}
            i18n={i18n}
            fieldIndex={fieldIndex}
        />
    );
}

function InputTag(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
    fieldIndex: number | undefined;
}) {
    const {
        attribute,
        fieldIndex,
        dispatchFormAction,
        valueOrValues,
        i18n,
        displayableErrors,
        fieldId
    } = props;
    const { advancedMsgStr } = i18n;

    const inputType = (() => {
        const { inputType } = attribute.annotations;
        if (inputType?.startsWith("html5-")) {
            return inputType.slice(6);
        }
        return inputType ?? "text";
    })();

    return (
        <>
            <input
                type={inputType}
                id={fieldId}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }
                    assert(typeof valueOrValues === "string");
                    return valueOrValues;
                })()}
                aria-invalid={
                    displayableErrors.find(error => error.fieldIndex === fieldIndex) !==
                    undefined
                }
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined
                        ? undefined
                        : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                pattern={attribute.annotations.inputTypePattern}
                size={
                    attribute.annotations.inputTypeSize === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeSize}`, 10)
                }
                maxLength={
                    attribute.annotations.inputTypeMaxlength === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
                }
                minLength={
                    attribute.annotations.inputTypeMinlength === undefined
                        ? undefined
                        : parseInt(`${attribute.annotations.inputTypeMinlength}`, 10)
                }
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(
                    Object.entries(attribute.html5DataAnnotations ?? {}).map(
                        ([key, value]) => [`data-${key}`, value]
                    )
                )}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);
                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }
                                    return value;
                                });
                            }
                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex
                    })
                }
            />
            {fieldIndex !== undefined ? (
                <>
                    <FieldErrors
                        attribute={attribute}
                        displayableErrors={displayableErrors}
                        fieldIndex={fieldIndex}
                    />
                    <AddRemoveButtonsMultiValuedAttribute
                        attribute={attribute}
                        values={valueOrValues as string[]}
                        fieldIndex={fieldIndex}
                        dispatchFormAction={dispatchFormAction}
                        i18n={i18n}
                    />
                </>
            ) : null}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
    const { msg } = i18n;
    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
        attribute,
        values,
        fieldIndex
    });
    const baseId = useId();
    const removeId = `${baseId}-remove-${attribute.name}-${fieldIndex + 1}`;
    const addId = `${baseId}-add-${attribute.name}-${fieldIndex + 1}`;

    return (
        <>
            {hasRemove && (
                <>
                    <button
                        id={removeId}
                        type="button"
                        className={styles.inlineLinkButton}
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </button>
                    {hasAdd ? "\u00A0|\u00A0" : null}
                </>
            )}
            {hasAdd && (
                <button
                    id={addId}
                    type="button"
                    className={styles.inlineLinkButton}
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </button>
            )}
        </>
    );
}

function InputTagSelects(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const { attribute, dispatchFormAction, i18n, valueOrValues, fieldId } = props;
    const { inputType } = attribute.annotations;
    assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");
    const classDiv =
        inputType === "select-radiobuttons" ? styles.radioRow : styles.checkboxRow;
    const classInput =
        inputType === "select-radiobuttons" ? styles.radioInput : styles.checkboxInput;
    const classLabel =
        inputType === "select-radiobuttons" ? styles.radioLabel : styles.checkboxLabel;

    const options = (() => {
        const { inputOptionsFromValidation } = attribute.annotations;
        if (inputOptionsFromValidation !== undefined) {
            const validators = attribute.validators as Record<
                string,
                { options?: string[] } | undefined
            >;
            const validator = validators[inputOptionsFromValidation];
            if (validator?.options !== undefined) {
                return validator.options;
            }
        }
        return attribute.validators.options?.options ?? [];
    })();

    return (
        <>
            {options.map((option: string) => {
                const optionId = `${fieldId}-${option}`;
                return (
                    <div key={option} className={classDiv}>
                        <input
                            type={
                                inputType === "select-radiobuttons" ? "radio" : "checkbox"
                            }
                            id={optionId}
                            name={attribute.name}
                            value={option}
                            className={classInput}
                            aria-invalid={props.displayableErrors.length !== 0}
                            disabled={attribute.readOnly}
                            checked={
                                valueOrValues instanceof Array
                                    ? valueOrValues.includes(option)
                                    : valueOrValues === option
                            }
                            onChange={event =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: (() => {
                                        const isChecked = event.target.checked;
                                        if (valueOrValues instanceof Array) {
                                            const newValues = [...valueOrValues];
                                            if (isChecked) {
                                                newValues.push(option);
                                            } else {
                                                newValues.splice(
                                                    newValues.indexOf(option),
                                                    1
                                                );
                                            }
                                            return newValues;
                                        }
                                        return event.target.checked ? option : "";
                                    })()
                                })
                            }
                            onBlur={() =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined
                                })
                            }
                        />
                        <label
                            htmlFor={optionId}
                            className={`${classLabel}${
                                attribute.readOnly
                                    ? ` ${inputType === "select-radiobuttons" ? styles.radioLabelDisabled : styles.checkboxLabelDisabled}`
                                    : ""
                            }`}
                        >
                            {inputLabel(i18n, attribute, option)}
                        </label>
                    </div>
                );
            })}
        </>
    );
}

function TextareaTag(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
}) {
    const { attribute, dispatchFormAction, displayableErrors, valueOrValues, fieldId } =
        props;
    assert(typeof valueOrValues === "string");

    return (
        <textarea
            id={fieldId}
            name={attribute.name}
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            cols={
                attribute.annotations.inputTypeCols === undefined
                    ? undefined
                    : parseInt(`${attribute.annotations.inputTypeCols}`, 10)
            }
            rows={
                attribute.annotations.inputTypeRows === undefined
                    ? undefined
                    : parseInt(`${attribute.annotations.inputTypeRows}`, 10)
            }
            maxLength={
                attribute.annotations.inputTypeMaxlength === undefined
                    ? undefined
                    : parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
            }
            value={valueOrValues}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: {
    fieldId: string;
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: (action: FormAction) => void;
    i18n: CdiUserProfileFormFieldsProps["i18n"];
}) {
    const {
        attribute,
        dispatchFormAction,
        displayableErrors,
        i18n,
        valueOrValues,
        fieldId
    } = props;
    const isMultiple = attribute.annotations.inputType === "multiselect";

    const options = (() => {
        const { inputOptionsFromValidation } = attribute.annotations;
        if (inputOptionsFromValidation !== undefined) {
            assert(typeof inputOptionsFromValidation === "string");
            const validators = attribute.validators as Record<
                string,
                { options?: string[] } | undefined
            >;
            const validator = validators[inputOptionsFromValidation];
            if (validator?.options !== undefined) {
                return validator.options;
            }
        }
        return attribute.validators.options?.options ?? [];
    })();

    return (
        <select
            id={fieldId}
            name={attribute.name}
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            multiple={isMultiple}
            size={
                attribute.annotations.inputTypeSize === undefined
                    ? undefined
                    : parseInt(`${attribute.annotations.inputTypeSize}`, 10)
            }
            value={valueOrValues as string | string[]}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        if (isMultiple) {
                            return Array.from(event.target.selectedOptions).map(
                                option => option.value
                            );
                        }
                        return event.target.value;
                    })()
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        >
            {!isMultiple && <option value="" />}
            {options.map((option: string) => (
                <option key={option} value={option}>
                    {inputLabel(i18n, attribute, option)}
                </option>
            ))}
        </select>
    );
}

function inputLabel(
    i18n: CdiUserProfileFormFieldsProps["i18n"],
    attribute: Attribute,
    option: string
) {
    const { advancedMsg } = i18n;
    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;
        return advancedMsg((inputOptionLabels[option] ?? option) as string);
    }
    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(
            `${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`
        );
    }
    return option;
}
