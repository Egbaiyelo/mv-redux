import { initCanvas } from '../lib/init/canvas.js';
import { CreateSlider } from '../lib/helpers/input.js'

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.7, 0.7, 0.7, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const control = document.querySelector('#controlPanel');
let { input, label } = CreateSlider("first", 'color',{label: true}, );
control.append(input);
control.append(label)

console.log(control)
console.log(input.classList)