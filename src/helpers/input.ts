
/**
 * Input Handlers
 * 
 * Allow for the creation of input elements without the need for boilerplate code and management. 
 * 
 * createInput for making inputs elements,
 * createInputGroup for multiple elements (especially vecs like colors and locations).
 */

import { AnyVector, vec2, vec3, vec4 } from "../vec.js";

//-- Take inspiration from the textbook too
//-- Not complete yet, presets for quick creation. As usual, all unsupported presets ignored.
export type InputPreset = 'pi' | 'degrees';

// Common attributes and configuration options for inputs
export interface InputOptions {

    // Given this is expanded to other attributes of inputs, just like HTML, any unqualified attributes will be ignored.
    // this is regarding using any attribute for type that doesnt use it.

    /**
     * Preset values for min, max and step.
     */
    preset?: InputPreset;
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
     * Text for the label. 
     * 
     * Specifying labeltext enables {@linkcode label}.
     */
    labelText?: string;

    /**
     * Creates a label element for the input. 
     * 
     * If {@linkcode labelText} is not provided, defaults to name.
     */
    label?: boolean;

    /**
     * Allows quick addition to classlist of the input value.
     */
    inputClass?: string;

    /**
     * Provide enclosing div or not.
     */
    container?: boolean;

    /**
     * Allows quick addition to classlist of the {@linkcode container}.
     * 
     * Specifying container class enables {@linkcode container}.
     */
    containerClass?: string;

    /**
     * Element which the result will be appended to.
     */
    parent?: HTMLElement;
}


/**
 * Creates an input element of type range.
 * 
 * @param name The name of the input element and possibly the label if {@linkcode labelText} is not specified.
 * @-param container The HTMLElement holding the slider. - not yet
 * @param options Configurations and attributes for the element.
 * 
 * @returns HTMLInputElement.
 * 
 * @note This function only name functions only return the element, for more features like labelling and containers, resort to {@linkcode createInput}
 */
export function createSlider(name: string, options?: InputOptions) : HTMLInputElement {

    //-- type might not be included as that might be its own wrapper function.
    //-- handle presets
    //-- Might not add text type here cause it bloats the options and I really dont even see the need for it in this context
    const element = document.createElement('input');
    
    // element.id = name;
    element.name = name;
    element.type = 'range';

    //-- Add checks later, max>min, step reasonable, value reasonable (max-min/2)
    // min, max, step, value
    let min = options?.min ?? 0;
    let max = options?.max ?? 100;
    let step = options?.step ?? 1;
    let value = options?.value ?? 1;

    //! no known reason for max to be less than min
    //-- Maybe throw error
    if (max < min) {
        min = 0; max = 100;
    }
    if (value < min || value > max || (value % step) !== 0) { // check for ... or val not multiple of step 
        value = (max - min) / 2;
    }

    element.min = String(min);
    element.max = String(max);
    element.step = String(step);
    element.value = String(value);

    // Adding all classes to input
    if (options?.inputClass) {
        element.classList.add(...options.inputClass.split(' '));
    }

    return element;
}

/**
 * Returns an input element of type color.
 * 
 * @param name The name of the input element and possibly the label if {@linkcode labelText} is not specified.
 * @param options Configurations and attributes for the element.
 * 
 * @returns HTMLInputElement 
 * 
 * @note This function only name functions only return the element, for more features like labelling and containers, resort to {@linkcode createInput}.
 */
function createColorPicker(name: string, options?: InputOptions) : HTMLInputElement {
    
    const element = document.createElement('input');
    
    // element.id = name;
    element.name = name;
    element.type = 'color';

    // Adding all classes to input
    if (options?.inputClass) {
        element.classList.add(...options.inputClass.split(' '));
    }

    return element;
}

// Type for the createInput and createInputGroup functions
type InputResult = {
    input: HTMLElement;
    label?: HTMLElement;
    container?: HTMLElement;
    getValue: () => string | number;
    setValue: (val: string | number) => void;
}

/**
 * Returns an input element of given type. 
 * 
 * @param name The name of the input element and possibly the label if {@linkcode labelText} is not specified.
 * @param type The type of HTMLInputELement
 * @param options Configurations and attributes for the element.
 * @returns obj?
 */
export function createInput(name: string, type: string, options?: InputOptions) : InputResult {

    let element : HTMLInputElement;
    switch (type) {
        case 'range': element = createSlider(name, options); break;
        case 'color': element = createColorPicker(name, options); break;
        default: throw new Error(`Unsupported input type: ${type}`);
    }

    // result template
    const result: InputResult = {
        input: element,
        getValue: () => parseFloat(element.value),
        setValue: (val: string | number) => { element.value = String(val) },
    };

    // Adding label
    if (options?.labelText) options.label = true;
    if (options?.label) {
        const labelElem = document.createElement('label');
        labelElem.htmlFor = name;
        labelElem.innerHTML = options?.labelText ?? name;
        result.label = labelElem;
    }

    // Adding container
    if (options?.containerClass) options.container = true;
    if (options?.container || options?.containerClass){
        const containerElem = document.createElement('div');
        containerElem.append(element);
        if (result.label) containerElem.append(result.label);
        if (options.containerClass) {
            containerElem.classList.add(...options.containerClass.split(' '));
        } 
        result.container = containerElem;
    }

    return result;
}

