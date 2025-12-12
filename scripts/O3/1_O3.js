//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// GEOS-CF: coluna do poluente
var GEOS_POL = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');
var pollutant_band = 'O3'; // Razão de Mistura Volumétrica (mol/mol)
var temp_band = 'T'; // Temperatura da Superfície (K)
var press_band = 'PS'; // Pressão da Superfície (Pa)

// Período de análise
var date_start = '2024-01-01';
var date_end = '2024-02-01';

// Para a conversão de unidades
var molar_mass = 48; // g/mol
var R = 8.3144621; // cte dos gases ideais (J / (mol * K))
var conversion_factor = 1e6; // g para µg


//// FUNÇÕES DE PRÉ-PROCESSAMENTO E CONVERSÃO DAS IMAGENS

// 1) CONVERSÃO DE UNIDADES (mol/m² para µg/m³)

var convert = function(image) {
    var POL = image.select(pollutant_band);
    var T = image.select(temp_band);
    var P = image.select(press_band);
    
    var POL_ug_m3 = POL.expression(
      
    '(POL * P * MM) / (R * T) * F', {
        'POL': POL,
        'P': P,
        'T': T,
        'R': R,
        'MM': molar_mass,
        'F': conversion_factor
            
    }).rename('POL_ug_m3');

    return POL_ug_m3.max(0);
};


//// APLICAÇÃO DAS FUNÇÕES E GERAÇÃO DOS PRODUTOS FINAIS

// 1) COLEÇÃO BRUTA

var POL_raw = GEOS_POL
    .filterDate(date_start, date_end)
    .select(pollutant_band, temp_band, press_band);

// 2) APLICA A CONVERSÃO NAS IMAGENS

var POL_ug_m3_col = POL_raw.map(convert);

// 3) MÉDIA TEMPORAL

var POL_ug_m3 = POL_ug_m3_col.mean();


//// PARÂMETROS DE VISUALIZAÇÃO

var pollutant_vis = {
    min: 0.17641602333820045,
    max: 7.604913784256677,
    palette: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b3a62']
};

// Centraliza e recorta a imagem para a região de interesse
Map.setCenter(-53.127, -29.883, 6);
Map.addLayer(
    POL_ug_m3.clip(shp_rs),
    pollutant_vis,
    'GEOS-CF Ozônio (µg/m³)'
);


//// EXPORTAÇÃO

Export.image.toDrive({
    image: POL_ug_m3.select('POL_ug_m3').clip(shp_rs),
    description: 'GEOS_O3_2024', // Para anos: 'GEOS_O3_20XX' // Para meses: 'GEOS_O3_XX_20XX'
    scale: 28000,
    region: shp_rs.geometry(),
    fileFormat: 'GeoTIFF',
    folder: 'O3',
    crs: 'EPSG:4674',
    maxPixels: 1e13
});
