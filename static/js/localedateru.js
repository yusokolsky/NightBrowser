//! moment.js locale configuration
//! locale : Russian [ru]
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensule : https://github.com/Oire
//! author : ��������� ���� : https://github.com/socketpair

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
        'mm': withoutSuffix ? '������_������_�����' : '������_������_�����',
        'hh': '���_����_�����',
        'dd': '����_���_����',
        'MM': '�����_������_�������',
        'yy': '���_����_���'
    };
    if (key === 'm') {
        return withoutSuffix ? '������' : '������';
    }
    else {
        return number + ' ' + plural(format[key], +number);
    }
}
var monthsParse = [/^���/i, /^���/i, /^���/i, /^���/i, /^��[��]/i, /^���/i, /^���/i, /^���/i, /^���/i, /^���/i, /^���/i, /^���/i];

// http://new.gramota.ru/spravka/rules/139-prop : � 103
// ���������� �������: http://new.gramota.ru/spravka/buro/search-answer?s=242637
// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
var ru = moment.defineLocale('ru', {
    months : {
        format: '������_�������_�����_������_���_����_����_�������_��������_�������_������_�������'.split('_'),
        standalone: '������_�������_����_������_���_����_����_������_��������_�������_������_�������'.split('_')
    },
    monthsShort : {
        // �� CLDR ������ "���." � "���.", �� ����� ����� ������ ����� �� ����� ?
        format: '���._����._���._���._���_����_����_���._����._���._����._���.'.split('_'),
        standalone: '���._����._����_���._���_����_����_���._����._���._����._���.'.split('_')
    },
    weekdays : {
        standalone: '�����������_�����������_�������_�����_�������_�������_�������'.split('_'),
        format: '�����������_�����������_�������_�����_�������_�������_�������'.split('_'),
        isFormat: /\[ ?[��] ?(?:�������|���������|���)? ?\] ?dddd/
    },
    weekdaysShort : '��_��_��_��_��_��_��'.split('_'),
    weekdaysMin : '��_��_��_��_��_��_��'.split('_'),
    monthsParse : monthsParse,
    longMonthsParse : monthsParse,
    shortMonthsParse : monthsParse,

    // ������ �������� � ��������, �� ��� �����, ��� ���������, �� 4 �����, ���������� � ������ � ��� �����
    monthsRegex: /^(�����[��]|���\.?|������[��]|����?\.?|�����?|���\.?|�����[��]|���\.?|��[��]|���[��]|���\.?|���[��]|���\.?|�������?|���\.?|�������[��]|����?\.?|������[��]|���\.?|�����[��]|����?\.?|������[��]|���\.?)/i,

    // ����� �����������
    monthsShortRegex: /^(�����[��]|���\.?|������[��]|����?\.?|�����?|���\.?|�����[��]|���\.?|��[��]|���[��]|���\.?|���[��]|���\.?|�������?|���\.?|�������[��]|����?\.?|������[��]|���\.?|�����[��]|����?\.?|������[��]|���\.?)/i,

    // ������ �������� � ��������
    monthsStrictRegex: /^(�����[��]|������[��]|�����?|�����[��]|��[��]|���[��]|���[��]|�������?|�������[��]|������[��]|�����[��]|������[��])/i,

    // ���������, ������� ������������ ������ ����������� ������
    monthsShortStrictRegex: /^(���\.|����?\.|���[�.]|���\.|��[��]|���[��.]|���[��.]|���\.|����?\.|���\.|����?\.|���\.)/i,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD.MM.YYYY',
        LL : 'D MMMM YYYY �.',
        LLL : 'D MMMM YYYY �., HH:mm',
        LLLL : 'dddd, D MMMM YYYY �., HH:mm'
    },
    calendar : {
        sameDay: '[������� �] LT',
        nextDay: '[������ �] LT',
        lastDay: '[����� �] LT',
        nextWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[� ���������] dddd [�] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[� ���������] dddd [�] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[� ���������] dddd [�] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[��] dddd [�] LT';
                } else {
                    return '[�] dddd [�] LT';
                }
            }
        },
        lastWeek: function (now) {
            if (now.week() !== this.week()) {
                switch (this.day()) {
                    case 0:
                        return '[� �������] dddd [�] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[� �������] dddd [�] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[� �������] dddd [�] LT';
                }
            } else {
                if (this.day() === 2) {
                    return '[��] dddd [�] LT';
                } else {
                    return '[�] dddd [�] LT';
                }
            }
        },
        sameElse: 'L'
    },
    relativeTime : {
        future : '����� %s',
        past : '%s �����',
        s : '��������� ������',
        m : relativeTimeWithPlural,
        mm : relativeTimeWithPlural,
        h : '���',
        hh : relativeTimeWithPlural,
        d : '����',
        dd : relativeTimeWithPlural,
        M : '�����',
        MM : relativeTimeWithPlural,
        y : '���',
        yy : relativeTimeWithPlural
    },
    meridiemParse: /����|����|���|������/i,
    isPM : function (input) {
        return /^(���|������)$/.test(input);
    },
    meridiem : function (hour, minute, isLower) {
        if (hour < 4) {
            return '����';
        } else if (hour < 12) {
            return '����';
        } else if (hour < 17) {
            return '���';
        } else {
            return '������';
        }
    },
    dayOfMonthOrdinalParse: /\d{1,2}-(�|��|�)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'M':
            case 'd':
            case 'DDD':
                return number + '-�';
            case 'D':
                return number + '-��';
            case 'w':
            case 'W':
                return number + '-�';
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
