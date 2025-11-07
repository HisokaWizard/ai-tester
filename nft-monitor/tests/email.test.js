// Мокаем nodemailer
jest.mock('nodemailer');
const nodemailer = require('nodemailer');

// Мокаем transporter глобально
const mockTransporter = {
  sendMail: jest.fn().mockResolvedValue(true),
};
nodemailer.createTransport.mockReturnValue(mockTransporter);

// Устанавливаем переменные окружения перед импортом
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_RECIPIENT = 'recipient@example.com';
process.env.EMAIL_RECIPIENTS = JSON.stringify({
  hisoka: 'hisoka@example.com',
  fedor: 'fedor@example.com',
});

// Импортируем реальные функции для тестирования
const { sendEmail, sendAlertReport, sendDailyReport } = require('../src/email');

// Мокаем console.error чтобы не засорять вывод
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть функцией', () => {
    expect(typeof sendEmail).toBe('function');
  });

  it('должен отправлять email с HTML-контентом', async () => {
    await sendEmail('Test Subject', 'Test text', '<h1>Test HTML</h1>');

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test text',
      html: '<h1>Test HTML</h1>',
    });
  });

  it('должен отправлять email без HTML-контента', async () => {
    await sendEmail('Test Subject', 'Test text');

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test text',
    });
  });
});

describe('sendAlertReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть функцией', () => {
    expect(typeof sendAlertReport).toBe('function');
  });

  it('должен отправлять алерт при значительных изменениях', async () => {
    const significantChanges = [
      ['collection1', { current: 1.5, fourHourChange: 15, dailyChange: 5 }],
    ];

    await sendAlertReport(significantChanges);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Значительные изменения цен NFT',
      text: 'Обнаружены изменения >10% за 4 часа:\n\ncollection1: +15.00% (текущая цена: 1.5)',
    });
  });

  it('должен отправлять алерт с указанным получателем', async () => {
    const significantChanges = [
      ['collection1', { current: 1.5, fourHourChange: 15, dailyChange: 5 }],
    ];

    await sendAlertReport(significantChanges, 'custom@example.com');

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'custom@example.com',
      subject: 'Значительные изменения цен NFT',
      text: 'Обнаружены изменения >10% за 4 часа:\n\ncollection1: +15.00% (текущая цена: 1.5)',
    });
  });

  it('не должен отправлять email если нет изменений', async () => {
    await sendAlertReport([]);

    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });
});

describe('sendDailyReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть функцией', () => {
    expect(typeof sendDailyReport).toBe('function');
  });

  it('должен генерировать HTML-таблицу с округленными ценами и форматированными изменениями', async () => {
    const changes = {
      collection1: { current: 1.23456, dailyChange: 5.678 },
      collection2: { current: 2.789, dailyChange: -3.21 },
      collection3: { current: 0.1234, dailyChange: null },
    };

    await sendDailyReport(changes);

    const callArgs = mockTransporter.sendMail.mock.calls[0][0];
    expect(callArgs.html).toContain('<h2>Ежедневный отчет по ценам NFT</h2>');
    expect(callArgs.html).toContain(
      '<strong>Среднее изменение за день: 1.23%</strong>'
    );
    expect(callArgs.html).toContain('<td style="padding: 8px;">1.2346</td>');
    expect(callArgs.html).toContain(
      '<td style="padding: 8px; color: green;">+5.68%</td>'
    );
    expect(callArgs.html).toContain(
      '<td style="padding: 8px; color: red;">-3.21%</td>'
    );
    expect(callArgs.html).toContain(
      '<td style="padding: 8px; color: black;">0.00%</td>'
    );
  });

  it('должен отправлять ежедневный отчет с указанным получателем', async () => {
    const changes = {
      collection1: { current: 1.0, dailyChange: 10 },
    };

    await sendDailyReport(changes, 'custom@example.com');

    const callArgs = mockTransporter.sendMail.mock.calls[0][0];
    expect(callArgs.to).toBe('custom@example.com');
    expect(callArgs.subject).toBe('Ежедневный отчет по ценам NFT');
  });

  it('должен правильно рассчитывать среднее изменение', async () => {
    const changes = {
      collection1: { current: 1, dailyChange: 10 },
      collection2: { current: 2, dailyChange: 20 },
      collection3: { current: 3, dailyChange: null }, // не учитывается в среднем
    };

    await sendDailyReport(changes);

    const callArgs = mockTransporter.sendMail.mock.calls[0][0];
    expect(callArgs.html).toContain(
      '<strong>Среднее изменение за день: 15.00%</strong>'
    );
    expect(callArgs.text).toContain('Среднее изменение за день: 15.00%');
  });
});
