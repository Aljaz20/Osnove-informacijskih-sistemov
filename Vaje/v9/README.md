# **V9** Objektni pristop k načrtovanju informacijskih sistemov

<img src="img/ninja_08_sword_down_right.png">

Za lažje razumevanje vaj si poglejte predavanja **P10** [Objektni razvoj in simulacija razvoja informacijskega sistema za bankomat](https://teaching.lavbic.net/OIS/2022-2023/P10.html), odgovore na vprašanja iz teh vaj lahko posredujete v okviru [<img src='img/earth-europe-solid.svg' width='16'>lekcije **V9**](https://ucilnica.fri.uni-lj.si/mod/quiz/view.php?id=52446) na spletni učilnici.

## Objektni pristop k načrtovanju informacijskih sistemov za letalsko družbo

### Navodila

Podjetje Leteči vragi d. n. o. ima **več letal** _Airbus A380_, _Tupolev TU-134_ in še nekatere druge modele letal, ki letijo na dva načina.

Prvi način je po naročilu za **poslovne polete**. Vsako letalo je razvrščeno v točno določeno kategorijo letala. V sklopu osebja imajo pilote in stevardese, o katerih beležijo **osnovne podatke**: davčna številka, ime, priimek in število let staža. Za vsako kategorijo letala obstajajo **pravila**, ki opredeljujejo, kateri **piloti** jih smejo voziti in katere **stevardese** so primerne za to kategorijo letala. Potrebno je beležiti tudi datum, od kdaj dalje je nekdo primeren za neko kategorijo letala.

**Poslovna stranka** naroči prevoz in pri naročilu pove, katero **kategorijo letala** želi. Poleg tega pove še, **kdaj potrebuje polet**, kam, koliko **oseb** bo letelo ter **datum povratka**. Stranka naroči prevoz **po telefonu** preko komercialista, ki vnese podatke o letu. Pri naročilu komercialist takoj izbere _dva pilota_ in _tri stevardese_, ki bodo prisotni na poletu. Poleg tega določi še vse morebitne dodatne zahteve stranke, pri čemer je zahtev lahko več. Za zahteve obstaja katalog, v katerem je zapisana tudi trenutna **cena za dodatno zahtevo**. Pred opravljenim poletom stranki izdajo **predračun**, preko katerega mora stranka plačati znesek, ki je opredeljen kot znesek **avansa** za kategorijo letala. Polet se opravi le, če je **predračun plačan v roku**.

Po opravljenem poletu **komercialist** podjetja stranki **izda račun**. Račun izdajo na podlagi **cenika**, ki mora biti zabeležen v podatkovni bazi, pri čemer velja, da mora biti zabeležena vsa zgodovina cenika. Za vsako kategorijo letala mora biti zabeležena: štartnina najema, cena dnevnega najema letala in cena kilometra poleta. Pri izdaji računa stranki zaračunajo naslednje tipe postavk, ki jih komercialist vnese ob izdelavi računa: **cena najema letala** (cena dnevnega najema * št. dni), **cena za preletene kilometre** (2 * zračna razdalja med letališčema), **cena štartnine**, **cena dodatnih zahtev** in **DDV**. Od končnega zneska računa se **odšteje avans**, plačan preko predračuna. **Štartnina** se izračuna na naslednji način: štartnina je **fiksno 5.000 €**, če gre za prvi najem letala; sicer je štartnina **1.900 €**.

Ker v prihodnje predvidevajo spremembe pri izdaji računa želijo, da bi bilo možno na enostaven način dodajati tipe postavk.

Drugi način pa je za **pogodbene stranke**. Postopek organiziranja teh poletov je podoben, le da gre tukaj za naročilo **na podlagi pogodbe**, ki jo **skupaj s stranko** opredeli **vodja prodaje**. V okviru vsake pogodbe so določene cene za vse tipe postavk oz. za iste stvari, kot pri poletih po naročilu. Pogodbenim strankam podjetje izda **zbirni račun** na koncu koledarskega leta za vse opravljene polete. Na računu mora biti razvidna cena za vsak polet in vse njegove postavke posebej, ki se jih zaračunava enako, kot pri naročilih za poslovne polete. Razlika je le v tem, da je **štartnina le 500 €**.

### 1. Naloga

Pri reševanju vseh nalog si pomagajte z [<img src='img/earth-europe-solid.svg' width='16'>lekcijo **V9**](https://ucilnica.fri.uni-lj.si/mod/quiz/view.php?id=52446) na spletni učilnici.

Naprej dopolnite načrt **diagram primera uporabe**, da ustreza zgornjim navodilom.

### Podpora izdaji računa

Informacijski sistem omogoča tudi podporo izdaje računa (pri naročilu poslovnega leta) kot prikazuje primer na spodnjih tabelah in sicer osnovni podatki na računu ter postavke računa.

<table style="border-top-width: 2px; border-top-color: #D0D0D0; border-top-style: solid; border-bottom-width: 2px; border-bottom-color: #D0D0D0; border-bottom-style: solid;" cellpadding="4">
    <tbody>
        <tr>
            <td style="background-color: #d0d0d0; font-weight: bold;">Račun</td>
            <td><strong>2015-02-2309</strong></td>
            <td>&nbsp;</td>
            <td style="background-color: #d0d0d0; font-weight: bold;">Stranka</td>
            <td><strong>Navihani faloti s.p.</strong></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>4. 2. 2013</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>Dežela Telebajskov 13&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>9018 Qlandia&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><strong>Leteči vragi d.n.o.</strong></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>Sračji dol 78</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>7091 Veselinovci</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td style="background-color: #d0d0d0; font-weight: bold;">Izdal komercialist</td>
            <td>Hitri Tone</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </tbody>
</table>

<p>&nbsp;</p>
<table style="border-bottom-width: 2px; border-bottom-color: #D0D0D0; border-bottom-style: solid;" cellpadding="4">
    <tbody>
        <tr>
            <td style="background-color: #d0d0d0; font-weight: bold; border-bottom-width: 2px; border-bottom-color: #D0D0D0; border-bottom-style: solid;" colspan="8">Postavke računa</td>
        </tr>
        <tr>
            <td style="text-align: right;"><strong>ID&nbsp;</strong></td>
            <td style="text-align: left;"><strong>Naziv</strong></td>
            <td style="text-align: right;"><strong>Količina</strong></td>
            <td style="text-align: right;"><strong>Cena na enoto</strong></td>
            <td style="text-align: right;"><strong>Vrednost</strong></td>
            <td style="text-align: right;"><strong>DDV</strong></td>
            <td style="text-align: right;"><strong>Skupaj z DDV</strong></td>
        </tr>
        <tr>
            <td style="text-align: right;">13</td>
            <td style="text-align: left;">Štartnina</td>
            <td style="text-align: right;">1x</td>
            <td style="text-align: right;">5.000 €</td>
            <td style="text-align: right;">5.000 €</td>
            <td style="text-align: right;">1.000 €</td>
            <td style="text-align: right;">6.000 €</td>
        </tr>
        <tr>
            <td style="text-align: right;">83</td>
            <td style="text-align: left;">Cena najema za ultralahko letalo Leteči potepuhi X)-A12</td>
            <td style="text-align: right;">3 dni</td>
            <td style="text-align: right;">17.000 €</td>
            <td style="text-align: right;">51.000 €</td>
            <td style="text-align: right;">10.200 €</td>
            <td style="text-align: right;">61.200 €</td>
        </tr>
        <tr>
            <td style="text-align: right;">8&nbsp;</td>
            <td style="text-align: left;">Kilometrina (Ljubljana - Bogota)&nbsp;</td>
            <td style="text-align: right;">19.060 km&nbsp;</td>
            <td style="text-align: right;">2 €&nbsp;</td>
            <td style="text-align: right;">38.120 €&nbsp;</td>
            <td style="text-align: right;">7.624 €&nbsp;</td>
            <td style="text-align: right;">45.744 €&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: right;">102&nbsp;</td>
            <td style="text-align: left;">Dodatna stevardesa (3 dni), ki zna igrati šah&nbsp;</td>
            <td style="text-align: right;">3x</td>
            <td style="text-align: right;">2.500 €&nbsp;</td>
            <td style="text-align: right;">7.500 €&nbsp;</td>
            <td style="text-align: right;">1.500 €&nbsp;</td>
            <td style="text-align: right;">9.000 €&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: right;">103&nbsp;</td>
            <td style="text-align: left;">Dodatna stevardesa (3 dni), ki zna peti Avsenikove uspešnice&nbsp;</td>
            <td style="text-align: right;">3x</td>
            <td style="text-align: right;">2.100 €&nbsp;</td>
            <td style="text-align: right;">6.300 €&nbsp;</td>
            <td style="text-align: right;">1.260 €&nbsp;</td>
            <td style="text-align: right;">7.560 €&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: right;">112&nbsp;</td>
            <td style="text-align: left;">Steklenica Don Perignona&nbsp;</td>
            <td style="text-align: right;">2x</td>
            <td style="text-align: right;">50 €&nbsp;</td>
            <td style="text-align: right;">100 €&nbsp;</td>
            <td style="text-align: right;">20 €&nbsp;</td>
            <td style="text-align: right;">120 €&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: right;">12&nbsp;</td>
            <td style="text-align: left;">Avans&nbsp;</td>
            <td style="text-align: right;">1x</td>
            <td style="text-align: right;">-10.000 €&nbsp;</td>
            <td style="text-align: right;">-10.000 €&nbsp;</td>
            <td style="text-align: right;">-2.000 €&nbsp;</td>
            <td style="text-align: right;">-12.000 €&nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: left;">&nbsp;</td>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: right;">&nbsp;</td>
            <td style="text-align: right; border-top-width: 2px; border-top-color: #D0D0D0; border-top-style: solid;"><strong>117.624 €&nbsp;</strong></td>
        </tr>
    </tbody>
</table>

### 2. Naloga

Dopolnite načrta **VOPC razredni diagram** ter **diagram zaporedja**, da ustreza vsem funkcionalnim zahtevam -- osnovnim navodilom in podpori izdaje računa.