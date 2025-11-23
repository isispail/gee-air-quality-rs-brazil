//// DEFINIÇÃO DE PARÂMETROS E COLEÇÃO DE IMAGENS

// GEOS-CF: coluna do poluente e temperatura
var GEOS_POL = ee.ImageCollection('NASA/GEOS-CF/v1/rpl/tavg1hr');
var pollutant_band = 'PM25_RH35_GCC'; // Razão de Mistura Volumétrica (mol/mol)

// Período de análise
var date_start = '2019-09-23';
var date_end = '2019-12-20';


//// PROCESSAMENTO

// 1) MÉDIA TEMPORAL

var POL_ug_m3 = GEOS_POL
    .filterDate(date_start, date_end)
    .select(pollutant_band)
    .mean();


//// PARÂMETROS DE VISUALIZAÇÃO

var pollutant_vis = {
  min: 2.300124646277597,
  max: 11.913054837157452,
  palette: ['#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#8b3a62']
};

// Centraliza e recorta a imagem para a região de interesse
Map.setCenter(-53.127, -29.883, 6);
Map.addLayer(
  POL_ug_m3.clip(shp_rs),
  pollutant_vis,
  'GEOS-CF Material Particulado 2,5 (µg/m³)');


//// EXPORTAÇÃO

Export.image.toDrive({
  image: POL_ug_m3.clip(shp_rs),
  description: 'GEOS_PM25_SPRING_2019', // Para anos: 'GEOS_PM25_20XX' // Para meses: 'GEOS_PM25_XX_20XX'
  scale: 28000,
  region: shp_rs.geometry(),
  fileFormat: 'GeoTIFF',
  folder: 'PM25',
  crs: 'EPSG:4674',
  maxPixels: 1e13
});
