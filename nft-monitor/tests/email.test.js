const { sendEmail, sendAlertReport, sendDailyReport } = require('../src/email');

describe('sendEmail', () => {
  it('должен быть функцией', () => {
    expect(typeof sendEmail).toBe('function');
  });
});

describe('sendAlertReport', () => {
  it('должен быть функцией', () => {
    expect(typeof sendAlertReport).toBe('function');
  });
});

describe('sendDailyReport', () => {
  it('должен быть функцией', () => {
    expect(typeof sendDailyReport).toBe('function');
  });
});
