//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// Importa a coleção de dados GEOS-CF (MP2,5 e temperatura)
var GEOS_PM25 = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');

// Define o período da análise
var date_start = '2019-01-01';
var date_end = '2025-01-01';

// Separa os anos da string e gera uma lista com eles
var number_start = ee.Number.parse(date_start.substring(0, 4));
var number_end = ee.Number.parse(date_end.substring(0, 4));
var list_years = ee.List.sequence(number_start, number_end);

// Define lista de meses (1 a 12)
var list_months = ee.List.sequence(1, 12);

// Define a região de interesse e a banda utilizada
var region = shp_rs.geometry();
var band = 'PM25_RH35_GCC';


//// CÁLCULO DA SÉRIE DE MÉDIAS MENSAIS

// Define as datas de início e fim como objetos ee.Date
var start = ee.Date(date_start);
var end = ee.Date(date_end);

// Cria uma lista de índices e mapeia para gerar a data de início de cada mês
var date_list = ee.List.sequence(0, end.difference(start, 'month').round().subtract(1))
    .map(function(i) {
        return start.advance(i, 'month');
    });

// Função para calcular a média mensal
var monthly_mean = function(start_date) {
    // Garante que o argumento seja um objeto Date
    start_date = ee.Date(start_date); 
    var end_date = start_date.advance(1, 'month');

    // Calcula a média de todas as imagens horárias para o mês específico
    var monthly_imgs = GEOS_PM25
        .filterDate(start_date, end_date)
        .select(band)
        .mean()
        .rename('PM25_MEAN');
        
    // Retorna a imagem média mensal com o timestamp correto
    return ee.Algorithms.If(
        
        // verifica se a imagem resultante possui bandas (true) ou não (false)
        monthly_imgs.bandNames().size().gt(0),
        // if true: retorna a imagem com um timestamp
        monthly_imgs.set('system:time_start', start_date.millis()),
        // if false: retorna nulo
        null
    );
};

// Cria a coleção final de imagens mensais
var PM25_MONTHLY = ee.ImageCollection(
    date_list.map(monthly_mean)
    
    // Filtra a coleção resultante para remover quaisquer elementos nulos
    ).filter(ee.Filter.notNull(['system:time_start']));
  

// ---- SERIE TEMPORAL MENSAL ----

print(
    ui.Chart.image.series({
      
      //// DADOS
      
        imageCollection: PM25_MONTHLY,
        region: shp_rs.geometry(),
        reducer: ee.Reducer.mean(),
        scale: 28000,
        
        // atribui ao eixo x os timestamps de cada imagem
        
        xProperty: 'system:time_start'
    }).setOptions({
      
      //// ESTILO
      
        // define o título do gráfico
        
        title: 'Concentração Média Mensal de MP2,5 no RS (2019-2024)',
        titleTextStyle: {
          textAlign: 'center',
          fontSize: 18
          
        },
        
        // configuração do eixo y
        
        vAxis: {
            title: 'Concentração de MP2,5 (µg/m³)',
            viewWindow: {min: 0} // forca os valores a comecarem em 0
        },
        
        // altura e largura do gráfico
        
        height: 450, 
        width: 500,
        
        // configuração do eixo x
        
        hAxis: {
            title: 'Média Mensal',
            format: 'MMM-YY' // formato mes-ano
        },
        
        // configuração da legenda e estilo da linha
        
        legend: {position: 'none'},
        colors: ['#7492e7'],
        lineWidth: 3,
        pointSize: 8
    })
    
    // define o tipo de gráfico
    .setChartType('LineChart')
);
