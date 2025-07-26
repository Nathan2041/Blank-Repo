const canvas = document.createElement('canvas') as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = '0';
canvas.style.display = 'block';

document.body.appendChild(canvas);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

function relu(x: number): number {
    return Math.max(0, x);
}

function tanh(x: number): number {
    return Math.tanh(x);
}

type ActivationFunction = typeof tanh | typeof relu | typeof sigmoid;

class InputNeuron {
  constructor(public weights: Float32Array) {
    weights;
  }
}

class Neuron {
  constructor(public bias: number, public weights: Float32Array) {
    bias;
    weights;
  }
}

class OutputNeuron {
  constructor(public bias: number) {
    bias;
  }
}

class NeuralNet {
  constructor(public activationFunction: ActivationFunction, public inputLayer: InputNeuron[], public hiddenLayers: Neuron[][], public outputLayer: OutputNeuron[]) {
    activationFunction;
    inputLayer;
    hiddenLayers;
    outputLayer;

    if (hiddenLayers.length == 0) {
      console.log(JSON.stringify(hiddenLayers));
      throw new Error(`invalid hiddenLayers length ${hiddenLayers.length}`);
    }

    this.initialize();
  }

  private initialize(): void {
    this.initializeInputLayer(this.inputLayer, this.hiddenLayers[0].length);
  
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      const nextLayer = this.hiddenLayers[i + 1] || this.outputLayer;
      this.initializeLayer(this.hiddenLayers[i], nextLayer.length)
    }

    this.outputLayer.forEach(neuron => {
      neuron.bias = 0;
    });
  }

  private initializeInputLayer(layer: InputNeuron[], nextLayerSize: number): void {
    const scale = this.getXavierScale(layer.length, nextLayerSize);

    layer.forEach(neuron => {
      neuron.weights = new Float32Array(nextLayerSize);
      for (let i = 0; i < nextLayerSize; i++) {
        neuron.weights[i] = (Math.random() * 2 - 1) * scale;
      }
    });
  }

  private initializeLayer(layer: Neuron[], nextLayerSize: number): void {
    const scale = this.getXavierScale(layer.length, nextLayerSize);

    layer.forEach(neuron => {
      neuron.weights = new Float32Array(nextLayerSize);
      for (let i = 0; i < nextLayerSize; i++) {
        neuron.weights[i] = (Math.random() * 2 - 1) * scale; 
      }
      neuron.bias = 0;
    });
  }

  private getXavierScale(fanIn: number, fanOut: number): number {
    return this.activationFunction == relu ? Math.sqrt(2 / fanIn) : Math.sqrt(6 / (fanIn + fanOut));
  }

  public getNeuron(position: [number, number]): InputNeuron | Neuron | OutputNeuron {
    if (position[1] > this.hiddenLayers.length + 1 || position[1] < 0) { throw new Error(`invalid position ${position}`) }
    if (position[0] == 0) {
      if (position[1] < this.inputLayer.length) { return this.inputLayer[position[1]] }
      else { throw new Error(`invalid position ${position}`) }
    }
    if (position[0] == this.hiddenLayers.length + 1) {
      if (position[1] < this.outputLayer.length) { return this.outputLayer[position[1]] }
      else { throw new Error(`invalid position ${position}`) }
    }
    if (position[1] < this.hiddenLayers[position[0]].length) { return this.hiddenLayers[position[0] - 1][position[1]] }
    else { throw new Error(`invalid position ${position}`) }
  }

  public getBias(position: [number, number]): number {
    let neuron = this.getNeuron(position);
    if (neuron instanceof InputNeuron) { return 0 }
    else { return neuron.bias }
  }

  public getWeight(position1: [number, number], position2: [number, number]): void {
    if (position2[0] !== position1[0] + 1) { throw new Error(`invalid positions ${position1}, ${position2}`) }

  }
}