$(document).ready(() => {
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
