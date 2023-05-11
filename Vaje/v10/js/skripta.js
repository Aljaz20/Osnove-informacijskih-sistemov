const zacetniUrlNaslov = "https://teaching.lavbic.net/api/klepetalnica/";
let uporabnik = {id: 69, vzdevek: "Telebajsek"};
let idNaslednjegaSporocila = 0;
let trenutniKanal = "Skedenj";
let prijavljenRacun;

let casovnikPosodobiPogovor, casovnikPosodobiUporabnike;

let web3;


/**
 * Naloži seznam kanalov
 */
const naloziSeznamKanalov = () => {
    $.ajax({
        url: zacetniUrlNaslov + "kanali",
        type: "GET",
        success: function (kanali) {
            for (var i in kanali) {
                $("#kanali").append(" \
              <span class='p-2 bd-highlight pull-left kanal d-flex align-items-center' style='cursor: pointer'>\
                  <img class='img-fluid rounded-circle d-inline me-2' src='images/" + kanali[i] + ".jpg' style='width: 20%'/> \
                  <h5 class='d-inline'>" + kanali[i] + "</h5> \
              </span>");
            }
            $(".kanal").click(zamenjajKanal);
        }
    });
};


/**
 * Definicija funkcije za menjavo sobe
 *  - izbriši pogovore in uporabnike na strani,
 *  - nastavi spremenljivko trenutniKanal in
 *  - nastavi idNaslednjegaSporocila na 0.
 *
 * Pomisli tudi o morebitnih težavah!
 */
const zamenjajKanal = (e) => {
    trenutniKanal = e.currentTarget.getElementsByTagName("h5")[0].innerHTML;
    idNaslednjegaSporocila = 0;
    $("#trenutniKanal").html(trenutniKanal);
    $("#sporocila").html("");
    $("#uporabniki").html("");
    posodobiPogovor();
    posodobiUporabnike();
};


/**
 * Definicija funkcija za pridobivanje pogovorov,
 * ki se samodejno ponavlja na 5 sekund.
 */
const posodobiPogovor = () => {
    $.ajax({
        url: zacetniUrlNaslov + "sporocila/" + trenutniKanal + "/" + idNaslednjegaSporocila,
        type: "GET",
        success: function (sporocila) {
            for (let i in sporocila) {
                var sporocilo = sporocila[i];
                let hr = idNaslednjegaSporocila > 0 ? '<hr/>' : '';
                $("#sporocila").append(
                    hr + " \
                <div class='p-2 bd-highlight pull-left d-flex align-items-start' style='cursor: pointer'>\
                    <img class='img-fluid rounded-circle d-inline me-2 col'\
                             src='https://randomuser.me/api/portraits/men/" + sporocilo.uporabnik.id + ".jpg' style='max-width: 10%'/>\
                        <div class='col'>\
                            <small class='text-muted d-block'>" + sporocilo.uporabnik.vzdevek + " | " + sporocilo.cas + "</small>\
                            <span class='d-block'>" + sporocilo.besedilo + "</span>\
                        </div>\
                </div>");
                idNaslednjegaSporocila = sporocilo.id + 1;
                $("#trenutnikanal").html(trenutniKanal);
            }
            clearTimeout(casovnikPosodobiPogovor);
            casovnikPosodobiPogovor = setTimeout(function () {
                posodobiPogovor();
            }, 5000);
        }
    });
};


/**
 * Funkcija za posodabljanje seznama uporabnikov,
 * ki se samodejno ponavlja na 5 sekund.
 */
const posodobiUporabnike = () => {
    $.ajax({
        url: zacetniUrlNaslov + "uporabniki/" + trenutniKanal,
        type: "GET",
        success: function (uporabniki) {
            if (typeof (uporabniki) == "object") {
                $("#uporabniki").html("");
                for (let i in uporabniki) {
                    let uporabnik = uporabniki[i];
                    $("#uporabniki").append(" \
                <span class='p-2 bd-highlight pull-left kanal d-flex align-items-center uporabnik' style='cursor: pointer'>\
                    <img class='img-fluid rounded-circle d-inline me-2'\
                        src=\"https://randomuser.me/api/portraits/men/" + uporabnik.id + ".jpg\" style='width: 10%'>\
                    <h5 class='d-inline'>" + uporabnik.vzdevek + "</h5>\
                </span>");
                }
            }
            clearTimeout(casovnikPosodobiUporabnike);
            casovnikPosodobiUporabnike = setTimeout(function () {
                posodobiUporabnike();
            }, 5000);
        }
    });
};


/**
 * Funkcija za pošiljanje sporočila
 */
