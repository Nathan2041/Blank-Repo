let learningRate = 0.0005;
let pointCount = 200;
let canvasSize = 300;
let circleSize = 5;
let trainingIterations = 801;

let lineSlope = 2;
let lineOffset = -0.5;

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

type ActivationFunction = typeof Math.sign | typeof sigmoid;

class Perceptron {
  public length: number;
  public weights: number[];
  public bias: number;

  constructor(public activationFunction: ActivationFunction, public lengthBigInt: bigint) {
    this.length = Number(lengthBigInt);
    this.weights = new Array(this.length).fill(0);
    this.bias = 0;

    for (let i = 0; i < this.length; i++) {
      this.weights[i] = Math.random() * 2 - 1;
    }
  }

  public train(inputs: number[], target: number) {
    let guess = this.output(inputs);
    let error = target - guess;

    for (let i = 0; i < this.length; i++) {
      this.weights[i] += error * inputs[i] * learningRate;
    }
  }

  public output(inputs: number[]): number {
    if (inputs.length !== this.weights.length) { throw new Error(`on line 13 ${inputs.length} and ${this.weights.length} not equal`) }

    let sum = this.bias;

    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }

    return this.activationFunction(sum);
  }

  // \sum_{i=0}^{n} h(x_{n}*w_{n})
  // h(x) is activation function
  // n is the length of neurons of the previous layer
  // x_{n} is the value stored in the neuron n of the previous layer
  // w_{n} is the weight going from neuron in the the previous layer to the current neuron
}

class Point {
  constructor(public x: number, public y: number) {}
}

class Data {
  constructor(public value: -1 | 1, public point: Point) {}
}

function getAccuracy(dataset: Data[], perceptron: Perceptron) {
  let correct = 0;
  for (let data of dataset) {
    if (data.value === perceptron.output([data.point.x, data.point.y])) { correct++ }
  }

  return correct / dataset.length;
}

let dataset: Data[] = [];
let value: -1 | 1;

// Generate dataset at runtime
for (let i = 0; i < pointCount; i++) {
  let point = new Point(Math.random(), Math.random()); // normalized (0, 1]
  value = point.y > point.x * lineSlope + lineOffset ? -1 : 1;
  dataset.push(new Data(value, point));
}


let span = document.getElementById('span');
if (!span) { throw new Error('span invalid') }

let span2 = document.getElementById('span2');
if (!span2) { throw new Error('span2 invalid') }

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = canvasSize;
canvas.height = canvasSize;
canvas.style.border = '1px solid black';

let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.fillStyle = `rgba(0, 0, 0, ${3000 / pointCount})`;
ctx.strokeStyle = 'black';
ctx.lineWidth = 100 / pointCount;

let testPerceptron = new Perceptron(Math.sign, 2n);

let accuracies: number[] = [getAccuracy(dataset, testPerceptron)];

let inputs: [number, number];

for (let i = 0; i < dataset.length; i++) {
  inputs = [dataset[i].point.x, dataset[i].point.y];
  ctx.beginPath();
  ctx.arc(inputs[0] * canvasSize, inputs[1] * canvasSize, circleSize, 0, Math.PI * 2);

  dataset[i].value == 1 ? ctx.stroke() : ctx.fill();
}

for (let i = 0; i < trainingIterations; i++) {
  let pointIndex = i % dataset.length;
  inputs = [dataset[pointIndex].point.x, dataset[pointIndex].point.y];
  testPerceptron.train(inputs, dataset[pointIndex].value);

  if (pointIndex = 0) { accuracies.push(getAccuracy(dataset, testPerceptron)) }
}

span.innerText = accuracies.reduce((previousString, currentValue) => { return `${previousString}\n ${currentValue}` }, '');