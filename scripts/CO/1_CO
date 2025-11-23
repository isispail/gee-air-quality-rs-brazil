//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// GEOS-CF: coluna do poluente
var GEOS_POL = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');
var pollutant_band = 'CO'; // Razão de Mistura Volumétrica (mol/mol)

// Período de análise
var date_start = '2024-01-01';
var date_end = '2024-02-01';

// Para a conversão de unidades
var conversion_factor = 1e6; // g para µg


//// FUNÇÕES DE PRÉ-PROCESSAMENTO E CONVERSÃO DAS IMAGENS

// 1) CONVERSÃO DE UNIDADES (mol/m² para ppm)

var convert = function(image) {
    var POL = image.select(pollutant_band);
    
    var POL_ppm = POL.multiply(conversion_factor).rename('POL_ppm');
            
    return POL_ppm.max(0);
};


//// APLICAÇÃO DAS FUNÇÕES E GERAÇÃO DOS PRODUTOS FINAIS

// 1) COLEÇÃO BRUTA

var POL_raw = GEOS_POL
    .filterDate(date_start, date_end)
    .select(pollutant_band);

// 2) APLICA A CONVERSÃO NAS IMAGENS

var POL_ppm_col = POL_raw.map(convert);

// 3) MÉDIA TEMPORAL

var POL_ppm = POL_ppm_col.mean();


//// PARÂMETROS DE VISUALIZAÇÃO

var pollutant_vis = {
    min: 0.17641602333820045,
    max: 7.604913784256677,
    palette: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b3a62']
};

// Centraliza e recorta a imagem para a região de interesse
Map.setCenter(-53.127, -29.883, 6);
Map.addLayer(
    POL_ppm.clip(shp_rs),
    pollutant_vis,
    'GEOS-CF Monóxido de Carbono (ppm)'
);


//// EXPORTAÇÃO

Export.image.toDrive({
    image: POL_ppm.select('POL_ppm').clip(shp_rs),
    description: 'GEOS_CO_2024', // Para anos: 'GEOS_CO_20XX' // Para meses: 'GEOS_CO_XX_20XX'
    scale: 1500,
    region: shp_rs.geometry(),
    fileFormat: 'GeoTIFF',
    folder: 'CO',
    crs: 'EPSG:4674',
    maxPixels: 1e13
});
