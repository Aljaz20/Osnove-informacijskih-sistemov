let web3;
const SENSEIRACUN= "0x8DF81423CBDe9DcaC839681c25E3d6377c972F41";
document.getElementById("prejemnik").innerHTML = SENSEIRACUN;
const GITHUBRACUN ="aljaz200";
const Posljipodatke = "https://teaching.lavbic.net/api/OIS/baza/" + GITHUBRACUN + "/podatki/azuriraj?kljuc=ETH&elementTabele=true";
const pridobipodatke = "https://teaching.lavbic.net/api/OIS/baza/"+GITHUBRACUN+"/podatki/vrni/ETH";
var danes;
$(document).ready(() => {
    web3 = new Web3("https://sensei.lavbic.net:8546");
    poslusalciModalnaOkna();
    prikazvremena();
    $("select#seznamRacunov").change(function (e) {
        let izbranRacunId = $(this).val();
        let cena = 0;
        let imenajdrazje = "";
        let najdrazja = 0;
        $.ajax({
            url: "/destinacije-racuna/" + izbranRacunId,
            method: "GET",
            success: function (vrstice) {
                vrstice.forEach((vrstice, i) => {
                    vrstice.zapSt = i + 1;
                    cena += vrstice.kolicina * vrstice.cena;
                    if (vrstice.cena > najdrazja) {
                        najdrazja = vrstice.cena;
                        imenajdrazje = vrstice.ime;
                    }
                });
                document.getElementById("skupnaCenaIzleta").innerHTML = "Skupna cena izleta znaša <b>" + Math.round((cena + Number.EPSILON) * 100) / 100 + " €</b>, pri čemer je najdražja destinacija <b>" + imenajdrazje +"</b>.";
            },
            error: function (napaka) {
                console.log(napaka);
            }
        });
    });
    const seznamRacunov = $("#seznamRacunov");
    const iskalniNiz = $("#iskalniNiz");
    iskalniNiz.on("input", () => {
        let iskanje = iskalniNiz.val().toLowerCase();

        seznamRacunov.children("option").each((i, option) => {
            $(option).css("background-color", "");
        });

        if(iskanje.length < 3) {
            return;
        }

        seznamRacunov.children("option").each((i, option) => {
            const tekst = $(option).text().toLowerCase();
            if (tekst.includes(iskanje)) {
              $(option).css("background-color", "linen");
            }
        });
    });
});



// Prikaz vremena
const meseci = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september","oktober", "november", "december"];

function prikazvremena() {
    var name = document.getElementById("kraj").value;
    var lat;
    var lon;

    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/city?name=' + name,
        headers: { 'X-Api-Key': '7dwnS7PQwSwAdGueAIu2wg==g5U1ZbSKGWPO9tZ8'},
        contentType: 'application/json',
        success: function(result) {
            if(result.length == 0){
                alert("Podanega kraja ni v bazi. Prosim vnesite drug kraj.");
                return;
            }
            lat = result[0].latitude;
            lon = result[0].longitude;
            var stevilodni = document.getElementById("steviloDni").value;
            if(stevilodni < 1 || stevilodni > 10){
                alert("Prosim vnesite število dni med 1 in 10.");
                return;
            }
            var vreme = [];

            $.get("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&daily=temperature_2m_max,temperature_2m_min,rain_sum&forecast_days="+stevilodni+"&timezone=Europe%2FBerlin", (podatki) => {
        
                for(let i = 0; i < podatki.daily.time.length; i++){
                const datum = new Date(podatki.daily.time[i]);      
                let ikona;
                if(podatki.daily.rain_sum[i] > 0){
                    ikona = "rainy";
                } else{
                    ikona = "sunny";
                }
                let dan = datum.getDate() + ". " + meseci[datum.getMonth()];
                if(i == 0){
                    danes=dan + " " + datum.getFullYear();
                    dan = "Danes";
                }else if(i == 1){
                    dan = "Jutri";
                }  
                let maks = Math.round(podatki.daily.temperature_2m_max[i]);
                let min = Math.round(podatki.daily.temperature_2m_min[i]);
                vreme.push({label:dan, y:[min, maks], name: ikona});
                }
                prikaživreme(vreme);
            });
            
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });    
}

