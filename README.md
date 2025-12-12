# Google Earth Engine Scripts: Qualidade do Ar no Rio Grande do Sul (RS), Brasil

<img width="1536" height="411" alt="Image" src="https://github.com/user-attachments/assets/a8bbd244-0442-4734-8638-f9594c3e3b69" />

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Earth Engine](https://img.shields.io/badge/Tech-Google%20Earth%20Engine-2196F3.svg)](https://earthengine.google.com/)
[![Language](https://img.shields.io/badge/Code-JavaScript-yellow.svg)]()
[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen.svg)]()

Este repositório é um suporte técnico em Google Earth Engine (GEE) para um trabalho de pesquisa que reúne *scripts* em linguagem JavaScript desenvolvidos para a coleta de dados atmosféricos relacionados à qualidade do ar no estado do Rio Grande do Sul (Brasil). Os poluentes analisados foram: material particulado fino (MP₂,₅), dióxido de nitrogênio (NO₂), dióxido de enxofre (SO₂), ozônio (O₃), em µg/m³; e monóxido de carbono (CO) em ppm.

> **Título:** Aplicação de técnicas de geoprocessamento na avaliação da qualidade do ar e sua influência nas Internações por doenças respiratórias no Rio Grande do Sul.
> 
> **Autores e afiliação:** PAIL, Ísis Machado; LISBÔA, Paulo Victor de Araújo Brito (2025). IFRS, Rio Grande, RS, Brasil.

<!--## Atualizações-->

## Fontes de Dados e Metodologia de Conversão

Foram estudados cinco poluentes atmosféricos (MP₂,₅, CO, NO₂, SO₂ e O₃) utilizando a coleção **NASA GEOS-CF ('NASA/GEOS-CF/v1/rpl/tavg1hr')**.

As unidades originais de alguns poluentes são dadas em **VMR (razão de mistura volumétrica, mol/mol)**. Para convertê-las em **concentração de massa (µg/m³)**, aplicou-se a **Lei dos Gases Ideais**.

| Poluente | Conversão |
| :--- | :--- |
| MP₂,₅ | a unidade já vem em µg/m³, então não há conversão |
| O₃, NO₂ e SO₂ | aplica-se a Lei dos Gases Ideais para obter µg/m³ |
| CO | a VMR é convertida para **ppm** multiplicando por \(10⁶\), considerando o ar seco |


## Estrutura do repositório
* Os códigos estão separados por poluente atmosférico, cada um em sua respectiva pasta dentro de scripts/.
* Os prefixos numéricos indicam a funcionalidade de cada código dentro dentro de cada análise de poluente.

| Prefixo | Exemplo | Significado |
| :--- | :--- | :--- |
| 01 | `01_PM25.js` | *Script* base para a obtenção das imagens *raster* para o período desejado: filtra e converte as unidades para cada poluente atmosférico |
| 02 | `02_PM25.js` | Gera gráficos de série temporal **anual** da concentração do poluente |
| 03 | `03_PM25.js` | Gera gráficos de série temporal **mensal/sazonal** da concentração do poluente |
| 04 | `04_PM25.js` | Gera gráficos de série temporal agregada (horária, 8h ou 24h) conforme o **tempo de exposição** de cada poluente estabelecido pelo IQAr |

## Como utilizar

1.  **Acesse o GEE:** Abra o [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2.  **Copie o Código:** Selecione e copie o conteúdo de um dos arquivos `.js` (ex: `1_PM25.js`).
3.  **Defina a Região:** Certifique-se de que a variável **`shp_rs`** (referente à geometria do Rio Grande do Sul) esteja carregada no seu ambiente GEE (sob a aba *Assets*). Caso não esteja, você pode substituir por uma geometria simples, usando (`ee.Geometry.Polygon([...])`), ou por outro *asset* de sua preferência, correspondente à área de estudo desejada.
4.  **Execute:** Clique em **`Run`**. O gráfico será exibido na aba *Console* e a imagem média será exibida no mapa.
5.  **Exportação:** utilize a aba **`Tasks`** para iniciar as exportações para o seu Google Drive.

## Resultados

Os _calendar heatmaps_ abaixo foram gerados a partir dos dados coletados pelos scripts `4_NO2.js` e `4_O3.js`.  
O cabeçalho deste repositório foi gerado com base nas imagens _raster_ obtidas pelo script `1_SO2.js`.

<img width="500" height="500" alt="Image" src="https://github.com/user-attachments/assets/b68410dd-7af8-427f-9fa3-27e873396073" />
<img width="500" height="500" alt="Image" src="https://github.com/user-attachments/assets/a8ad83eb-4d70-4a19-b9f0-d17fc365d792" />

## Licença
Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE.txt) para mais detalhes.

## Para citar esse trabalho
Este código é aberto e pode ser utilizado livremente por qualquer pessoa.  
Se você utilizar este código em pesquisas, trabalhos ou publicações, por favor cite o TCC da seguinte forma:

> PAIL, Ísis Machado; LISBÔA, Paulo Victor de Araújo Brito. Aplicação de técnicas de geoprocessamento na avaliação da qualidade do ar e sua influência nas internações por doenças respiratórias no Rio Grande do Sul. Trabalho de Conclusão de Curso em Geoprocessamento, Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Sul (IFRS), Rio Grande, RS, 2025.
