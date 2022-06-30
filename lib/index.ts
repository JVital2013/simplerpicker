import * as dateUtil from './date-util';
import { htmlTemplate } from './template';

type SimplerPickerEvent = 'submit' | 'close';
interface SimplerPickerOpts {
  zIndex?: number;
  compactMode?: boolean;
  selectedDate?: Date;
}

const validListeners = [
  'submit',
  'close',
] as const;

type HandlerFunction = (...args: unknown[]) => void;
interface EventHandlers {
  [key: string]: HandlerFunction[];
}

const today = new Date();
class SimplerPicker {
  selectedDate: Date;
  $simplerPicker: HTMLElement;
  readableDate: string;
  _eventHandlers: EventHandlers;
  _validOnListeners = validListeners;

  private opts: SimplerPickerOpts;
  private $: Function;
  private $$: Function;
  private $simplerpicker: HTMLElement;
  private $simplerpickerWrapper: HTMLElement;
  private $trs: HTMLElement[];
  private $tds: HTMLElement[];
  private $headerMonthAndYear: HTMLElement;
  private $monthAndYear: HTMLElement;
  private $date: HTMLElement;
  private $day: HTMLElement;
  private $timeInput: HTMLInputElement;
  private $cancel: HTMLElement;
  private $ok: HTMLElement;
  private $today: HTMLElement;
  private $displayDateElements: HTMLElement[];

  constructor(arg1?: HTMLElement | string | SimplerPickerOpts, arg2?: SimplerPickerOpts) {
    let el: HTMLElement | undefined = undefined;
    let opts: SimplerPickerOpts | undefined = arg2;

    if (typeof arg1 === 'string') {
      const element = <HTMLElement> document.querySelector(arg1);
      if (element !== null) {
        el = element;
      } else {
        throw new Error('Invalid selector passed to SimplerPicker!');
      }
    } else if (arg1 instanceof HTMLElement) {
      el = arg1;
    } else if (typeof arg1 === 'object') {
      opts = arg1 as SimplerPickerOpts;
    }

    if (!el) {
      el = <HTMLElement> document.querySelector('body');
    }

    if (!opts) {
      opts = {};
    }

    this.selectedDate = new Date();
    this.injectTemplate(el);
    this.init(el, opts);
    this.initListeners();

    this._eventHandlers = {};
  }

  // We use $, $$ as helper method to conviently select
  // element we need for simplerpicker.
  // Also, Limit the query to the wrapper class to avoid
  // selecting elements on the other instance.
  initElMethod(el) {
    this.$ = (sel) => el.querySelector(sel);
    this.$$ = (sel) => el.querySelectorAll(sel);
  }

  init(el: HTMLElement, opts: SimplerPickerOpts) {
    this.$simplerpickerWrapper = <HTMLElement> el.querySelector('.simplerpicker-wrapper');
    this.initElMethod(this.$simplerpickerWrapper);

    const { $, $$ } = this;
    this.$simplerpicker = $('.simpilepicker-date-picker');
    this.$trs = $$('.simplerpicker-calender tbody tr');
    this.$tds = $$('.simplerpicker-calender tbody td');
    this.$headerMonthAndYear = $('.simplerpicker-month-and-year');
    this.$monthAndYear = $('.simplerpicker-selected-date');
    this.$date = $('.simplerpicker-date');
    this.$day = $('.simplerpicker-day-header');
    this.$timeInput = $('.simplerpicker-time-section input');
    this.$cancel = $('.simplerpicker-cancel-btn');
    this.$ok = $('.simplerpicker-ok-btn');
    this.$today = $('.simplerpicker-today-btn');

    this.$displayDateElements = [
      this.$day,
      this.$headerMonthAndYear,
      this.$date
    ];

    this.render(dateUtil.scrapeMonth(today));

    opts = opts || {};
    this.opts = opts;

    this.reset(opts.selectedDate || today);

    if (opts.zIndex !== undefined) {
      this.$simplerpickerWrapper.style.zIndex = opts.zIndex.toString();
    }

    if (opts.compactMode) {
      this.compactMode();
    }
  }

  // Reset by selecting current date.
  reset(newDate?: Date) {
    let date = newDate || new Date();
    this.render(dateUtil.scrapeMonth(date));

    // The timeFull variable below will be formatted as HH:mm:ss.
    // Using regular experssion we remove the :ss parts.
    const timeFull = date.toTimeString().split(" ")[0]
    const time = timeFull.replace(/\:\d\d$/, "");
    this.$timeInput.value = time;

    const dateString = date.getDate().toString();
    const $dateEl = this.findElementWithDate(dateString);
    if (!$dateEl.classList.contains('active')) {
      this.selectDateElement($dateEl);
      this.updateDateComponents(date);
    }
  }

  compactMode() {
    const { $date } = this;
    $date.style.display = 'none';
  }

  injectTemplate(el: HTMLElement) {
    const $template = document.createElement('template');
    $template.innerHTML = htmlTemplate;
    el.appendChild($template.content.cloneNode(true));
  }

  clearRows() {
    this.$tds.forEach((td) => {
      td.innerHTML = '';
      td.classList.remove('active');
    });
  }

  updateDateComponents(date: Date) {
    const day = dateUtil.days[date.getDay()];
    const month = dateUtil.months[date.getMonth()];
    const year = date.getFullYear();
    const monthAndYear = month + ' ' + year;

    this.$headerMonthAndYear.innerHTML = monthAndYear;
    this.$monthAndYear.innerHTML = monthAndYear;
    this.$day.innerHTML = day;
    this.$date.innerHTML = dateUtil.getDisplayDate(date);
  }