// ! not done
/**
 * @param name The name of the input elements in the group - delineated by the axes.
 * 
 * @param axes The names of the individual elements in the group - determines the number of elements, arrangements and so on.
 * maybe add pre and post for better naming control or conventions
 * 
 * @param {HTMLElement} container The HTMLElement holding the slider div
 */
export function createInputGroup(name: string, type: string, axes : string[] = ['X', 'Y', 'Z'], options: InputOptions = {}) {
    
    const container = document.createElement('div');
    const sliders : { [key: string]: any } = {};

    //-- Now need to handle labels dynamically
    let inputMaker: (name: string, options: InputOptions) => HTMLInputElement;
    switch (type) {
        case 'range': inputMaker = (name : string, options: InputOptions) => createSlider(name, options); break;
        case 'color': inputMaker = (name : string, options: InputOptions) => createColorPicker(name, options); break;
        default: throw new Error(`Unsupported input type: ${type}`);
    }
    
    for (const axis of axes) {
        const axisName = `${name}-${axis}`;
        const axisElem = inputMaker(axisName, {
            ...options,
            labelText: `${name} ${axis}`
        });

        sliders[axis.toLowerCase()] = axisElem;
        container.appendChild(axisElem);

        //-- call for optimization
        if (options?.labelText) options.label = true;
        if (options?.label) {
            const labelElem = document.createElement('label');
            labelElem.htmlFor = axisName;
            labelElem.innerHTML = options?.labelText ?? axisName;
            //-- I now realize some may require label above or below
            //-- same as the x-rotate and rotate-x convention issue
            container.append(labelElem);
        }
        //-- need to accomodate possible containers
    }

    //-- need to review type safety
    return {
        container,
        sliders,
        getValues: () => {
            const values : { [key: string]: any } = {};
            axes.forEach(axis => {
                values[axis.toLowerCase()] = sliders[axis.toLowerCase()].getValue();
            });
            return values;
        },
        setValues: (newValues : { [key: string]: any }  ) => {
            axes.forEach(axis => {
                if (newValues[axis.toLowerCase()] !== undefined) {
                    sliders[axis.toLowerCase()].setValue(newValues[axis.toLowerCase()]);
                }
            });
        }
    };
}
//-- decorator for input functions, handle input class after, handle preset before?


/**
 * @typedef SliderGroup
 * @property {HTMLInputElement} x
 * @property {HTMLInputElement} y
 * @property {HTMLInputElement} z
 */
// Typescript
type Vec3SliderGroup = { x: HTMLInputElement, y: HTMLInputElement, z: HTMLInputElement };
type SliderGroup = { [key : string] : HTMLInputElement };

/**
 * Helper function to grab an input from the DOM so I don't have to write out so many huge casts or
 * type `document.getElementById` so many times.
 * @param {string} id
 */
export function getInput(id : string) {
    const input = document.getElementById(id);

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Element #${id} is not an <input>.`);
    }

    // See if the input has a span next to it, and attach a listener if it does
    //-- Don't think this applies in a general sense
    const sibling = input.nextElementSibling;
    if (sibling instanceof HTMLSpanElement) {
        input.addEventListener('input', () => {
            sibling.innerText = input.valueAsNumber.toFixed(2)
        });
    }

    return input;
}

/**
 * Generates a `vec3` from a group of three sliders.
 * @param {SliderGroup} inputs The x, y, and z sliders to grab the vector components from.
 * @returns {import('mv-redux').Vec3} The vector.
 */
export function vec3FromSliders({ x, y, z } : Vec3SliderGroup) {
    return vec3(
        x.valueAsNumber || 0,
        y.valueAsNumber || 0,
        z.valueAsNumber || 0,
    );
}

/**
 * More general form of {@linkcode vec3FromSliders}. Though vec3 will be the most popular case.
 * 
 * @param {SliderGroup} inputs The sliders to grab the vector components from.
 * @returns {import('mv-redux').AnyVector} The vector.
 */
export function vecFromSliders(sliders : SliderGroup) : AnyVector { //-- expect anyvector??
    //-- Dont know if this is helpful but anyways
    const values = Object.values(sliders).map(input => input.valueAsNumber || 0);
    let result : AnyVector;
    switch(values.length){
        case 4:
            return vec4(values[0], values[1], values[2], values[3]); 
        case 3:
            return vec3(values[0], values[1], values[2]); 
        case 2:
            return vec2(values[0], values[1]); 
        default:
            throw new Error(`Unsupported number of sliders: ${values.length}`);
    }
    return result;
}

/**
 * Generates a `vec3` from a hexadecimal colour string.
 * @param {string} hex
 * @returns {import('mv-redux').Vec3}
 */
export function vec3FromHex(hex : string) {
    let i = hex.startsWith('#') ? 1 : 0;
    const r = window.parseInt(hex.substring(i, i += 2), 16) / 0xFF;
    const g = window.parseInt(hex.substring(i, i += 2), 16) / 0xFF;
    const b = window.parseInt(hex.substring(i, i += 2), 16) / 0xFF;
    return vec3(r, g, b);
}