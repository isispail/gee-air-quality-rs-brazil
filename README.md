# Google Earth Engine Scripts: Qualidade do Ar no Rio Grande do Sul (RS), Brasil

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Earth Engine](https://img.shields.io/badge/Tech-Google%20Earth%20Engine-2196F3.svg)](https://earthengine.google.com/)
[![Language](https://img.shields.io/badge/Code-JavaScript-yellow.svg)]()
[![Status](https://img.shields.io/badge/Status-Ativo-brightgreen.svg)]()

Este repositório é um suporte técnico em Google Earth Engine (GEE) para um trabalho de pesquisa e reúne scripts em *JavaScript* desenvolvidos para a coleta de dados atmosféricos relacionados à qualidade do ar no estado do Rio Grande do Sul (Brasil). Os poluentes analisados são: material particulado (PM₂,₅), dióxido de nitrogênio (NO₂), dióxido de enxofre (SO₂), ozônio (O₃), em µg/m³; e monóxido de carbono (CO) em ppm.

> **Título:** Aplicação de técnicas de geoprocessamento na avaliação da qualidade do ar e sua influência nas Internações por doenças respiratórias no Rio Grande do Sul.
> 
> **Autores e afiliação:** PAIL, Ísis Machado; LISBÔA, Paulo Victor de Araújo Brito (2025). IFRS, Rio Grande, RS, Brasil.

## Atualizações

## Fontes de Dados e Metodologia de Conversão

Foram monitorados cinco poluentes atmosféricos, de diferentes fontes e que exigem diferentes metodologias de processamento no GEE:

### 1. Material Particulado ($\text{PM}2,5$)
* **Fonte:** NASA GEOS-CF ('NASA/GEOS-CF/v1/rpl/tavg1hr').
* **Banda:** PM25_RH35_GCC
* **Unidade:** $\mu\text{g}/\text{m}^3$

### 2. Ozônio ($\text{O}_3$)
* **Fonte:** NASA GEOS-CF ('NASA/GEOS-CF/v1/rpl/tavg1hr').
* **Banda:** O3
* **Unidade:** Razão de Mistura Volumétrica (VMR), em $\text{mol}/\text{mol}$
* **Metodologia de Conversão:** Lei dos Gases Ideais ($PV = nRT$): foram aplicadas as bandas de Temperatura ($T$) e Pressão da Superfície ($P$) do GEOS-CF para converter VMR ($\text{mol}/\text{mol}$) para concentração de massa ($\mu\text{g}/\text{m}^3$).

### 3. Monóxido de Carbono ($\text{O}_3$)
* **Fonte:** NASA GEOS-CF ('NASA/GEOS-CF/v1/rpl/tavg1hr').
* **Banda:** CO
* **Unidade:** Razão de Mistura Volumétrica (VMR), em $\text{mol}/\text{mol}$
* **Metodologia de Conversão:** Conversão VMR ($\text{mol}/\text{mol}$) para a unidade de razão de mistura ppm (partes por milhão) no ar seco, utilizando as bandas de $T$ e $P$ do GEOS-CF.

### 4. Dióxido de Nitrogênio ($\text{NO}_2$)
* **Fonte:** Copernicus Sentinel-5P ('COPERNICUS/S5P/OFFL/L3_NO2').
* **Banda:** NO2_column_number_density
* **Unidade:** Densidade da Coluna Vertical, em $\text{mol}/\text{m}^2$
* **Metodologia de Conversão:** Conversão da densidade da coluna para concentração de massa ($\mu\text{g}/\text{m}^3$). Requer a **altura da Camada Limite Planetária (PBLH)**, extraída do ECMWF ERA5, para a correção vertical.

### 5. Dióxido de Enxofre ($\text{NO}_2$)
* **Fonte:** Copernicus Sentinel-5P ('COPERNICUS/S5P/OFFL/L3_SO2').
* **Banda:** SO2_column_number_density
* **Unidade:** Densidade da Coluna Vertical, em $\text{mol}/\text{m}^2$
* **Metodologia de Conversão:** Conversão da densidade da coluna para concentração de massa ($\mu\text{g}/\text{m}^3$). Requer a **altura da Camada Limite Planetária (PBLH)**, extraída do ECMWF ERA5, para a correção vertical.

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

Para replicar os resultados e gerar as séries temporais no GEE, siga estes passos:

1.  **Acesse o GEE:** Abra o [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2.  **Copie o Código:** Selecione e copie o conteúdo de um dos arquivos `.js` (ex: `1_PM25.js`).
3.  **Defina a Região:** Certifique-se de que a variável **`shp_rs`** (referente à geometria do Rio Grande do Sul) esteja carregada no seu ambiente GEE (sob a aba *Assets*). Caso não esteja, substitua a referência por uma geometria simples (`ee.Geometry.Polygon([...])`).
4.  **Execute:** Clique em **`Run`**. O gráfico será exibido na aba *Console* e a imagem média será exibida no mapa.
5.  **Exportação:** utilize a aba **`Tasks`** para iniciar as exportações para o seu Google Drive.

## Resultados

## Licença
Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Para citar esse trabalho
Se você utilizar este código, as metodologias de conversão de unidades, ou os resultados deste repositório em seu trabalho, por favor, cite o TCC utilizando a seguinte entrada BibTeX:

```bibtex
@thesis{pail2025geoprocessamento,
  title={Aplicação de técnicas de geoprocessamento na avaliação da qualidade do ar e sua influência nas Internações por doenças respiratórias no Rio Grande do Sul},
  author={Pail, {\'I}sis Machado and Lisb{\^o}a, Paulo Victor de Ara{\'u}jo Brito},
  school={Instituto Federal de Educa\c{c}\~ao, Ci\^encia e Tecnologia do Rio Grande do Sul (IFRS)},
  year={2025},
  address={Rio Grande, RS, Brasil},
  type={Trabalho de Conclus\~ao de Curso em Geoprocessamento}
}
