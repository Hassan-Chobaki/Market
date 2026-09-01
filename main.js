
import {translation} from "/public/js/lang.js";
import {loadLang} from "/public/js/language.js";
const lang=localStorage.getItem('lang')||'fa';
loadLang(lang);




export const currentLang=lang;