function prikaživreme(vreme){
        
    

   var chart = new CanvasJS.Chart("vsebnikGrafa", {            
       
       axisY: {
           suffix: " °C",
           maximum: 35,
           gridThickness: 0
       },
       toolTip:{
           shared: true,
           content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
       },
       data: [{
           type: "rangeSplineArea",
           fillOpacity: 0.05,
		    color: "green",
           indexLabelFormatter: formatter,
           dataPoints: vreme
       }]
   });
   chart.render();
   
   var images = [];    
   
   addImages(chart);
   
   function addImages(chart) {
       for(var i = 0; i < chart.data[0].dataPoints.length; i++){
           var dpsName = chart.data[0].dataPoints[i].name;
           if(dpsName == "rainy"){
           images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
           } else if(dpsName == "sunny"){
               images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
           }
   
       images[i].attr("class", dpsName).appendTo($("#vsebnikGrafa>.canvasjs-chart-container"));
       positionImage(images[i], i);
       }
   }
   
   function positionImage(image, index) {
       var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
       var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
   
       image.width("40px")
       .css({ "left": imageCenter - 20 + "px",
       "position": "absolute","top":imageTop + "px",
       "position": "absolute"});
   }
   
   $( window ).resize(function() {
       var rainyCounter = 0, sunnyCounter = 0;    
       var imageCenter = 0;
       for(var i=0;i<chart.data[0].dataPoints.length;i++) {
           imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
           if(chart.data[0].dataPoints[i].name == "rainy") {
               $(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
           } else if(chart.data[0].dataPoints[i].name == "sunny") {
               $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
           }                
       }
   });
   
   function formatter(e) { 
       if(e.index === 0 && e.dataPoint.x === 0) {
           return " Min " + e.dataPoint.y[e.index] + "°";
       } else if(e.index == 1 && e.dataPoint.x === 0) {
           return " Max " + e.dataPoint.y[e.index] + "°";
       } else{
           return e.dataPoint.y[e.index] + "°";
       }
   } 
}

var slider = document.getElementById("donacija");
var output = document.getElementById("sliderValue");
output.innerHTML = slider.value + " ETH"; // prikaz začetne vrednosti

slider.oninput = function() {
  output.innerHTML = this.value + " ETH";
}


const donirajEthereum = async (modalnoOknoDoniraj) => {
    try {
        var posiljateljDenarnica = $("#eth-racun").attr("denarnica");
        var donacija = $("#donacija").val();

        let rezultat = await web3.eth.sendTransaction ({
            from: posiljateljDenarnica,
            to: SENSEIRACUN,
            value: donacija * Math.pow(10, 18),
        });

        // ob uspešni transakciji
        if (rezultat) {
            var podatki = {
                "hash": rezultat.transactionHash,
                "posiljatelj": posiljateljDenarnica,
                "donacija": donacija,
                "datum": danes
            }
            $.ajax({
                url: Posljipodatke,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(podatki)
            });
            modalnoOknoDoniraj.hide();
        } else {
            // neuspešna transakcija
            $("#napakaDonacija").html(
                "<div class='alert alert-danger' role='alert'>" +
                "<i class='fas fa-exclamation-triangle me-2'></i>" +
                "Prišlo je do napake pri transakciji!" +
                "</div>"
            );
        }
    } catch (e) {
        // napaka pri transakciji
        $("#napakaDonacija").html(
            "<div class='alert alert-danger' role='alert'>" +
            "<i class='fas fa-exclamation-triangle me-2'></i>" +
            "Prišlo je do napake pri transakciji: " + e +
            "</div>"
        );
    }
};

const dopolniTabeloDonacij = async () => {
    try {
        $.ajax({
            url: pridobipodatke,
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                $("#seznam-donacij").html("");
                for(var i = 0; i < data.length; i++) {
                    $("#seznam-donacij").append("\
                    <tr>\
                        <th scope='row'>" + (i+1) + "</th>\
                        <td>" + okrajsajNaslov(data[i].hash, 10) + "</td>\
                        <td>" + okrajsajNaslov(data[i].posiljatelj, 5) + "</td>\
                        <td>" + data[i].datum  + "</td>\
                        <td>" + data[i].donacija+ " <i class='fa-brands fa-ethereum'></i></td>\
                    </tr>\
                    ");
                }
                
            },
            error: function (napaka) {
                console.log(napaka.responseText);
            }
        });
    } catch (e) {
        alert(e);
    }
};

