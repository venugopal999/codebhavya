(function () {
    "use strict";

    const DIGITS = "0123456789ABCDEF";
    const SUPPORTED_BASES = [2, 8, 10, 16];
    const MAX_FRACTION_DIGITS = 12;

    function digitValue(character) {
        return DIGITS.indexOf(character.toUpperCase());
    }

    function normaliseInput(rawValue, base) {
        const value = String(rawValue).trim().toUpperCase();

        if (!SUPPORTED_BASES.includes(base)) {
            throw new Error(
                "Choose binary, octal, decimal or hexadecimal as the base."
            );
        }

        if (!value) {
            throw new Error("Enter a number before converting.");
        }

        let sign = 1;
        let unsigned = value;

        if (unsigned.startsWith("-") || unsigned.startsWith("+")) {
            sign = unsigned[0] === "-" ? -1 : 1;
            unsigned = unsigned.slice(1);
        }

        if (!unsigned || (unsigned.match(/\./g) || []).length > 1) {
            throw new Error(
                "Enter one valid number with at most one radix point."
            );
        }

        const parts = unsigned.split(".");
        const integerPart = parts[0] || "0";
        const fractionalPart = parts[1] || "";
        const allDigits = integerPart + fractionalPart;

        if (!allDigits) {
            throw new Error("Enter at least one digit.");
        }

        for (const character of allDigits) {
            const valueOfDigit = digitValue(character);

            if (valueOfDigit < 0 || valueOfDigit >= base) {
                throw new Error(
                    `Digit “${character}” is not valid in base ${base}.`
                );
            }
        }

        const cleanedFractionalPart =
            fractionalPart.replace(/0+$/, "");

        return {
            sign,
            integerPart:
                integerPart.replace(/^0+(?=.)/, "") || "0",
            fractionalPart: cleanedFractionalPart,
            hasFraction: cleanedFractionalPart.length > 0
        };
    }

    function parseInteger(integerPart, base) {
        let value = 0n;
        const bigBase = BigInt(base);

        for (const character of integerPart) {
            value =
                value * bigBase +
                BigInt(digitValue(character));
        }

        return value;
    }

    function integerToBase(value, base, stepList) {
        if (value === 0n) {
            stepList.push(
                `0 divided by ${base} gives the single digit 0.`
            );

            return "0";
        }

        const bigBase = BigInt(base);
        const digits = [];
        let remaining = value;
        let shownSteps = 0;

        while (remaining > 0n) {
            const quotient = remaining / bigBase;
            const remainder =
                Number(remaining % bigBase);

            digits.push(DIGITS[remainder]);

            if (shownSteps < 16) {
                stepList.push(
                    `${remaining.toString()} ÷ ${base} = ` +
                    `${quotient.toString()}, remainder ` +
                    `${DIGITS[remainder]}`
                );

                shownSteps += 1;
            }

            remaining = quotient;
        }

        if (digits.length > shownSteps) {
            stepList.push(
                `${digits.length - shownSteps} additional ` +
                "division steps are omitted for readability."
            );
        }

        stepList.push(
            "Read the remainders from bottom to top."
        );

        return digits.reverse().join("");
    }

    function parseFractionalNumber(parts, base) {
        let integerValue = 0;

        for (const character of parts.integerPart) {
            integerValue =
                integerValue * base +
                digitValue(character);

            if (!Number.isSafeInteger(integerValue)) {
                throw new Error(
                    "For fractional conversions, use an integer " +
                    "part within JavaScript’s safe range."
                );
            }
        }

        let fractionalValue = 0;
        let placeValue = base;

        for (const character of parts.fractionalPart) {
            fractionalValue +=
                digitValue(character) / placeValue;

            placeValue *= base;
        }

        return parts.sign *
            (integerValue + fractionalValue);
    }

    function formatDecimal(value) {
        if (Number.isInteger(value)) {
            return String(value);
        }

        return Number(
            value.toPrecision(13)
        ).toString();
    }

    function fractionalToBase(
        value,
        base,
        stepList
    ) {
        const sign = value < 0 ? "-" : "";
        const absoluteValue = Math.abs(value);
        const integerValue =
            Math.floor(absoluteValue);

        const integerDigits =
            integerToBase(
                BigInt(integerValue),
                base,
                stepList
            );

        let fractionalValue =
            absoluteValue - integerValue;

        if (fractionalValue < Number.EPSILON) {
            return {
                result: sign + integerDigits,
                approximate: false
            };
        }

        const fractionDigits = [];
        let approximate = false;

        stepList.push(
            `Multiply the fractional part repeatedly by ${base}.`
        );

        for (
            let index = 0;
            index < MAX_FRACTION_DIGITS;
            index += 1
        ) {
            const multiplied =
                fractionalValue * base;

            const digit =
                Math.min(
                    base - 1,
                    Math.floor(multiplied + 1e-12)
                );

            fractionDigits.push(DIGITS[digit]);

            stepList.push(
                `${formatDecimal(fractionalValue)} × ${base} = ` +
                `${formatDecimal(multiplied)} → digit ` +
                `${DIGITS[digit]}`
            );

            fractionalValue =
                multiplied - digit;

            if (
                Math.abs(fractionalValue) <
                1e-12
            ) {
                fractionalValue = 0;
                break;
            }
        }

        if (fractionalValue !== 0) {
            approximate = true;

            stepList.push(
                "The fraction continues, so the result is " +
                `limited to ${MAX_FRACTION_DIGITS} digits.`
            );
        }

        return {
            result:
                `${sign}${integerDigits}.` +
                fractionDigits.join(""),
            approximate
        };
    }

    function convert(
        rawValue,
        sourceBase,
        targetBase
    ) {
        const fromBase = Number(sourceBase);
        const toBase = Number(targetBase);

        const parts =
            normaliseInput(
                rawValue,
                fromBase
            );

        const steps = [];

        if (!SUPPORTED_BASES.includes(toBase)) {
            throw new Error(
                "Choose binary, octal, decimal or hexadecimal " +
                "as the target base."
            );
        }

        if (!parts.hasFraction) {
            const magnitude =
                parseInteger(
                    parts.integerPart,
                    fromBase
                );

            const signedDecimal =
                parts.sign < 0 &&
                magnitude !== 0n
                    ? -magnitude
                    : magnitude;

            steps.push(
                "First express the value in decimal: " +
                `${signedDecimal.toString()}.`
            );

            const conversionSteps = [];

            const convertedMagnitude =
                integerToBase(
                    magnitude,
                    toBase,
                    conversionSteps
                );

            const sign =
                parts.sign < 0 &&
                magnitude !== 0n
                    ? "-"
                    : "";

            if (toBase !== 10) {
                steps.push(...conversionSteps);
            }

            return {
                input:
                    `${sign}${parts.integerPart}`,
                fromBase,
                toBase,
                decimal:
                    signedDecimal.toString(),
                result:
                    toBase === 10
                        ? signedDecimal.toString()
                        : sign + convertedMagnitude,
                approximate: false,
                steps
            };
        }

        const decimalValue =
            parseFractionalNumber(
                parts,
                fromBase
            );

        steps.push(
            "The positional-value calculation gives " +
            `${formatDecimal(decimalValue)} in decimal.`
        );

        if (toBase === 10) {
            return {
                input:
                    `${parts.sign < 0 ? "-" : ""}` +
                    `${parts.integerPart}.` +
                    `${parts.fractionalPart}`,
                fromBase,
                toBase,
                decimal:
                    formatDecimal(decimalValue),
                result:
                    formatDecimal(decimalValue),
                approximate: false,
                steps
            };
        }

        const converted =
            fractionalToBase(
                decimalValue,
                toBase,
                steps
            );

        return {
            input:
                `${parts.sign < 0 ? "-" : ""}` +
                `${parts.integerPart}.` +
                `${parts.fractionalPart}`,
            fromBase,
            toBase,
            decimal:
                formatDecimal(decimalValue),
            result: converted.result,
            approximate:
                converted.approximate,
            steps
        };
    }

    function renderResult(
        container,
        conversion
    ) {
        container.classList.remove("is-error");
        container.replaceChildren();

        const summary =
            document.createElement("div");

        summary.className =
            "base-converter-summary";

        const label =
            document.createElement("span");

        label.textContent =
            conversion.approximate
                ? "Approximate result"
                : "Converted result";

        const value =
            document.createElement("strong");

        value.textContent =
            `${conversion.input} ` +
            `(base ${conversion.fromBase}) = ` +
            `${conversion.result} ` +
            `(base ${conversion.toBase})`;

        summary.append(label, value);
        container.appendChild(summary);

        const heading =
            document.createElement("h3");

        heading.textContent =
            "How the conversion works";

        container.appendChild(heading);

        const list =
            document.createElement("ol");

        list.className =
            "base-converter-steps";

        conversion.steps.forEach(
            function (step) {
                const item =
                    document.createElement("li");

                item.textContent = step;
                list.appendChild(item);
            }
        );

        container.appendChild(list);
    }

    function renderError(
        container,
        message
    ) {
        container.replaceChildren();
        container.classList.add("is-error");

        const strong =
            document.createElement("strong");

        strong.textContent =
            "Please check the number: ";

        container.append(
            strong,
            document.createTextNode(message)
        );
    }

    function initialiseConverter() {
        const input =
            document.getElementById(
                "baseNumberInput"
            );

        const fromSelect =
            document.getElementById(
                "fromBaseSelect"
            );

        const toSelect =
            document.getElementById(
                "toBaseSelect"
            );

        const button =
            document.getElementById(
                "baseConvertButton"
            );

        const result =
            document.getElementById(
                "baseConverterResult"
            );

        if (
            !input ||
            !fromSelect ||
            !toSelect ||
            !button ||
            !result
        ) {
            return;
        }

        function runConversion() {
            try {
                renderResult(
                    result,
                    convert(
                        input.value,
                        fromSelect.value,
                        toSelect.value
                    )
                );
            } catch (error) {
                renderError(
                    result,
                    error.message
                );
            }
        }

        button.addEventListener(
            "click",
            runConversion
        );

        input.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    runConversion();
                }
            }
        );

        document
            .querySelectorAll(
                ".base-conversion-lab " +
                ".math-example-chips button"
            )
            .forEach(
                function (example) {
                    example.addEventListener(
                        "click",
                        function () {
                            input.value =
                                example.dataset.value;

                            fromSelect.value =
                                example.dataset.from;

                            toSelect.value =
                                example.dataset.to;

                            runConversion();
                        }
                    );
                }
            );
    }

    function initialiseSolutionButtons() {
        document
            .querySelectorAll(
                "[data-solution-target]"
            )
            .forEach(
                function (button) {
                    const solution =
                        document.getElementById(
                            button.dataset
                                .solutionTarget
                        );

                    if (!solution) {
                        return;
                    }

                    solution.hidden = true;

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    button.addEventListener(
                        "click",
                        function () {
                            solution.hidden =
                                !solution.hidden;

                            button.setAttribute(
                                "aria-expanded",
                                String(
                                    !solution.hidden
                                )
                            );

                            button.textContent =
                                solution.hidden
                                    ? "Show Solution"
                                    : "Hide Solution";
                        }
                    );
                }
            );
    }

    window.CodeBhavyaBaseConverter = {
        convert
    };

    document.addEventListener(
        "DOMContentLoaded",
        initialiseConverter
    );

    document.addEventListener(
        "DOMContentLoaded",
        initialiseSolutionButtons
    );
}());
