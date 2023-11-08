// получим функцию проверки числа
import {convertStringNumber} from './convertStringNumber.js';
// импорт из библиотеки OverlayScrollbars для кастомизации скроллбара
import {OverlayScrollbars} from './overlayscrollbars.esm.min.js';

//адрес сервера с glitch
const API_URL = 'https://principled-lush-tortellini.glitch.me/api';

// зададим тип операции (приход или уход денег в Отчете)
const typeOperation = {
  income: "доход",
  expenses: "расход",
};

// получим форму
const financeForm = document.querySelector('.finance__form');
// получим сумму кошелька
const financeAmount = document.querySelector('.finance__amount');
// получим кнопку Отчет
const financeReport = document.querySelector('.finance__report');
// получим окно Отчет
const report = document.querySelector('.report');
// получим tbody
const reportOperationList = document.querySelector('.report__operation-list');
// получим форму филтрации отчета по дате
const reportDates = document.querySelector('.report__dates');

// создадим счетчик с текущим значением кошелька
let amount = 0;

// зададим текущее значение кошелька 
financeAmount.textContent = amount;

// слушаем событие отправки в форме (на кнопку плюс или минус)
financeForm.addEventListener('submit', (event) => {
  // уберем автоматическую отправку формы на сервер
  event.preventDefault();
  // обращаемся к submitter (кнопка отправки формы - плюс или минус)
  // и получаем его data-атрибут  
  const typeOperation = event.submitter.dataset.typeOperation;

  // получим сумму, которую вводит пользователь в форму по 'name',
  // предварительно проверив что это число и приведем Math к натуральному
  const changeAmount = Math.abs(convertStringNumber(financeForm.amount.value));

  // если кликаем по "+"
  if (typeOperation === 'income') {
    // счетчик равняем текущему значению + то что введет пользователь
    amount += changeAmount;
  }
  // если кликаем по "-"
  if (typeOperation === 'expenses') {
    // сч[етчик равняем текущему значению - то что введет пользователь
    amount -= changeAmount;
  }

  // выводим счетчик кошелька на страницу с разделением по тысячам
  financeAmount.textContent = `${amount.toLocaleString()} ₽`;
});

// ф-я закрытия Отчета
// деструктуируем и вытаскиваем сразу таргет
const closeReport = ({ target }) => {
  
  // если клик на крестик или не не по Отчету
  if (
     // если клик на кнопку крестик
    target.closest('.report__close') ||
    // если клик мимо Отчета и это не кнопка Открыть отчет
    // клик по кнопке Открыть м.б. т.к. событие и таргет один у ф-и откр и закр Отчета
    (!target.closest('.report') && target !== financeReport)
  ) {
    // анимируем закрытие отчета через JSAP
    gsap.to(report, {
    opacity: 0,
    scale: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete() {
      // делаем невидимым отчет в конце анимации
      report.style.visibility = 'hidden';
    },
  });

    // убираем слушателя всего документа
    document.removeEventListener('click', closeReport)
  }
};

// функция открыть Отчет
const openReport = () => {
  // делаем видимым отчет
  report.style.visibility = 'visible';
  // анимируем открытие отчета через JSAP
  gsap.to(report, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });

  // слушаем клик по крестику для закрытия Отчета
  document.addEventListener('click', closeReport)
};

// получает данные с сервера
const getData = async (url) => {
  try {
    // делаем запрос к API(серверу) по переданному url
    const response = await fetch(`${API_URL}${url}`);
    // проверим статус ответа от сервера и если false
    if (!response.ok) {
      // создаем сами ошибку и передаем код ответа сервера
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // если true, то вернем данные в формате json
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении данных: ', error);
    // если будут ошибки которые catch не поймет
    throw error;
  }
};

// изменяет формат даты на нужный
const reformatDate = (dateStr) => {
  // деструктуируем dateStr с помощью split, кот. создаст массив разделяя по дефису
  const [year, mounth, day] = dateStr.split('-');
  // соберем дату в нужном формате
  // padStart добавит второй символ если число не двухзначное
  return `${day.padStart(2, "0")}.${mounth.padStart(2, "0")}.${year}`
};

// ф-я рендерит данные
const renderReport = (data) => {
  // очищаем tbody таблицу
  reportOperationList.textContent = '';

  // формируем строки таблицы
  // деструктуируем каждую операцию в data 
  const reportRows = data.map(
    ({category, amount, description, date, type}) => {
      // создаем новую строку 
      const reportRow = document.createElement('tr');
      // добавим ей класс
      reportRow.classList.add('report__row');
      // вставить в эту строку все что нужно из верстки, добавив данные из data
      reportRow.innerHTML = `
        <td class="report__cell">${category}</td>
        <td class="report__cell">${amount.toLocaleString()}&nbsp₽</td>
        <td class="report__cell">${description}</td>
        <td class="report__cell">${reformatDate(date)}</td>
        <td class="report__cell">${typeOperation[type]}</td>
        <td class="report__action-cell">
          <button
            class="report__button report__button_table">&#10006;</button>
        </td>
      `;
      // вернем сформированную строку в reportRows
      return reportRow;
  });

  // вставим в tbody таблицы все сформированные строки
  reportOperationList.append(...reportRows);
};

// слушаем событие клика на кнопку открыть Отчет
financeReport.addEventListener('click', async () => {
  // сохраняем первоначальный текст в Отчете
  const textContent = financeReport.textContent;

  // вместо прелоадера пишем тестом загрузка и disaled отчет
  financeReport.textContent = "Загрузка...";
  financeReport.disabled = true;

  // запрос к серверу и получение данных
  const data = await getData("/test");

  // убирам прелоадер и возвращаем прежний текст и делаем кнопку опять активной
  financeReport.textContent = textContent;
  financeReport.disabled = false;

  // отобразить данные с сервера
  renderReport(data);

  // открыть Отчет через ф-ю
  openReport();
});

// слушаем событие клика на Отчет
report.addEventListener('click', (e) => {
  // если кликнули на крестик то закрываем окно
  if(e.target.closest('.report__close')) {
    report.classList.remove('report__open');
  }
});

// кастомизируем скроллбар
OverlayScrollbars(report, {});

// слушатель на фильтр внутри отчета
reportDates.addEventListener('submit', async (e) => {
  e.preventDefault();

  // получить данные в формате formdata из формы фильтра 
  const formData = Object.fromEntries(new FormData(reportDates));

  // создаем объект search-параметрами
  const searchParams = new URLSearchParams();

  // проверяем есть ли в FormData наши параметры поиска
  if (formData.startDate) {
    // если есть, то добавим в search параметры 
    searchParams.append('startDate', formData.startDate)
  };

  // проверяем есть ли в FormData наши параметры поиска
  if (formData.endDate) {
    // если есть, то добавим в search параметры 
    searchParams.append('endDate', formData.endDate)
  };
  // формируем queryString, т.е. одну строку со всеми query параметрами
  const queryString = searchParams.toString();

  // формирует url в зависимости есть query-параметры или если нет
  const url = queryString ? `/test?${queryString}` : '/test';
  
  // запрос к серверу и получение данных с search-параметрами
  const data = await getData(url);

  // отобразить данные с сервера
  renderReport(data);
});