function okrajsajNaslov(vrednost, dolzina) {
    return vrednost.substring(0, dolzina) + "..." + vrednost.substring(vrednost.length - dolzina+1, vrednost.length);
}

const prijavaEthereumDenarnice = async (modalnoOknoPrijava) => {
    try {
        let rezultat = await web3.eth.personal.unlockAccount(
            $("#denarnica").val(),
            $("#geslo").val(),
            300);

        // ob uspešni prijavi računa
        if (rezultat) {
            prijavljenRacun = $("#denarnica").val();
            $("#eth-racun").html(okrajsajNaslov($("#denarnica").val(),6) + " (5 min)");
            $("#eth-racun").attr("denarnica", $("#denarnica").val());
            $("#like-button").removeAttr("disabled");
            modalnoOknoPrijava.hide();
        } else {
            // neuspešna prijava računa
            $("#napakaPrijava").html(
                "<div class='alert alert-danger' role='alert'>" +
                "<i class='fas fa-exclamation-triangle me-2'></i>" +
                "Prišlo je do napake pri odklepanju!" +
                "</div>"
            );
        }
    } catch (napaka) {
        // napaka pri prijavi računa
        $("#napakaPrijava").html(
            "<div class='alert alert-danger' role='alert'>" +
            "<i class='fas fa-exclamation-triangle me-2'></i>" +
            "Prišlo je do napake pri odklepanju: " + napaka +
            "</div>"
        );

    }
};

function poslusalciModalnaOkna() {
    const modalnoOknoPrijava = new bootstrap.Modal(document.getElementById('modalno-okno-prijava'), {
        backdrop: 'static'
    });

    const modalnoOknoDoniraj = new bootstrap.Modal(document.getElementById('modalno-okno-vseckanje'), {
        backdrop: 'static'
    });

    $("#denarnica,#geslo").keyup(function (e) {
        if ($("#denarnica").val().length > 41 && $("#geslo").val().length > 9)
            $("#gumb-potrdi-prijavo").removeAttr("disabled");
        else
            $("#gumb-potrdi-prijavo").attr("disabled", "disabled");
    });

    $("#gumb-potrdi-prijavo").click(function (e) {
        prijavaEthereumDenarnice(modalnoOknoPrijava);
    });

    $("#potrdi-donacijo").click(function (e) {
        donirajEthereum(modalnoOknoDoniraj);
    });

    var modalnoOknoDonacije = document.getElementById('modalno-okno-vseckanje');
    modalnoOknoDonacije.addEventListener('show.bs.modal', function (event) {
        var prijavljenaDenarnica = $("#eth-racun").attr("denarnica");
        $("#posiljatelj").text(prijavljenaDenarnica);
    });

    var modalnoOknoSeznamDonacij = document.getElementById('modalno-okno-seznam-donacij');
    modalnoOknoSeznamDonacij.addEventListener('show.bs.modal', function (event) {
        dopolniTabeloDonacij();
    });
}
