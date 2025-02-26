declare type SimplerPickerEvent = 'submit' | 'close';
interface SimplerPickerOpts {
    zIndex?: number;
    compactMode?: boolean;
    selectedDate?: Date;
}
declare type HandlerFunction = (...args: unknown[]) => void;
interface EventHandlers {
    [key: string]: HandlerFunction[];
}
declare class SimplerPicker {
    selectedDate: Date;
    $simplerPicker: HTMLElement;
    readableDate: string;
    _eventHandlers: EventHandlers;
    _validOnListeners: readonly ["submit", "close"];
    private opts;
    private $;
    private $$;
    private $simplerpicker;
    private $simplerpickerWrapper;
    private $trs;
    private $tds;
    private $headerMonthAndYear;
    private $monthAndYear;
    private $date;
    private $day;
    private $timeInput;
    private $cancel;
    private $ok;
    private $today;
    private $displayDateElements;
    constructor(arg1?: HTMLElement | string | SimplerPickerOpts, arg2?: SimplerPickerOpts);
    initElMethod(el: any): void;
    init(el: HTMLElement, opts: SimplerPickerOpts): void;
    reset(newDate?: Date): void;
    compactMode(): void;
    injectTemplate(el: HTMLElement): void;
    clearRows(): void;
    updateDateComponents(date: Date): void;
    render(data: any): void;
    updateSelectedDate(el?: HTMLElement): void;
    selectDateElement(el: HTMLElement): void;
    findElementWithDate(date: any, returnLastIfNotFound?: boolean): any;
    handleIconButtonClick(el: HTMLElement): void;
    initListeners(): void;
    callEvent(event: SimplerPickerEvent, dispatcher: (a: HandlerFunction) => void): void;
    open(): void;
    close(): void;
    on(event: SimplerPickerEvent, handler: HandlerFunction): void;
    toogleDisplayFade(): void;
}
export = SimplerPicker;
