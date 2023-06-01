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
        tf.util.shuffle(data);

        const inputs = data.map(d => d.horsepower);
        const labels = data.map(d => d.mpg);

        const inputTensor = rf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = rf.tensor2d(labels, [labels.length, 1]);

        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();
    })
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
    //Add code here
}

const model = createModel();

document.addEventListener('DOMContentLoaded', run);

tfvis.show.modelSummary({name:'Modelo'},model);