const posljiSporocilo = () => {
    $.ajax({
        url: zacetniUrlNaslov + "sporocila/" + trenutniKanal,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({uporabnik: uporabnik, besedilo: $("#sporocilo").val()}),
        success: function (data) {
            $("#sporocilo").val("");
            posodobiPogovor();
            posodobiUporabnike();
        },
        error: function (err) {
            alert(err.responseJSON.status);
        }
    });
};


/**
 * Funkcija za donacijo 0,1 Ethereum kriptovalute
 */
const donirajEthereum = async (modalnoOknoDoniraj) => {
    try {
        var posiljateljDenarnica = $("#eth-racun").attr("denarnica");
        var prejemnikDenarnica = $("#denarnica-prejemnika").val();
        var donacija = $("#donacija").val();

        let rezultat = await web3.eth.sendTransaction ({
            from: posiljateljDenarnica,
            to: prejemnikDenarnica,
            value: donacija * Math.pow(10, 18),
        });

        // ob uspešni transakciji
        if (rezultat) {
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

/**
 * Funkcija za prikaz donacij v tabeli
 */
const dopolniTabeloDonacij = async () => {
    try {
        let steviloBlokov = (await web3.eth.getBlock("latest")).number;
        let st = 1;
        $("#seznam-donacij").html("");
        for (let i = 0; i <= steviloBlokov; i++) {
            let blok = await web3.eth.getBlock(i);


            for (let txHash of blok.transactions) {
                let tx = await web3.eth.getTransaction(txHash);
                console.log(tx);
                if (!prijavljenRacun || prijavljenRacun == tx.from) {
                    $("#seznam-donacij").append("\
                    <tr>\
                        <th scope='row'>" + st++ + "</th>\
                        <td>" + okrajsajNaslov(tx.hash) + "</td>\
                        <td>" + okrajsajNaslov(tx.from) + "</td>\
                        <td>" + okrajsajNaslov(tx.to) + "</td>\
                        <td>" + parseFloat(web3.utils.fromWei(tx.value)) + " <i class='fa-brands fa-ethereum'></i></td>\
                    </tr>");
                }
            }
        }
    } catch (e) {
        alert(e);
    }
};

function okrajsajNaslov(vrednost) {
    return vrednost.substring(0, 4) + "..." + vrednost.substring(vrednost.length - 3, vrednost.length);
}

/**
 * Funkcija za prijavo Ethereum denarnice v testno omrežje
 */
const prijavaEthereumDenarnice = async (modalnoOknoPrijava) => {
    try {
        let rezultat = await web3.eth.personal.unlockAccount(
            $("#denarnica").val(),
            $("#geslo").val(),
            300);

        // ob uspešni prijavi računa
        if (rezultat) {
            prijavljenRacun = $("#denarnica").val();
            $("#eth-racun").html(okrajsajNaslov($("#denarnica").val()) + " (5 min)");
            $("#eth-racun").attr("denarnica", $("#denarnica").val());
            $("#gumb-doniraj-start").removeAttr("disabled");
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

/**
 * Funkcija za dodajanje poslušalcev modalnih oken
 */
function poslusalciModalnaOkna() {
    const modalnoOknoPrijava = new bootstrap.Modal(document.getElementById('modalno-okno-prijava'), {
        backdrop: 'static'
    });

    const modalnoOknoDoniraj = new bootstrap.Modal(document.getElementById('modalno-okno-donacije'), {
        backdrop: 'static'
    });

    $("#denarnica,#geslo").keyup(function (e) {
        if ($("#denarnica").val().length > 0 && $("#geslo").val().length > 0)
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

    var modalnoOknoDonacije = document.getElementById('modalno-okno-donacije');
    modalnoOknoDonacije.addEventListener('show.bs.modal', function (event) {
        var prijavljenaDenarnica = $("#eth-racun").attr("denarnica");
        $("#posiljatelj").text(prijavljenaDenarnica);
    });

    var modalnoOknoSeznamDonacij = document.getElementById('modalno-okno-seznam-donacij');
    modalnoOknoSeznamDonacij.addEventListener('show.bs.modal', function (event) {
        dopolniTabeloDonacij();
    });
}


$(document).ready(function () {
    $("#sporocila").html("");

    /* Povežemo se na testno Ethereum verigo blokov */
    web3 = new Web3("https://sensei.lavbic.net:8546");

    /* Dodamo poslušalce */
    poslusalciModalnaOkna();
    $("#poslji").click(posljiSporocilo);
    $('#sporocilo').keypress(function (e) {
        if ('13' == (e.keyCode ? e.keyCode : e.which))
            posljiSporocilo();
    });

    naloziSeznamKanalov();
    posodobiPogovor();
    posodobiUporabnike();
});
