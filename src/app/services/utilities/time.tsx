/*
    Creation Time: 2018 - Sep - 30
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import moment from 'moment-jalaali';
// @ts-ignore
import fa from "moment/locale/fa";
// @ts-ignore
import en from "moment/locale/en-ca";
import RiverTime from './river_time';
import {C_LOCALSTORAGE} from "../sdk/const";

class TimeUntiles {
    private riverTime: RiverTime;
    private lang: string = localStorage.getItem(C_LOCALSTORAGE.Lang) || 'en';

    constructor() {
        if (this.lang === 'fa') {
            moment.locale('fa', fa);
            moment.loadPersian({
                dialect: 'persian-modern',
                usePersianDigits: true,
            });
        } else {
            moment.locale('en', en);
        }
        this.riverTime = RiverTime.getInstance();
    }

    public full(timestamp: number) {
        if (this.lang === 'en') {
            return moment(timestamp).format('dddd, MMMM DD YYYY, HH:mm');
        } else {
            return moment(timestamp).format('jdddd, jMMMM jDD jYYYY, HH:mm');
        }
    }

    public fullOnlyDate(timestamp: number) {
        return moment(timestamp).format('dddd, MM/DD/YYYY');
    }

    public Date(timestamp: number) {
        return moment(timestamp).format('YYYY-MM-DD');
    }

    public DateParse(timestamp: number) {
        return moment(timestamp).format('MM/DD/YYYY');
    }

    public DateGet(date: string): number {
        return parseInt(moment(date, 'YYYY-MM-DD').format('x'), 10);
    }

    public DateUpdateTime(date: number, time: string): number {
        const timeSplit = time.split(':');
        return parseInt(moment(date).startOf('day')
            .add(timeSplit[0], 'hours').add(timeSplit[1], 'minutes').format('x'), 10);
    }

    public getDateTime(timestamp: number) {
        return moment(timestamp).format('HH/mm');
    }

    public addDateTime(time: string, date: any) {
        const timeSplit = time.split('/');
        return moment(date).add(timeSplit[0], 'hours').add(timeSplit[1], 'minutes').format('x');
    }

    public Time(timestamp: number) {
        return moment(timestamp).format('HH:mm');
    }

    public TimeParse(timestamp: number) {
        return moment(timestamp * 1000).format('hh:mm a');
    }

    public dynamic(timestamp: number | undefined) {
        if (!timestamp) {
            return '';
        }

        const date = moment(timestamp * 1000);
        const current = this.riverTime.milliNow();

        const justNow = moment().startOf('minute');
        if (date.isSameOrAfter(justNow)) {
            if (this.lang === 'en') {
                return 'Just Now';
            } else {
                return 'همین الان';
            }
        }

        const today = moment(current).startOf('day');
        if (date.isSameOrAfter(today)) {
            return date.format('HH:mm');
        }

        const yesterday = moment(current).startOf('day').subtract(1, 'days');
        if (date.isSameOrAfter(yesterday)) {
            if (this.lang === 'en') {
                return date.format('[Yesterday] HH:mm');
            } else {
                return date.format('[دیروز] HH:mm');
            }
        }

        const thisYear = moment(current).startOf('year');
        if (date.isSameOrAfter(thisYear)) {
            if (this.lang === 'en') {
                return date.format('MMM DD');
            } else {
                return date.format('jDD jMMMM');
            }
        }

        if (this.lang === 'en') {
            return date.format('DD[/]MM[/]YYYY');
        } else {
            return date.format('jDD[/]jMM[/]jYYYY');
        }
    }

    public dynamicDate(timestamp: number | undefined) {
        if (!timestamp) {
            return '';
        }

        const date = moment(timestamp * 1000);
        const current = this.riverTime.milliNow();

        const today = moment(current).startOf('day');
        if (date.isSameOrAfter(today)) {
            if (this.lang === 'en') {
                return date.format('[Today]');
            } else {
                return date.format('[امروز]');
            }
        }

        const yesterday = moment(current).startOf('day').subtract(1, 'days');
        if (date.isSameOrAfter(yesterday)) {
            if (this.lang === 'en') {
                return date.format('[Yesterday]');
            } else {
                return date.format('[دیروز]');
            }
        }

        const thisYear = moment(current).startOf('year');
        if (date.isSameOrAfter(thisYear)) {
            if (this.lang === 'en') {
                return date.format('MMM DD');
            } else {
                return date.format('jDD jMMMM');
            }
        }

        if (this.lang === 'en') {
            return date.format('DD[/]MM[/]YYYY');
        } else {
            return date.format('jDD[/]jMM[/]jYYYY');
        }
    }

    public exactTimeAgo(timestamp: number | undefined) {
        if (!timestamp) {
            return '';
        }

        const date = moment(timestamp * 1000);
        const current = this.riverTime.milliNow();

        const minute = moment(current).subtract(1, 'minutes');
        if (date.isSameOrAfter(minute)) {
            if (this.lang === 'en') {
                return 'Just now';
            } else {
                return 'به تازگی';
            }
        }

        const today = moment(current).startOf('day');
        if (date.isSameOrAfter(today)) {
            if (this.lang === 'en') {
                return date.format('[Today at] HH:mm');
            } else {
                return date.format('HH:mm [امروز]');
            }
        }

        const yesterday = moment(current).startOf('day').subtract(1, 'days');
        if (date.isSameOrAfter(yesterday)) {
            if (this.lang === 'en') {
                return date.format('[Yesterday at] HH:mm');
            } else {
                return date.format('[دیروز] HH:mm');
            }
        }

        const thisYear = moment(current).startOf('year');
        if (date.isSameOrAfter(thisYear)) {
            if (this.lang === 'en') {
                return date.format('MMM DD');
            } else {
                return date.format('jDD jMMMM');
            }
        }

        if (this.lang === 'en') {
            return date.format('DD[/]MM[/]YYYY');
        } else {
            return date.format('jDD[/]jMM[/]jYYYY');
        }
    }

    public timeAgo(timestamp: number | undefined) {
        if (!timestamp) {
            return '';
        }

        const current = this.riverTime.milliNow();
        const today = moment(current).startOf('day');
        const date = moment(timestamp * 1000);

        if (date.isSameOrAfter(today)) {
            if (this.lang === 'en') {
                return `${date.from(current, true)} ago`;
            } else {
                return `${date.from(current, true)} پیش `;
            }
        }

        if (date.isSameOrAfter(today)) {
            return date.format('HH:mm');
        }

        const yesterday = moment(current).startOf('day').subtract(7, 'days');
        if (date.isSameOrAfter(yesterday)) {
            if (this.lang === 'en') {
                return `${date.from(current, true)} ago`;
            } else {
                return `${date.from(current, true)} پیش `;
            }
        }

        const week = moment(current).startOf('day').subtract(14, 'days');
        if (date.isSameOrAfter(week)) {
            if (this.lang === 'en') {
                return 'Within a week';
            } else {
                return 'هفته گذشته';
            }
        }

        const month = moment(current).startOf('day').subtract(1, 'months');
        if (date.isSameOrAfter(month)) {
            if (this.lang === 'en') {
                return 'Within a month';
            } else {
                return 'ماه گذشته';
            }
        }

        if (this.lang === 'en') {
            return 'Long time ago';
        } else {
            return 'خیلی وقت پیش';
        }
    }

    public isInSameDay(time1?: number, time2?: number): boolean {
        if (!time1 || !time2) {
            return false;
        }
        const m1 = moment.parseZone(time1 * 1000);
        const m2 = moment.parseZone(time2 * 1000);
        return m1.isSame(m2, 'day');
    }
}

export default new TimeUntiles();
