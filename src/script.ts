const canvas = document.createElement('canvas') as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 600;
canvas.style.border = '1px solid black';

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;