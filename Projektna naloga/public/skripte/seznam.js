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

//baseURL
const GITHUBRACUN = "aljaz200";
var baseURL = "https://teaching.lavbic.net/api/OIS/baza/" + GITHUBRACUN + "/podatki/";

window.onload = () => {
  Prikazidestinacije();
};

//Dodaj destinacijo
function Dodajdestinacijo(){
  const ime = document.getElementById("ime").value;
  $.ajax({
    url: baseURL + "vrni/vsi",
    type: "GET",
    success: function (podatki) {
      var stevilo = 1;
      let i = 0;
      var vrsta = "ostalo";
      for(let obj of Object.values(podatki)){
        
        if(obj.ime == ime){
          console.log("ZE V BAZI");
          vrsta = obj.vrstaDestinacije;
          var povedek = "je";
          var samostalnik = "uporabnikov";
          var glagol = "izbralo"
          if(obj.count % 100 == 1){
            povedek = "je";
            samostalnik = "uporabnik";
            glagol = "izbral"
          }else if(obj.count % 100 == 2){
            povedek = "sta";
            samostalnik = "uporabnika";
            glagol = "izbrala"
          }else if(obj.count % 100 <5 && obj.count % 100 > 2){
            povedek = "so";
            samostalnik = "uporabniki";
            glagol = "izbrali"
          }
          $("#Odgovor").html("<b>Dobra izbira.</b> Destinacijo "+povedek+" pred vami že "+glagol+" <b>" + obj.count + "</b> "+samostalnik+".");
          stevilo = obj.count+1;
          i = obj.id;
          break;
        }
        i++;
      }
      if(stevilo == 1){	
        $("#Odgovor").html("<b>Super!</b> Ste <b>prvi</b>, ki ste dodali to destinacijo.");
      }
      var data = {
        id: i,
        ime: ime,
        vrstaDestinacije: vrsta,
        count: stevilo,
      };
      $.ajax({
        url: baseURL + "azuriraj?kljuc=" + i +"&elementTabele=false",
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (data) {
          console.log("DODANO");
          Prikazidestinacije();
        }
      });
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//Prikazi top destinacije
function Prikazidestinacije(){
  const vrsta = document.getElementById("category").value;

  $.ajax({
    url: baseURL + "vrni/vsi",
    type: "GET",
    success: function (podatki) {
      const podatkinovo = [];
      for(let obj of Object.values(podatki)){
        
        if(obj.id != undefined){
          podatkinovo.push(obj);
        }
      }
      var filtrirano = podatkinovo;
      if(vrsta !== "skupaj"){
        filtrirano = [];
        filtrirano = podatkinovo.filter((destinacija) => destinacija.vrstaDestinacije === vrsta);
      }
      
      filtrirano.sort((a, b) => b.count - a.count);

      const topDestinacije = filtrirano.slice(0, 10);
      $("#seznam-destinacij").empty();
      for(let i = 0; i < topDestinacije.length; i++){
        $("#seznam-destinacij").append("\
          <tr>\
              <th scope='row'>" + (i+1) + "</th>\
              <td>" + topDestinacije[i].ime + "</td>\
              <td>" + topDestinacije[i].vrstaDestinacije + "</td>\
              <td>" + topDestinacije[i].count  + "</td>\
          </tr>\
          ");
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}


// Premakni destinacijo iz seznama (desni del) v košarico (levi del)
const premakniDestinacijoIzSeznamaVKosarico = (id, ime, lat, lng, vrstaDestinacije ,azuriraj) => {
  if (azuriraj)
    $.get("/kosarica/" + id, (podatki) => {
      let stevec = 1;
      $.ajax({
        url: baseURL + "vrni/" + id,
        type: "GET",
        success: function (temppodatki) {
          stevec = temppodatki.count+1;
          var data = {
            id: id,
            ime: ime,
            vrstaDestinacije: vrstaDestinacije,
            count: stevec,
          };
          $.ajax({
            url: baseURL + "azuriraj?kljuc=" + id +"&elementTabele=false",
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
              console.log("SUPER");
              Prikazidestinacije();
            }
          });          
        },
        error: function (err) {
          console.log("NI v bazi");
          var data = {
            id: id,
            ime: ime,
            vrstaDestinacije: vrstaDestinacije,
            count: stevec,
          };
          $.ajax({
            url: baseURL + "azuriraj?kljuc=" + id +"&elementTabele=false",
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
              console.log("DODANO");
              Prikazidestinacije();
            }
          });
        },
      });
      
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
      "</span>\
            <!--<i class='far fa-clock'></i>--><span class='vrstaDestinacije' style='display: none'>" +
      vrstaDestinacije +      
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
    let temp = tockePoti.slice(0, indeks).concat(tockePoti.slice(indeks+1));
    tockePoti = [];
    tockePoti = temp;
    temp = [];
    temp = markerji.slice(0, indeks).concat(markerji.slice(indeks+1));
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
    createMarker: function (){
      return null;
    },
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
    "black"
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
        destinacija.vrstaDestinacije,
        false
      );
      let barva = "yellow"
      //če je vse ostalo - rumena
      if(destinacija.vrstaDestinacije === "živalski vrt"){
        //če je zoo - zelena
        barva = "green";
      }else if(destinacija.vrstaDestinacije === "hostel"){
        //če je hostel - modra
        barva = "blue";
      }
     
      dodajMarker(destinacija.zemljepisnaSirina, destinacija.zemljepisnaDolzina, destinacija.ime, barva);
      tockePoti = [];
      for(let i = 0; i < markerji.length; i++){
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
      destinacija.find(".vrstaDestinacije").text(),
      true
    );

    let barva = "yellow"
    //če je vse ostalo - rumena
    if(destinacija.find(".vrstaDestinacije").text() === "živalski vrt"){
      //če je zoo - zelena
      barva = "green";
    }else if(destinacija.find(".vrstaDestinacije").text() === "hostel"){
      //če je hostel - modra
      barva = "blue";
    }
    
    dodajMarker(destinacija.find(".lat").text(), destinacija.find(".lng").text(), destinacija.find(".ime").text(), barva);
    tockePoti = [];
    for(let i = 0; i < markerji.length; i++){
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
  if(barvaAnglesko !== "black"){
    markerji.push(marker);
  }
}
