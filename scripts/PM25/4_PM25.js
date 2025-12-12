//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// Importa a coleção de dados GEOS-CF (MP2,5 e temperatura)
var GEOS_POL = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');

// Define o período da análise
var date_start = '2019-01-01';
var date_end = '2019-12-31';
  
// Define a lista de dias a iterar (cada item é o timestamp do início do dia)
var start_millis = ee.Date(date_start).millis();
  // O limite final da sequência deve ser o início do dia seguinte (date_end + 1 dia)
  var end_millis = ee.Date(date_end).advance(0, 'day').millis(); 
  var list_days = ee.List.sequence(start_millis, end_millis, 1000 * 60 * 60 * 24);

// Define a região de interesse e a banda utilizada
var region = table.geometry();
var band = 'PM25_RH35_GCC';


//// CÁLCULO DA SÉRIE DE MÉDIAS DIÁRIAS

// Função para gerar as médias diárias para um dia
var daily_mean = function(timestamp) { // converte o timestamp de volta para data
    var start = ee.Date(timestamp);
    var end = start.advance(1, 'day');
    
    // Calcula a média de todas as imagens horárias dentro do dia
    var daily_imgs = GEOS_POL
      .filterDate(start, end)
      .select(band)
      .mean()
      .rename('POL_MEAN');

    // Retorna a imagem média diária com o timestamp correto
    return ee.Algorithms.If(
        // verifica se a imagem resultante possui bandas (true) ou não (false)
        daily_imgs.bandNames().size().gt(0),
        // if true: retorna a imagem com um timestamp
        daily_imgs.set('system:time_start', start.millis()),
        // if false: retorna nulo
        null
    );
};

// Cria a coleção final de imagens diárias
var POL_DAILY = ee.ImageCollection(
    list_days.map(daily_mean)
    
    // Filtra a coleção resultante para remover quaisquer elementos nulos
    ).filter(ee.Filter.notNull(['system:time_start']));


// ---- SERIE TEMPORAL DIÁRIA ----

print(
    ui.Chart.image.series({
        
      //// DADOS
        
        imageCollection: POL_DAILY,
        region: table.geometry(),
        reducer: ee.Reducer.mean(),
        scale: 28000,
        
        // atribui ao eixo x os timestamps de cada imagem
        
        xProperty: 'system:time_start'
    }).setOptions({
        
      //// ESTILO
        
        // define o título do gráfico
        
        title: 'Concentração Média Diária de MP2,5 no RS (2019)',
        titleTextStyle: {
          textAlign: 'center',
          fontSize: 18
          
        },
        
        // configuração do eixo y
        
        vAxis: {
             title: 'Concentração de MP2,5 (µg/m³)',
             viewWindow: {min: 0} // força os valores a comecarem em 0
        },
        
        // altura e largura do gráfico
        
        height: 450,
        width: 900,
        
        // configuração do eixo x
        
        hAxis: {
             title: 'Dia do Mês',
             format: 'dd/MM'
        },
        
        // configuração da legenda e estilo da linha
        
        legend: {position: 'none'},
        colors: ['#7492e7'],
        lineWidth: 3,
        pointSize: 0    })
    
    // define o tipo de gráfico
    .setChartType('LineChart')
);
