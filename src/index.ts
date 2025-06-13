export * from './vec.js';
export * from './mat.js';
export * from './ops.js';
export * from './transforms.js';

// =================================================================================================
// Helper functions
// =================================================================================================

/**
 * Wraps a `Float32Array` with an index and `push` method.
 *
 * @param size How large of a buffer to create.
 *
 * @deprecated The old MV library itself never uses this for anything. You should prefer using a
 * {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array Float32Array}
 * directly, which already has methods on it for setting ranges of numbers inside the buffers.
 */
export function MVbuffer(size: number) {
    return {
        buf: new Float32Array(size),
        index: 0,
        push(x: number[]) {
            for (let i = 0; i < x.length; i++) {
                this.buf[this.index + i] = x[i];
            }
            this.index += x.length;
            delete (this as any)['type'];
        },
    };
}

// -------------------------------------------------------------------------------------------------

// cspell:words Bézier

export type Curve = { type: 'curve' } & [number, number, number, number];
export type Patch = { type: 'patch' } & [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]];

/**
 * Creates a new Bézier patch of all zeroes.
 *
 * @note The {@linkcode Patch} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export function patch(): Patch {
    const out = Object.defineProperties([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ], {
        type: { value: 'patch', writable: false, enumerable: false },
    }) as Patch;

    return out;
}

/**
 * Creates a new Bézier curve of all zeroes.
 *
 * @note The {@linkcode Curve} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export function curve(): Curve {
    const out = Object.defineProperties([0, 0, 0, 0], {
        type: { value: 'curve', writable: false, enumerable: false },
    }) as Curve;

    return out;
}


/**
 * Locates all the -uniforms in the program and keys them by name.
 * 
 * WebGLUniformLocations accessible by uniformNameLocation.
 * 
 * @param {WebGL2RenderingContext} gl The WebGL context
 * @param program The WebGL program
 */
// Getting Uniforms
// A more advanced one would separate the structs but I cant really do that right now without research
export function getUniformLocators(gl: WebGL2RenderingContext, program: WebGLProgram) {

    //-- lot of typing to be done <any> but works for now
    let Locators : Record<string, WebGLUniformLocation | Record<string, WebGLUniformLocation>> | any = {};
    // Record<string, number | Record<string, number>> = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    
    for (let i = 0; i < numUniforms; i++) {
        const uniform = gl.getActiveUniform(program, i);
        // console.log(";;;;;;;;;", gl.getActiveUniformBlock(program, i));
        const uniformName = uniform?.name || "unknown";
    
        // Checking for structs
        const nameParts = uniformName.split('.');
        let uniformLocation = gl.getUniformLocation(program, uniformName);
    
        // Convention uniformNameLocation
        let uniformLocID = uniformName + "Location";
        // Handles normal uniforms.
        if (nameParts.length == 1){
            Locators[uniformLocID] = uniformLocation ?? -1;
        }
    
        // Handles structs
        if (nameParts.length > 1){
    
            let uStructLocID = nameParts[0];  // First part, i use it as a mapping to pack multiple
            let structLocationObject;

            // To make array
            if (uStructLocID.includes('[')) {

                let [uStructArrayLocID, remaining] = uStructLocID.split('[');

                let index = parseInt(remaining.split(']')[0]);

                let structArrayLocationObject  = Locators[uStructArrayLocID] ?? [];
                if (!Locators[uStructArrayLocID]) Locators[uStructArrayLocID] = []
                structArrayLocationObject[index] = Locators[uStructArrayLocID][index] ?? {};

                
                structLocationObject = structArrayLocationObject;
                let structVarID = nameParts[1] + "Location";
                structLocationObject[index][structVarID] =  uniformLocation;
                
                Locators[uStructArrayLocID] = structLocationObject;

            } else {
                // If existing map to it esle initialize
                structLocationObject = Locators[uStructLocID] ?? {};      // Initialize if not already existing
        
                let structVarID = nameParts[1] + "Location";
                structLocationObject[structVarID] =  uniformLocation; // Reassign to struct not loc {}
        
                // Reassigne, is till have normal ones in case of failure but ideally id remove the individuals
                Locators[uStructLocID] = structLocationObject;
            }
        }
    }
    return Locators;
}