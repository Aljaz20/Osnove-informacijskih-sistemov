var baza = "demo";
var baseUrl = "https://teaching.lavbic.net/api/OIS/baza/" + baza + "/podatki/";

/**
 * Generiranje enoličnega identifikatorja, ki ga uporabimo za
 * EHR zapis pacienta.
 */
function generirajID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Kreiraj nov EHR zapis za pacienta in dodaj osnovne demografske podatke
 * (ime, priimek in datum rojstva). V primeru uspešne akcije izpiši sporočilo
 * s pridobljenim EHR ID, sicer izpiši napako.
 */
function kreirajEHRzaBolnika() {
  var ime = $("#kreirajIme").val();
  var priimek = $("#kreirajPriimek").val();
  var datumRojstva = $("#kreirajDatumRojstva").val();
  if (
    !ime ||
    !priimek ||
    !datumRojstva ||
    ime.trim().length == 0 ||
    priimek.trim().length == 0 ||
    datumRojstva.trim().length == 0
  ) {
    $("#kreirajSporocilo").html(
      "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
        "Prosim vnesite zahtevane podatke!" +
        "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
        "</div>"
    );
  } else {
    var ehrID = generirajID();
    var podatki = {
      ime: ime,
      priimek: priimek,
      datumRojstva: datumRojstva,
    };
    $.ajax({
      url: baseUrl + "azuriraj?kljuc=" + ehrID,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(podatki),
      success: function (data) {
        $("#kreirajSporocilo").html(
          "<div class='alert alert-success alert-dismissible fade show mt-3 mb-0'>" +
            "Uspešno kreiran EHR <b>" +
            ehrID +
            "</b>." +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "</div>"
        );
        $("#preberiEHRid").val(ehrID);
        $("#kreirajIme").val("");
        $("#kreirajPriimek").val("");
        $("#kreirajDatumRojstva").val("");
      },
      error: function (err) {
        $("#kreirajSporocilo").html(
          "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
            "Napaka '" +
            JSON.parse(err.responseText).opis +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "!</div>"
        );
      },
    });
  }
}

/**
 * Za podan EHR ID preberi demografske podrobnosti pacienta in izpiši sporočilo
 * s pridobljenimi podatki (ime, priimek in datum rojstva).
 */
function preberiEHRodBolnika() {
  var ehrID = $("#preberiEHRid").val();
  if (!ehrID || ehrID.trim().length == 0) {
    $("#preberiSporocilo").html(
      "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
        "Prosim vnesite zahtevan podatek!" +
        "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
        "</div>"
    );
  } else {
    $.ajax({
      url: baseUrl + "vrni/" + ehrID,
      type: "GET",
      success: function (podatki) {
        $("#preberiSporocilo").html(
          "<div class='alert alert-success alert-dismissible fade show mt-3 mb-0'>" +
            "Bolnik <b>" +
            podatki.ime +
            " " +
            podatki.priimek +
            "</b>, ki se je rodil <b>" +
            podatki.datumRojstva +
            "</b>" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            ".</div>"
        );
      },
      error: function (err) {
        $("#preberiSporocilo").html(
          "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
            "Napaka '" +
            JSON.parse(err.responseText).opis +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "!</div>"
        );
      },
    });
  }
}

/**
 * Za dodajanje vitalnih znakov pacienta je pripravljena kompozicija, ki
 * vključuje množico meritev vitalnih znakov (EHR ID, datum in ura,
 * telesna višina, telesna teža, sistolični in diastolični krvni tlak,
 * nasičenost krvi s kisikom in merilec).
 */
function dodajMeritveVitalnihZnakov() {
  var ehrID = $("#dodajVitalnoEHR").val();
  var datumInUra = $("#dodajVitalnoDatumInUra").val();
  var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
  var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
  var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();
  var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
  var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
  var nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
  var merilec = $("#dodajVitalnoMerilec").val();

  if (
    !ehrID ||
    ehrID.trim().length == 0 ||
    !datumInUra ||
    datumInUra.trim().length == 0 ||
    !telesnaVisina ||
    telesnaVisina.trim().length == 0 ||
    !telesnaTeza ||
    telesnaTeza.trim().length == 0 ||
    !telesnaTemperatura ||
    telesnaTemperatura.trim().length == 0 ||
    !sistolicniKrvniTlak ||
    sistolicniKrvniTlak.trim().length == 0 ||
    !nasicenostKrviSKisikom ||
    nasicenostKrviSKisikom.trim().length == 0 ||
    !merilec ||
    merilec.trim().length == 0
  ) {
    $("#dodajMeritveVitalnihZnakovSporocilo").html(
      "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
        "Prosim vnesite zahtevane podatke!" +
        "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
        "</div>"
    );
  } else {
    var podatki = {
      datumInUra: datumInUra,
      telesnaVisina: parseFloat(telesnaVisina),
      telesnaTeza: parseFloat(telesnaTeza),
      telesnaTemperatura: parseFloat(telesnaTemperatura),
      sistolicniKrvniTlak: parseFloat(sistolicniKrvniTlak),
      diastolicniKrvniTlak: parseFloat(diastolicniKrvniTlak),
      nasicenostKrviSKisikom: parseFloat(nasicenostKrviSKisikom),
      merilec: merilec,
    };
    $.ajax({
      url:
        baseUrl +
        "azuriraj?kljuc=" +
        ehrID +
        "|meritve" +
        "&elementTabele=true",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(podatki),
      success: function (odgovor) {
        $("#dodajMeritveVitalnihZnakovSporocilo").html(
          "<div class='alert alert-success alert-dismissible fade show mt-3 mb-0'>" +
            "Meritve za bolnika <b>" +
            ehrID +
            "</b> uspešno dodane!" +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "</div>"
        );
      },
      error: function (err) {
        $("#dodajMeritveVitalnihZnakovSporocilo").html(
          "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
            "Napaka '" +
            JSON.parse(err.responseText).opis +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "!</div>"
        );
      },
    });
  }
}

