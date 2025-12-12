//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// Importa a coleção de dados GEOS-CF (MP2,5 e temperatura)
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
var POL = 'PM25_RH35_GCC';


//// CÁLCULO DA SÉRIE DE fMÉDIAS ANUAIS

// Função para gerar as médias anuais para um ano
var annual_mean = function(year) {
    var start = ee.Date.fromYMD(year, 1, 1);
    var end = start.advance(1, 'year');
    
    var year_num = ee.Number(year).int();

    // Calcula a média de todas as imagens horárias
    var annual_imgs = GEOS_POL
        .filterDate(start, end)
        .select('PM25_RH35_GCC')
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
        
        title: 'Concentração Média Anual de MP2,5 no RS (2019-2024)',
        titleTextStyle: {
          textAlign: 'center',
          fontSize: 18,
          bold: true
        },
        
        // margens
        
        chartArea: {
            top: 40,    // reduz o espaço acima do gráfico para aproximar o título
            left: 150,   // ajusta a margem esquerda para o título do eixo Y
            height: '75%', // aumenta a altura da área de plotagem para preencher melhor
            width: '85%' // aumenta a largura da área de plotagem
        },
        
        // configuração do eixo y
        
        vAxis: {
            title: 'Concentração de MP2,5 (µg/m³)',
            viewWindow: {min: 0}, // força os valores a comecarem em 0
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
        bar: {groupWidth: '40%'}, // define a largura das colunas
        isStacked: false
    })
    
    // define o tipo de gráfico
    .setChartType('ColumnChart')
);
