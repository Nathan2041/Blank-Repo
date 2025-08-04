// https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=1
// https://www.youtube.com/watch?v=ntKn5TPHHAk&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=2
// https://www.youtube.com/watch?v=DGxIcDjPzac&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=3
// https://www.youtube.com/watch?v=u5GAVdLQyIg&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh&index=4


let learningRate = 0.0005;
let pointCount = 2000;
let canvasSize = 300;
let circleSize = 5;
let trainingIterations = 60000;

let lineSlope = 2;
let lineOffset = 0.6;

import { getDataset, Point, Data } from "./database";

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
    this.bias = Math.random() * 2 - 1; // technically a weight for an input of always 1

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

    this.bias += error * learningRate;
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

  public getAccuracy(dataset: Data[]): number {
    let correct = 0;

    for (let data of dataset) {
      if (data.value === this.output([data.point.x, data.point.y])) { correct++ }
    }

    return correct / dataset.length;
  }
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

let dataset = getDataset(pointCount, lineSlope, lineOffset);

let testPerceptron = new Perceptron(Math.sign, 2n);

let accuracies: number[] = [testPerceptron.getAccuracy(dataset)];

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

  if (pointIndex == 0) { accuracies.push(testPerceptron.getAccuracy(dataset)) }
}

span.innerText = accuracies.reduce((previousString, currentValue) => { return `${previousString}\n ${currentValue}` }, '');