/**
 * Pridobivanje vseh zgodovinskih podatkov meritev izbranih vitalnih znakov
 * (telesna temperatura in telesna teža).
 */
function preberiMeritveVitalnihZnakov() {
  var ehrID = $("#meritveVitalnihZnakovEHRid").val();
  var tip = $("#preberiTipZaVitalneZnake").val();

  if (!ehrID || ehrID.trim().length == 0 || !tip || tip.trim().length == 0) {
    $("#preberiMeritveVitalnihZnakovSporocilo").html(
      "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
        "Prosim vnesite zahtevan podatek!" +
        "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
        "</div>"
    );
  } else {
    $.ajax({
      url: baseUrl + "vrni/" + ehrID + "|" + "meritve",
      type: "GET",
      success: function (podatki) {
        podatki = podatki.filter((podatek) => {
          if (tip == "Telesna temperatura")
            return podatek.datumInUra && podatek.telesnaTemperatura;
          else if (tip == "Telesna teža")
            return podatek.datumInUra && podatek.telesnaTeza;
          else return false;
        });
        if (podatki.length > 0) {
          var prikaz =
            "<table class='table table-striped " +
            "table-hover' style='margin-top:20px'><tr><th>Datum in ura</th>" +
            "<th class='text-right'>" +
            tip +
            "</th></tr>";
          podatki.forEach((podatek) => {
            prikaz +=
              "<tr><td>" +
              podatek.datumInUra +
              "</td><td class='text-right'>" +
              (tip == "Telesna temperatura"
                ? podatek.telesnaTemperatura
                : podatek.telesnaTeza) +
              " " +
              (tip == "Telesna temperatura" ? "°C" : "kg") +
              "</td></tr>";
          });
          prikaz += "</table>";
          $("#rezultatMeritveVitalnihZnakov").html(prikaz);
        } else {
          $("#preberiMeritveVitalnihZnakovSporocilo").html(
            "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
              "Ni podatkov!" +
              "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
              "</div>"
          );
        }
        $("#preberiMeritveVitalnihZnakovSporocilo").html("");
      },
      error: function (err) {
        $("#preberiMeritveVitalnihZnakovSporocilo").html(
          "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
            "Napaka '" +
            JSON.parse(err.responseText).opis +
            "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
            "!</div>"
        );
      },
    });
  }
}

$(document).ready(function () {
  /**
   * Napolni testne vrednosti (ime, priimek in datum rojstva) pri kreiranju
   * EHR zapisa za novega bolnika, ko uporabnik izbere vrednost iz
   * padajočega menuja (npr. Pujsa Pepa).
   */
  $("#preberiPredlogoBolnika").change(function () {
    $("#kreirajSporocilo").html("");
    var podatki = $(this).val().split(",");
    $("#kreirajIme").val(podatki[0]);
    $("#kreirajPriimek").val(podatki[1]);
    $("#kreirajDatumRojstva").val(podatki[2]);
  });

  /**
   * Napolni testni EHR ID pri prebiranju EHR zapisa obstoječega bolnika,
   * ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Dejan Lavbič, Pujsa Pepa, Ata Smrk)
   */
  $("#preberiObstojeciEHR").change(function () {
    $("#preberiSporocilo").html("");
    $("#preberiEHRid").val($(this).val());
  });

  /**
   * Napolni testne vrednosti (EHR ID, datum in ura, telesna višina,
   * telesna teža, telesna temperatura, sistolični in diastolični krvni tlak,
   * nasičenost krvi s kisikom in merilec) pri vnosu meritve vitalnih znakov
   * bolnika, ko uporabnik izbere vrednosti iz padajočega menuja (npr. Ata Smrk)
   */
  $("#preberiObstojeciVitalniZnak").change(function () {
    $("#dodajMeritveVitalnihZnakovSporocilo").html("");
    var podatki = $(this).val().split("|");
    $("#dodajVitalnoEHR").val(podatki[0]);
    $("#dodajVitalnoDatumInUra").val(podatki[1]);
    $("#dodajVitalnoTelesnaVisina").val(podatki[2]);
    $("#dodajVitalnoTelesnaTeza").val(podatki[3]);
    $("#dodajVitalnoTelesnaTemperatura").val(podatki[4]);
    $("#dodajVitalnoKrvniTlakSistolicni").val(podatki[5]);
    $("#dodajVitalnoKrvniTlakDiastolicni").val(podatki[6]);
    $("#dodajVitalnoNasicenostKrviSKisikom").val(podatki[7]);
    $("#dodajVitalnoMerilec").val(podatki[8]);
  });

  /**
   * Ob spremembi tipa podatkov zahtevaj podatke s strežnika.
   */
  $("#preberiTipZaVitalneZnake").change(function () {
    preberiMeritveVitalnihZnakov();
  });

  /**
   * Napolni testni EHR ID pri pregledu meritev vitalnih znakov obstoječega
   * bolnika, ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Ata Smrk, Pujsa Pepa)
   */
  $("#preberiEhrIdZaVitalneZnake").change(function () {
    $("#preberiMeritveVitalnihZnakovSporocilo").html("");
    $("#rezultatMeritveVitalnihZnakov").html("");
    $("#meritveVitalnihZnakovEHRid").val($(this).val());
  });
});