  render(data) {
    const { $$, $trs } = this;
    const { month, date } = data;

    this.clearRows();
    month.forEach((week, index) => {
      const $tds = $trs[index].children;
      week.forEach((day, index) => {
        const td = $tds[index];
        if (!day) {
          td.setAttribute('data-empty', '');
          return;
        }

        td.removeAttribute('data-empty');
        td.innerHTML = day;
      });
    });

    const $lastRowDates = $$('table tbody tr:last-child td');
    let lasRowIsEmpty = true;
    $lastRowDates.forEach(date => {
      if (date.dataset.empty === undefined) {
        lasRowIsEmpty = false;
      }
    });

    // hide last row if it's empty to avoid
    // extra spacing due to last row
    const $lastRow = $lastRowDates[0].parentElement;
    if (lasRowIsEmpty && $lastRow) {
      $lastRow.style.display = 'none';
    } else {
      $lastRow.style.display = 'table-row';
    }

    this.updateDateComponents(date);
  }

  updateSelectedDate(el?: HTMLElement) {
    const { $monthAndYear, $timeInput, $date } = this;

    let day;
    if (el) {
      day = el.innerHTML.trim();
    } else {
      day = this.$date.innerHTML.replace(/[a-z]+/, '');
    }

    const [ monthName, year ] = $monthAndYear.innerHTML.split(' ');
    const month = dateUtil.months.indexOf(monthName);
    let timeComponents = $timeInput.value.split(':');
    let hours = +timeComponents[0];
    let minutes = timeComponents[1];

    const date = new Date(+year, +month, +day, +hours, +minutes);
    this.selectedDate = date;

    let _date = day + ' ';
    _date += $monthAndYear.innerHTML.trim() + ' ';
    _date += $timeInput.value.trim();
    this.readableDate = _date.replace(/^\d+/, date.getDate().toString());
  }

  selectDateElement(el: HTMLElement) {
    const alreadyActive = this.$('.simplerpicker-calender tbody .active');
    el.classList.add('active');
    if (alreadyActive && alreadyActive != el) {
      alreadyActive.classList.remove('active');
    }

    this.updateSelectedDate(el);
    this.updateDateComponents(this.selectedDate);
  }

  findElementWithDate(date, returnLastIfNotFound: boolean = false) {
    const { $tds } = this;

    let el, lastTd;
    $tds.forEach((td) => {
      const content = td.innerHTML.trim();
      if (content === date) {
        el = td;
      }

      if (content !== '') {
        lastTd = td;
      }
    });

    if (el === undefined && returnLastIfNotFound) {
      el = lastTd;
    }

    return el;
  }

  handleIconButtonClick(el: HTMLElement) {
    const { $ } = this;
    const baseClass = 'simplerpicker-icon-';
    const nextIcon = baseClass + 'next';
    const previousIcon = baseClass + 'previous';
    const calenderIcon = baseClass + 'calender';
    const timeIcon = baseClass + 'time';

    let selectedDate;
    const $active = $('.simplerpicker-calender td.active');
    if ($active) {
      selectedDate = $active.innerHTML.trim();
    }

    if (el.classList.contains(nextIcon)) {
      this.render(dateUtil.scrapeNextMonth());
    }

    if (el.classList.contains(previousIcon)) {
      this.render(dateUtil.scrapePreviousMonth());
    }

    if (selectedDate) {
      let $dateTd = this.findElementWithDate(selectedDate, true);
      this.selectDateElement($dateTd);
    }
  }

  initListeners() {
    const {
      $simplerpicker, $timeInput, $today,
      $ok, $cancel, $simplerpickerWrapper
    } = this;
    const _this = this;
    $simplerpicker.addEventListener('click', function (e) {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();

      e.stopPropagation();
      if (tagName === 'td') {
        _this.selectDateElement(target);
        return;
      }

      if (tagName === 'button' &&
          target.classList.contains('simplerpicker-icon')) {
        _this.handleIconButtonClick(target);
        return;
      }
    });

    $timeInput.addEventListener('input', (e: any) => {
      if (e.target.value === '') {
        return;
      }

      const formattedTime = dateUtil.formatTimeFromInputElement(e.target.value);
      _this.updateSelectedDate();
    });
    
    $today.addEventListener('click', function () {
    	_this.reset();
    })

    $ok.addEventListener('click', function () {
      _this.close();
      _this.callEvent('submit', function (func) {
        func(_this.selectedDate, _this.readableDate);
      });
    });

    function close() {
      _this.close();
      _this.callEvent('close', function (f) { f() });
    };

    $cancel.addEventListener('click', close);
    $simplerpickerWrapper.addEventListener('click', close);
  }

  callEvent(event: SimplerPickerEvent, dispatcher: (a: HandlerFunction) => void) {
    const listeners = this._eventHandlers[event] || [];
    listeners.forEach(function (func: HandlerFunction) {
      dispatcher(func);
    });
  }

  open() {
    this.$simplerpickerWrapper.classList.add('active');
  }

  // can be called by user or by click the cancel btn.
  close() {
    this.$simplerpickerWrapper.classList.remove('active');
  }

  on(event: SimplerPickerEvent, handler: HandlerFunction) {
    const { _validOnListeners, _eventHandlers } = this;
    if (!_validOnListeners.includes(event)) {
      throw new Error('Not a valid event!');
    }

    _eventHandlers[event] = _eventHandlers[event] || [];
    _eventHandlers[event].push(handler);
  }

  toogleDisplayFade() {
    this.$displayDateElements.forEach($el => {
      $el.classList.toggle('simplerpicker-fade');
    });
  }
}

export = SimplerPicker;
