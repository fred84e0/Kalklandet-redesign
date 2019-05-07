var burgerMenu = document.querySelector("#burger-menu");

let aktuelle = [];
let filter = "alle";
document.addEventListener("DOMContentLoaded", hentJson);

function openSidebar() {
    console.log("nu kører det");

    if (!(burgerMenu.style.display == "block")) {
        burgerMenu.style.display = "block";
    } else {
        burgerMenu.style.display = "none";
    }
}
var filtermenu = document.querySelector(".filtermenu");
document.querySelector("#filter-button").addEventListener("click", openFilter);

function openFilter() {
    console.log("nu kører det");

    if (!(filtermenu.style.display == "block")) {
        filtermenu.style.display = "block";
    } else {
        filtermenu.style.display = "none";
    }
}



async function hentJson() {

    const url = "http://home8.dk/kea/semester2/cms/kalklandet/wordpress/wp-json/wp/v2/aktuelt"
    const myJson = await fetch(url);
    aktuelle = await myJson.json();
    //--------------------------- sortere arrayet, så de nye posts er i toppen
    aktuelle.sort((b, a) => {
        return a.dato.localeCompare(b.dato);
    })

    visAktuelle();
}

function visAktuelle() {
    let dest = document.querySelector(".container_aktuelt");
    let temp = document.querySelector("template");
    //------------------------- fjerner indhold så filtrering kan finde sted
    document.querySelector(".container_aktuelt").innerHTML = "";
    aktuelle.forEach(aktuel => {
        //------------------------- Filtrere enten efter alle posts eller en af museerne
        if (filter == "alle" || filter == aktuel.attraktion[0]) {
            //----------- her kloner vi hver af elementerne i templaten
            let klon = temp.cloneNode(true).content;
            klon.querySelector(".aktuelt_titel").innerHTML = aktuel.titel;
            klon.querySelector(".loopview_tekst").innerHTML = aktuel.kort_beskrivelse;
            klon.querySelector(".aktuel_dato").innerHTML = aktuel.dato;
            klon.querySelector(".attraktion").innerHTML = aktuel.attraktion;
            klon.querySelector(".aktuelt_billede").style.backgroundImage = `url(${aktuel.billede.guid})`
            klon.querySelector(".aktuelt_billede").alt = aktuel.billede_beskrivelse;
            dest.appendChild(klon);
            //-------------------- sætter en listener på alle posts, da de på et tidspunkt er det sidste post i loopet.
            dest.lastElementChild.addEventListener("click", () => {
                // kommer ind på siden alt efter dens id.
                location.href = "aktuelt-singleview.html?id=" + aktuel.id;
            });

        }


    })

    applyClass();

}

function applyClass() {
    // her vælger vi den udenom læggende div som vores aktuel-loopview posts fra Wordpress kommer ind i.
    let ul = document.querySelector(".container_aktuelt");
    // her fortæller vi der skal tælles child elemmenter, og at hver andet child skal have classen class3
    for (let i = 0; i < ul.childElementCount; i = i + 2) {
        ul.children[i].classList.toggle("class3");
    }
    farveKat();
}


function farveKat() {

    console.log("farvekat igang");

    //Her vælger vi attraktionen som dækker over de 3 museer.
    var farveKategorier = document.querySelectorAll(".attraktion");
    console.log(farveKategorier);
    // hvergang den støder på et museums navn, alt efter hvilket, skal den give en class ud af 3 classer som ændre farven.
    farveKategorier.forEach(function (em) {
        if (em.textContent == "Stevns Klint")
            em.classList.add("stevnskat");
        else if (em.textContent == "Koldkrigsmuseum Stevnsfort")
            em.classList.add("koldkat");
        else if (em.textContent == "Geomuseum Faxe")
            em.classList.add("geokat");
    })

}

//---------------------- Her kommer filter funktion!------------------------
document.querySelectorAll(".filter").forEach(elm => {
    // funktionen filtering skal startes ligegyldigt hvilken knap man trykker.
    elm.addEventListener("click", filtering);
});


function filtering() {
    console.log("filter-click");
    // data- kan holde information og her siger vi den information skal være den sammen som den trykkede knap.
    filter = this.getAttribute("data-kat");
    // her viser vi den valgte tekst på siden
    document.querySelector("#filter_tekst").textContent = this.textContent;
    // valgt classen sidder på "alle" knappen i starten, så når der trykkes på alle knapperne, skal den fjernes.
    document.querySelectorAll(".filter").forEach(elm => {
        elm.classList.remove("valgt");
    });
    // og sættes på den valgte knap!
    this.classList.add("valgt");
    console.log("valgt!", filter);
    visAktuelle();
}
