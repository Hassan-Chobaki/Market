import { translation } from "/public/js/lang.js";

const languageButton = document.getElementById("changeLanguage");
if(languageButton)
 languageButton.addEventListener("click", changeLanguage);


export function loadLang(lang) {

    document.documentElement.lang = lang;

    if (lang === "fa") {
        document.documentElement.dir = "rtl";
    } else {
        document.documentElement.dir = "ltr";
    }

    const items = document.querySelectorAll("[data-i18n]");

    items.forEach(item => {

        const key = item.getAttribute("data-i18n");

        item.textContent = translation[lang][key];

        if(item.tagName==='INPUT'){
            item.placeholder=translation[lang][key];

        }
        else{
            item.textContent=translation[lang][key]
        }

    });

   

}


export function changeLanguage() {

    const currentLang = localStorage.getItem("lang") || "fa";

    const newLang = currentLang === "fa" ? "en" : "fa";

    localStorage.setItem("lang", newLang);

    loadLang(newLang);

}


const savedLang = localStorage.getItem("lang") || "fa";

loadLang(savedLang);

