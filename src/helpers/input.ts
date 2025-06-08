// import type { Vec3 } from "../vec.js";

/**
 * Input Handlers
 * 
 */

/**
 * @param container The HTMLElement holding the slider div
 */
export function VecSliderGroup(container: HTMLElement) {
    console.log(container)
}



export type SliderPreset = 'pi' | 'degrees';

export interface SliderOptions {

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
     * Overrides the canvas's width, in CSS pixels. Does nothing if {@linkcode fullscreen} is
     * enabled.
     *
     * Defaults to 512px, or the canvas's `width` attribute if it has one.
     */
    placeholder?: number;

    /**
     * Allows quick addition to classlist of the input value.
     */
    classNames?: string;
    // Maybe add container bool too.
}

/**
 * 
 * @param container The HTMLElement holding the slider.
 * 
 * @param options Configuration for the slider.
 */
export function CreateSlider(name: string, options?: SliderOptions) {

    const rangeElem = document.createElement('input');

    // result template
    const result: {
        input: HTMLInputElement;
        label?: HTMLLabelElement;
    } = {
        input: rangeElem,
    };

    rangeElem.type = 'range';
    // rangeElem.id = name;
    rangeElem.name = name;

    //-- Add checks later, max>min, step reasonable, value reasonable (max-min/2)
    // min, max, step
    rangeElem.min = String(options?.min ?? 0);
    rangeElem.max = String(options?.max ?? 100);
    rangeElem.step = String(options?.step ?? 1);

    //-- Value to max - min / 2
    rangeElem.value = String(options?.placeholder ?? 0);

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

// export function CreateLabelledSlider(name: string, options?: SliderOptions) {

//     const container = document.createElement('div');

//     const label = document.createElement('label');
//     label.htmlFor = name;

// }



