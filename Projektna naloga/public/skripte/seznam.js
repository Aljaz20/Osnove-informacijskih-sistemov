// Objekt z zemljevidom
var mapa;

// objekt, ki hrani pot
var pot;
var tockePoti = [];

// Seznam z oznakami na zemljevidu
var markerji = [];

// GPS koordinate FRI
const FRI_LAT = 46.05004;
const FRI_LNG = 14.46931;


// Premakni destinacijo iz seznama (desni del) v košarico (levi del)
const premakniDestinacijoIzSeznamaVKosarico = (id, ime, lat, lng, azuriraj) => {
  if (azuriraj)
    $.get("/kosarica/" + id, (podatki) => {
      /* Dodaj izbrano destinacijo v sejo */
    });

  // Dodaj destnacijo v desni seznam
  $("#kosarica").append(
    "<div id='" +
      id +
      "' class='destinacija'> \
             <button type='button' class='btn btn-light btn-sm'> \
               <i class='fas fa-minus'></i> \
                 <strong><span class='ime' dir='ltr'>" +
      ime +
      "</span></strong> \
            <!--<i class='fas fa-signal'></i>--><span style='display: none' class='lat'>" +
      lat +
      "</span>\
            <!--<i class='far fa-clock'></i>--><span class='lng' style='display: none'>" +
      lng +
      "</span><!-- min -->\
              </button> \
                <input type='button' onclick='podrobnostiDestinacije(" +
      id +
      ")' class='btn btn-secondary btn-sm' value='...'> \
              </div>"
  );

  // Dogodek ob kliku na destinacijo v košarici (na desnem seznamu)
  $("#kosarica #" + id + " button").click(function () {
    let destinacija_kosarica = $(this);
    $.get("/kosarica/" + id, (podatki) => {
      /* Odstrani izbrano destinacijo iz seje */
      // Če je košarica prazna, onemogoči gumbe za pripravo računa
      if (!podatki || podatki.length == 0) {
        $("#racun_html").prop("disabled", true);
        $("#racun_xml").prop("disabled", true);
      }
    });
    // Izbriši destinacijo iz desnega seznama in iz mape
    
    const sirina = destinacija_kosarica.find(".lat").text();
    const dolz = destinacija_kosarica.find(".lng").text();
    const mk = markerji.find((m) => m.getLatLng().lat == sirina && m.getLatLng().lng == dolz);
    const indeks = markerji.indexOf(mk);
    mapa.removeLayer(mk);
    let temp = tockePoti.slice(0, indeks-1).concat(tockePoti.slice(indeks));
    tockePoti = [];
    tockePoti = temp;
    temp = [];
    temp = markerji.slice(0, indeks).concat(markerji.slice(indeks + 1));
    markerji = [];
    markerji = temp;
    prikazPoti();
    destinacija_kosarica.parent().remove();
    // Pokaži destinacijo v levem seznamu
    $("#destinacije #" + id).show();
  });

  // Skrij destinacijo v levem seznamu
  $("#destinacije #" + id).hide();
  // Ker košarica ni prazna, omogoči gumbe za pripravo računa
  $("#racun_html").prop("disabled", false);
  $("#racun_xml").prop("disabled", false);
};

// Vrni več podrobnosti destinacije
const podrobnostiDestinacije = (id) => {
  $.get("/vec-o-destinaciji-api/" + id, (podatki) => {
    let tekst = "";
    
    if(podatki === "napaka") {
        tekst = "<div>Podatki niso na voljo.</div>";
      }else{
        tekst= "<div><b>Celoten naslov: </b>";
        for(let i = 0; i < podatki.address.length; i++){
          tekst += podatki.address[i].localname + ", ";
        }
        tekst += "</div>";
        if(podatki.extratags.website !== undefined){
          tekst += "<div><b>URL naslov: </b><a href=" + podatki.extratags.website + ">spletno mesto</a></div>";
        }
        tekst += "<div><b>Datum vnosa: </b>" + podatki.indexed_date +"</div>";
    }

    $("#sporocilo").html(
      "<div class='alert alert-info'><small>"+ tekst + "</small></div>"
    );
    
  });
};

