//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// Importa a coleção de dados GEOS-CF
var GEOS_POL = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');

// Define o período da análise
var date_start = '2019-01-01';
var date_end = '2025-01-01';
  
// Separa os anos da string e gera uma lista com eles
var number_start = ee.Number.parse(date_start.substring(0, 4));
var number_end = ee.Number.parse(date_end.substring(0, 4));
var list_years = ee.List.sequence(number_start, number_end);

// Define a região de interesse e a banda utilizada
var region = shp_rs.geometry();
var POL = 'CO';


//// CÁLCULO DA SÉRIE DE MÉDIAS ANUAIS

// Conversão de unidades (VMR para ppm)

var conversion_factor = 1e6; // mol/mol para ppm

var convert = function(image) {
    return image.select(POL)
                .multiply(conversion_factor)
                .rename('POL_ppm');
};

// Aplica a conversão
var POL_col = GEOS_POL
    .filterDate(date_start, date_end)
    .map(convert);

// Função para gerar as médias anuais para um ano
var annual_mean = function(year) {
    var start = ee.Date.fromYMD(year, 1, 1);
    var end = start.advance(1, 'year');
    
    var year_num = ee.Number(year).int();

    // Calcula a média de todas as imagens horárias
    var annual_imgs = GEOS_POL
        .filterDate(start, end)
        .select(POL)
        .mean()
        .rename('POL_MEAN');

    // Retorna a imagem média anual com o timestamp correto
    return ee.Algorithms.If(
      
        // verifica se a imagem resultante possui bandas (true) ou não (false)
        annual_imgs.bandNames().size().gt(0),
        // if true: retorna a imagem com um timestamp e a propriedade YEAR
        annual_imgs
            .set('system:time_start', start.millis()) // if false: retorna nulo
            .set('YEAR', year_num),
        null
    );
};

// Cria a coleção final de imagens anuais
var POL_ANNUAL = ee.ImageCollection(
    list_years.map(annual_mean)
    
    // Filtra a coleção resultante para remover quaisquer elementos nulos
    ).filter(ee.Filter.notNull(['system:time_start']));


// ---- SERIE TEMPORAL ANUAL ----

print(
    ui.Chart.image.seriesByRegion({
      
      //// DADOS
      
        imageCollection: POL_ANNUAL,
        regions: shp_rs,
        reducer: ee.Reducer.mean(),
        scale: 28000,
        seriesProperty: 'label',
        xProperty: 'YEAR' // atribui ao eixo x os timestamps de cada imagem
        
    }).setOptions({
      
      //// ESTILO
      
        // define o título do gráfico
        
        title: 'Concentração Média Anual de CO no RS (2019-2024)',
        titleTextStyle: {
          textAlign: 'center',
          fontSize: 18,
          bold: true
        },
        
        // margens
        
        chartArea: {
            top: 40,
            left: 150,
            height: '75%',
            width: '85%'
        },
        
        // configuração do eixo y
        
        vAxis: {
            title: 'Concentração de CO (ppm)',
            viewWindow: {min: 0},
            titleTextStyle: {italic: false, bold: true}
        },
        
        // configuração do eixo x
        
        hAxis: {
            title: 'Ano',
            format: '####',
            titleTextStyle: {italic: false, bold: true}
        },
        
        // altura e largura do gráfico
        
        height: 450,
        width: 900,
        
        // configuração da legenda e estilo da linha
        
        legend: {position: 'none'},
        colors: [
            '#394e8f',
        ],
        bar: {groupWidth: '40%'},
        isStacked: false
    })
    
    // define o tipo de gráfico
    .setChartType('ColumnChart')
);
