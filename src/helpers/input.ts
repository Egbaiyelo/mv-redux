// import type { Vec3 } from "../vec.js";

/**
 * Input Handlers
 * 
 */



// -- Take inspiration from the textbook too

export type SliderPreset = 'pi' | 'degrees';

export interface SliderOptions {

    // Given this is expanded to other attributes of inputs, just like HTML, any unqualified attributes will be ignored

    /**
     * Preset values for min, max and step.
     */
    preset?: SliderPreset;
    // You can still override presets

    /**
     * Sets the min of the range input.
     * 
     * Defaults to 0 by HTML convention.
     */
    min?: number;

    /**
     * Sets the max of the range input.
     * 
     * Defaults to 100 by HTML convention.
     */
    max?: number;

    /**
     * Sets the input element step value.
     * 
     * Defaults to 1 by HTML convention.
     */
    step?: number;

    /**
     * Label value if {@linkcode label} is enabled.
     * 
     * Defaults to Name.
     */
    labelText?: string;

    /**
     * Also creates a label element.
     */
    label?: boolean;

    /**
     * The placeholder value.
     * 
     * Defaults to halfway point between min and max
     */
    value?: number;

    /**
     * Allows quick addition to classlist of the input value.
     */
    classNames?: string;
    // Maybe add container bool too.

    //-- arrange the args

    /**
     * Element which the result would be appended to.
     */
    container?: HTMLElement;
}

/**
 * 
 * @param container The HTMLElement holding the slider.
 * 
 * @param options Configuration for the slider.
 */
export function CreateSlider(name: string, options?: SliderOptions) {

    //-- handle presets
    const rangeElem = document.createElement('input');

    // result template
    const result: {
        input: HTMLInputElement;
        getValue: () => string | number;
        setValue: (val: string | number) => void;
        label?: HTMLLabelElement;
    } = {
        input: rangeElem,
        getValue: () => parseFloat(rangeElem.value),
        setValue: (val: string | number) => { rangeElem.value = String(val) },
    };

    rangeElem.type = 'range';
    // rangeElem.id = name;
    rangeElem.name = name;

    //-- Add checks later, max>min, step reasonable, value reasonable (max-min/2)
    // min, max, step
    let min = options?.min ?? 0;
    let max = options?.max ?? 100;
    let step = options?.step ?? 1;
    let value = options?.value ?? 1;

    //! no known reason for max to be less than min
    //-- Maybe throw error
    if (max < min) {
        min = 0; max = 100;
    }
    if (value < min || value > max || (value % step) !== 0) { // or val not multiple of step 
        value = (max - min) / 2;
    }

    rangeElem.min = String(min);
    rangeElem.max = String(max);
    rangeElem.step = String(step);
    rangeElem.value = String(value);

    // Adding label
    if (options?.label) {
        const labelElem = document.createElement('label');
        labelElem.htmlFor = name;
        labelElem.innerHTML = options?.labelText ?? name;
        result.label = labelElem;
    }

    // Adding all classes to input
    if (options?.classNames) {
        rangeElem.classList.add(...options.classNames.split(' '));
    }

    return result;
}

