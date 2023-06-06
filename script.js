async function getData(){

    const carsDataResponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carsData = await carsDataResponse.json();

    const cleaned = carsData.map(car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower 
    }))    
    .filter(car => (car.mpg != null && car.horsepower != null))

    return cleaned;
}

//modelo multicamadas
function createModel() {
    //cria um modelo sequencial
    const model = tf.sequential();

    //cria a camada de entrada
    model.add(tf.layers.dense({
        inputShape: [1], //tensor de shape 1 pq é número
        units:1, //peso para gerar maior precisao
        useBias: true //já é o default, só está reforçando
    }));

    //add uma camada de saida para facilitar na hr de interpretar os dados. É uma camada extra do tensor flow
    //nao precisa do inputShape pq ele já entende que a saída da camada anterior será usada nesta nova camada
    model.add(tf.layers.dense({
        units:1, //peso para gerar maior precisao
        useBias: true //já é o default, só está reforçando
    }));

    return model;
}

function convertToTensor(data){
    return tf.tidy(()=> {
        //embaralha os dados 
        tf.util.shuffle(data);

        //cria o tensor de entrada
        const inputs = data.map(d => d.horsepower);
        //cria um tensor de rotulos, necessario para o aprendizado supervisionado
        const labels = data.map(d => d.mpg);

        //add os dados para cada tensor
        //tanto para o tensor de entrada, como tb para o tensor de saida
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //puxo os inputs e labels maximos e minimos para calcular a normalizacao (conforme a formula)
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        //a biblioteca faz o forEach automaticamente
        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        };
    })
}

async function trainModel(model, inputs, labels){
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ["mse"], 
    });

    //seleciona o bloco, lotes, que serao treinados de cada vez
    //diferente do perceptron que treinava todos os pontos a cada momento
    const batchSize = 32;
    const epochs = 50;


    return await model.fit(inputs, labels,{
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            {name: "Performance de Treinamento"},
            ["loss","mse"],
            {height: 200, callbacks: ["onEpochEnd"]}
        ),
    });
}

async function run() {
    const data = await getData();
    const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg
    }));

    tfvis.render.scatterplot(
        {name: "Horsepower vs MPG"},
        {values},
        {
            xLabel: 'HorsePower',
            yLabel: 'MPG',
            height: 300
        }
    );

    const tensorData = convertToTensor(data);
    const { inputs, labels } = tensorData;

    await trainModel(model, inputs, labels);

    console.log("Treinamento completo");
}

const model = createModel();

document.addEventListener('DOMContentLoaded', run);

tfvis.show.modelSummary({name:'Modelo'},model);
