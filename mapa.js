var map = L.map('mapaid').setView([-9.19, -75.01], 6); // Centrado en Perú

var osm = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Estilos para los límites
var estiloDepto = { color: "#662b1dff", weight: 1.5, fill: false };
var estiloProv = { color: "#FFC300", weight: 1, fill: false };
var estiloDist = { color: "#198a1eff", weight: 0.5, fill: false };

var estiloPIAS = {
  radius: 8,
  fillColor: "#28a745",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var estiloOTROS = {
  radius: 8,
  fillColor: "#007bff",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var estiloBIB_PUBLICA = {
  radius: 8,
  fillColor: "#1f77b4", // azul
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var estiloBIB_NACIONAL = {
  radius: 8,
  fillColor: "#d62728", // rojo
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var estiloBIB_INFANTIL = {
  radius: 8,
  fillColor: "#ff7f0e", // naranja
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var estiloBIB_ESPECIALIZADA = {
  radius: 8,
  fillColor: "#2ca02c", // verde
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
var estiloBIB_OTRAS = {
  radius: 8,
  fillColor: "#9467bd", // violeta
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

var capaPIAS = L.layerGroup();
var capaOTROS = L.layerGroup();
var capaDepto = L.layerGroup();
var capaProv = L.layerGroup();
var capaDist = L.layerGroup();
var capaBIB_PUBLICA = L.layerGroup();
var capaBIB_NACIONAL = L.layerGroup();
var capaBIB_INFANTIL = L.layerGroup();
var capaBIB_ESPECIALIZADA = L.layerGroup();
var capaBIB_OTRAS = L.layerGroup();

fetch('1_RESULTADOS/0_LIMITES/depa_gdf.geojson')
    .then(r => r.json())
    .then(data => {
        L.geoJSON(data, { style: estiloDepto }).addTo(capaDepto);
    });

fetch('1_RESULTADOS/0_LIMITES/prov_gdf.geojson')
    .then(r => r.json())
    .then(data => {
        L.geoJSON(data, { style: estiloProv }).addTo(capaProv);
    });

fetch('1_RESULTADOS/0_LIMITES/dist_gdf.geojson')
    .then(r => r.json())
    .then(data => {
        L.geoJSON(data, { style: estiloDist }).addTo(capaDist);
    });

fetch('1_RESULTADOS/1_BNP/dbd_lv_gdf.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                var intervencion = feature.properties.INTERVENCIÓN;
                var punto;
                if (intervencion === "PIAS") {
                    punto = L.circleMarker(latlng, estiloPIAS).addTo(capaPIAS);
                } else if (intervencion === "OTROS") {
                    punto = L.circleMarker(latlng, estiloOTROS).addTo(capaOTROS);
                }
                if (punto) {
                    punto.bindPopup("<b>Intervención:</b> " + intervencion);
                }
                return punto;
            }
        });
    });

fetch('1_RESULTADOS/1_BNP/dgab_bi_gdf.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var tipo = feature.properties.TIPO;
        var punto;
        if (tipo === "BIBLIOTECA PÚBLICA") {
          punto = L.circleMarker(latlng, estiloBIB_PUBLICA).addTo(capaBIB_PUBLICA);
        } else if (tipo === "BIBLIOTECA NACIONAL") {
          punto = L.circleMarker(latlng, estiloBIB_NACIONAL).addTo(capaBIB_NACIONAL);
        } else if (tipo === "BIBLIOTECA INFANTIL") {
          punto = L.circleMarker(latlng, estiloBIB_INFANTIL).addTo(capaBIB_INFANTIL);
        } else if (tipo === "BIBLIOTECA ESPECIALIZADA") {
          punto = L.circleMarker(latlng, estiloBIB_ESPECIALIZADA).addTo(capaBIB_ESPECIALIZADA);
        } else {
          punto = L.circleMarker(latlng, estiloBIB_OTRAS).addTo(capaBIB_OTRAS);
        }
        if (punto) {
          punto.bindPopup("<b>Tipo:</b> " + tipo);
        }
        return punto;
      }
    });
  });

// 4. CONTROL DE CAPAS
var groupedOverlays = {
  "Actividades": {
    "🟢 Intervención PIAS": capaPIAS,
    "🔵 Otras Intervenciones": capaOTROS
  },
  "Límites": {
    "🟠 Departamentales": capaDepto,
    "🟡 Provinciales": capaProv,
    "🟢 Distritales": capaDist
  },
  "Bibliotecas": {
    "📘 Pública": capaBIB_PUBLICA,
    "🏛️ Nacional": capaBIB_NACIONAL,
    "👶 Infantil": capaBIB_INFANTIL,
    "📚 Especializada": capaBIB_ESPECIALIZADA,
    "📖 Otras": capaBIB_OTRAS
  }
};

capaDepto.addTo(map); // Mostrar por defecto si quieres

L.control.groupedLayers(null, groupedOverlays).addTo(map);
