function repeat(str: string, times: number): string {
  let repeated = '';
  for (let i = 1; i <= times; i++) {
    repeated += str;
  }

  return repeated;
}

export const htmlTemplate = `
<div class="simplerpicker-wrapper">
  <div class="simpilepicker-date-picker">
    <div class="simplerpicker-day-header"></div>
      <div class="simplerpicker-date-section">
        <div class="simplerpicker-month-and-year"></div>
        <div class="simplerpicker-date"></div>
        <div class="simplerpicker-time-section">
          <input type="time" value="12:00">
        </div>
      </div>
      <div class="simplerpicker-picker-section">
        <div class="simplerpicker-calender-section">
          <div class="simplerpicker-month-switcher simplerpicker-select-pane">
            <button type="button" class="simplerpicker-icon simplerpicker-icon-previous"></button>
            <div class="simplerpicker-selected-date"></div>
            <button type="button" class="simplerpicker-icon simplerpicker-icon-next"></button>
          </div>
          <div class="simplerpicker-calender">
            <table>
              <thead>
                <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
              </thead>
              <tbody>
                ${ repeat('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>', 6) }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="simplerpicker-bottom-part">
        <button type="button" class="simplerpicker-today-btn simplerpicker-btn" title="Today">Today</button>
        <button type="button" class="simplerpicker-cancel-btn simplerpicker-btn" title="Cancel">Cancel</button>
        <button type="button" class="simplerpicker-ok-btn simplerpicker-btn" title="OK">OK</button>
        <div class='simplerpicker-clearfloat'></div>
      </div>
  </div>
</div>
`;