function prikazPoti() {
  // Izbrišemo obstoječo pot, če ta obstaja
  if (pot != null) mapa.removeControl(pot);

  // Dodamo pot
  pot = L.Routing.control({
    waypoints: tockePoti,
    language: 'sl',
    lineOptions: {
      styles: [
        {
          color: '#4E732E',
          weight: 5,
          dashArray: '4.75, 10'
        }
      ]
    },
    fitSelectedRoutes: false,
  }).addTo(mapa);

  // podrobnosti o poti, ko je ta najdena
  pot.on("routesfound", function (e) {
    koordinateIzbranePoti = e.routes[0].coordinates;
  });
}



$(document).ready(() => {
  // Osnovne lastnosti mape
  var mapOptions = {
    center: [FRI_LAT, FRI_LNG],
    zoom: 7.5,
  };

  // Ustvarimo objekt mapa
  mapa = new L.map("mapa_id", mapOptions);

  // Ustvarimo prikazni sloj mape
  var layer = new L.TileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  // Prikazni sloj dodamo na mapo
  mapa.addLayer(layer);

  // Ročno dodamo FRI na mapo
  dodajMarker(
    FRI_LAT,
    FRI_LNG,
    "Fakulteta za računalništvo in informatiko",
    "yellow"
  ); 

  // Posodobi podatke iz košarice na spletni strani
  $.get("/kosarica", (kosarica) => {
    markerji = [];
    kosarica.forEach((destinacija) => {
      premakniDestinacijoIzSeznamaVKosarico(
        destinacija.id,
        destinacija.ime,
        destinacija.zemljepisnaSirina,
        destinacija.zemljepisnaDolzina,
        false
      );
      dodajMarker(destinacija.zemljepisnaSirina, destinacija.zemljepisnaDolzina, destinacija.ime, "red");
      tockePoti = [];
      for(let i = 1; i < markerji.length; i++){
        tockePoti.push(L.latLng(markerji[i].getLatLng()));
      }
      prikazPoti();
      });
  });

  // Klik na destinacijo v levem seznamu sproži
  // dodajanje destinacije v desni seznam (košarica)
  $("#destinacije .destinacija button").click(function () {
    let destinacija = $(this);
    premakniDestinacijoIzSeznamaVKosarico(
      destinacija.parent().attr("id"),
      destinacija.find(".ime").text(),
      destinacija.find(".lat").text(),
      destinacija.find(".lng").text(),
      true
    );
    
    dodajMarker(destinacija.find(".lat").text(), destinacija.find(".lng").text(), destinacija.find(".ime").text(), "red");
    tockePoti = [];
    for(let i = 1; i < markerji.length; i++){
      tockePoti.push(L.latLng(markerji[i].getLatLng()));
    }
    prikazPoti();
  });

  // Klik na gumba za pripravo računov
  $("#racun_html").click(() => (window.location = "/izpisiRacun/html"));
  $("#racun_xml").click(() => (window.location = "/izpisiRacun/xml"));
});

/**
 * Dodaj izbrano oznako na zemljevid na določenih GPS koordinatah,
 * z dodatnim opisom, ki se prikaže v oblačku ob kliku in barvo
 * ikone, glede na tip oznake (FRI = črna, parki = zelena in
 * hoteli = modra)
 *
 * @param lat zemljepisna širina
 * @param lng zemljepisna dolžina
 * @param vsebinaHTML, vsebina v HTML obliki ki se prikaže v oblačku
 * @param barvaAnglesko, barva navedena v angleškem jeziku (npr. green, blue, black)
 */
function dodajMarker(lat, lng, vsebinaHTML, barvaAnglesko) {
  var streznik = "https://teaching.lavbic.net/cdn/OIS/DN/";
  var ikona = new L.Icon({
    iconUrl: streznik + "marker-icon-2x-" + barvaAnglesko + ".png",
    shadowUrl: streznik + "marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Ustvarimo marker z vhodnima podatkoma koordinat
  // in barvo ikone, glede na tip
  var marker = L.marker([lat, lng], { icon: ikona });

  // Izpišemo želeno sporočilo v oblaček
  marker.bindPopup(vsebinaHTML).openPopup();

  marker.addTo(mapa);
  markerji.push(marker);
}
