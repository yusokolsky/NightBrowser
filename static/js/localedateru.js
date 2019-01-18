//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensule : https://github.com/Oire
//! author :  оренберг ћарк : https://github.com/socketpair

;(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined'
       && typeof require === 'function' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
   factory(global.moment)
}(this, (function (moment) { 'use strict';


function plural(word, num) {
    var forms = word.split('_');
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
function relativeTimeWithPlural(number, withoutSuffix, key) {
    var format = {
        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh': 'час_часа_часов',
        'dd': 'день_дн€_дней',
        'MM': 'мес€ц_мес€ца_мес€цев',
        'yy': 'год_года_лет'
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}
var monthsParse = [/^€нв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й€]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^но€/i, /^дек/i];

// http://new.gramota.ru/spravka/rules/139-prop : І 103
// —окращени€ мес€цев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = moment.defineLocale('ru', {
    months : {
        format: '€нвар€_феврал€_марта_апрел€_ма€_июн€_июл€_августа_сент€бр€_окт€бр€_но€бр€_декабр€'.split('_'),
        standalone: '€нварь_февраль_март_апрель_май_июнь_июль_август_сент€брь_окт€брь_но€брь_декабрь'.split('_')
    },
    monthsShort : {
        // по CLDR именно "июл." и "июн.", но какой смысл мен€ть букву на точку ?
        format: '€нв._февр._мар._апр._ма€_июн€_июл€_авг._сент._окт._но€б._дек.'.split('_'),
        standalone: '€нв._февр._март_апр._май_июнь_июль_авг._сент._окт._но€б._дек.'.split('_')
    },
    weekdays : {
        standalone: 'воскресенье_понедельник_вторник_среда_четверг_п€тница_суббота'.split('_'),
        format: 'воскресенье_понедельник_вторник_среду_четверг_п€тницу_субботу'.split('_'),
        isFormat: /\[ ?[¬в] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
    },
    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    // полные названи€ с падежами, по три буквы, дл€ некоторых, по 4 буквы, сокращени€ с точкой и без точки
    monthsRegex: /^(€нвар[ь€]|€нв\.?|феврал[ь€]|февр?\.?|марта?|мар\.?|апрел[ь€]|апр\.?|ма[й€]|июн[ь€]|июн\.?|июл[ь€]|июл\.?|августа?|авг\.?|сент€бр[ь€]|сент?\.?|окт€бр[ь€]|окт\.?|но€бр[ь€]|но€б?\.?|декабр[ь€]|дек\.?)/i,

    // копи€ предыдущего
    monthsShortRegex: /^(€нвар[ь€]|€нв\.?|феврал[ь€]|февр?\.?|марта?|мар\.?|апрел[ь€]|апр\.?|ма[й€]|июн[ь€]|июн\.?|июл[ь€]|июл\.?|августа?|авг\.?|сент€бр[ь€]|сент?\.?|окт€бр[ь€]|окт\.?|но€бр[ь€]|но€б?\.?|декабр[ь€]|дек\.?)/i,

    // полные названи€ с падежами
    monthsStrictRegex: /^(€нвар[€ь]|феврал[€ь]|марта?|апрел[€ь]|ма[€й]|июн[€ь]|июл[€ь]|августа?|сент€бр[€ь]|окт€бр[€ь]|но€бр[€ь]|декабр[€ь])/i,

    // ¬ыражение, которое соотвествует только сокращЄнным формам
    monthsShortStrictRegex: /^(€нв\.|февр?\.|мар[т.]|апр\.|ма[€й]|июн[ь€.]|июл[ь€.]|авг\.|сент?\.|окт\.|но€б?\.|дек\.)/i,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY г.',
        LLL : 'D MMMM YYYY г., HH:mm',
        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
    },
    calendar : {
        sameDay: '[—егодн€ в] LT',
        nextDay: '[«автра в] LT',
        lastDay: '[¬чера в] LT',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[¬ следующее] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[¬ следующий] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[¬ следующую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[¬о] dddd [в] LT';
                } else {
                    return '[¬] dddd [в] LT';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[¬ прошлое] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[¬ прошлый] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[¬ прошлую] dddd [в] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[¬о] dddd [в] LT';
                } else {
                    return '[¬] dddd [в] LT';
                }
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : 'через %s',
        past : '%s назад',
        s : 'несколько секунд',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : 'час',
        hh : relativeTimeWithPlural,
        d : 'день',
        dd : relativeTimeWithPlural,
        M : 'мес€ц',
        MM : relativeTimeWithPlural,
        y : 'год',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /ночи|утра|дн€|вечера/i,
    isPM : function (input) {
        return /^(дн€|вечера)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return 'ночи';
        } else if (hour < 12) {
            return 'утра';
        } else if (hour < 17) {
            return 'дн€';
        } else {
            return 'вечера';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(й|го|€)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-й';
            case 'D':
                return number + '-го';
            case 'w':
            case 'W':
                return number + '-€';
            default:
                return number;
        }
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});

return ru;

})));
