
/**
 * Input Handlers
 * 
 * Allow for the creation of input elements without the need for boilerplate code and management. 
 * 
 * createInput for making inputs elements,
 * createInputGroup for multiple elements (especially vecs like colors and locations).
 */

//-- Take inspiration from the textbook too
//-- Not complete yet, presets for quick creation.
export type SliderPreset = 'pi' | 'degrees';

// Common attributes and configuration options for range input
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
     * The placeholder value.
     * 
     * Defaults to halfway point between min and max
     */
    value?: number;

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
    // Diff from container here as you can still have label default to name.

    // Testing these - not available yet
    /**
     * Allows quick addition to classlist of the input value.
     */
    // classNames?: string;
    // Issue here as there can be container ot not

    /**
     * Element which the result would be appended to.
     */
    // container?: HTMLElement;
}

/**
 * Creates an input range
 * 
 * @param name The name of the input element and possibly the label.
 * 
 * @param type The type of HTML element color or range.
 * 
 * @-param container The HTMLElement holding the slider. - not yet
 * 
 * @param options Configuration for the slider.
 */
export function CreateSlider(name: string, type: string = 'range', options?: SliderOptions) {

    //-- type might not be included as that might be its own wrapper function.
    //-- handle presets
    //-- Might not add text type here cause it bloats the options and I really dont even see the need for it in this context
    const element = document.createElement('input');

    // result template
    const result: {
        input: HTMLInputElement;
        getValue: () => string | number;
        setValue: (val: string | number) => void;
        label?: HTMLLabelElement;
    } = {
        input: element,
        getValue: () => parseFloat(element.value),
        setValue: (val: string | number) => { element.value = String(val) },
    };

    // element.id = name;
    element.name = name;

    if (type == 'range') {
        element.type = 'range';
    
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
    
        element.min = String(min);
        element.max = String(max);
        element.step = String(step);
        element.value = String(value);
    }
    // holding off on color for now
    // else if (type == 'color') {
    //     element.type = 'color';
    // }

    // Adding label
    if (options?.label) {
        const labelElem = document.createElement('label');
        labelElem.htmlFor = name;
        labelElem.innerHTML = options?.labelText ?? name;
        result.label = labelElem;
    }

    // Adding all classes to input
    // if (options?.classNames) {
    //     element.classList.add(...options.classNames.split(' '));
    // }

    return result;
}

