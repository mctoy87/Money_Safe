// получим функцию проверки числа
import {convertStringNumber} from './convertStringNumber.js';

// получим форму
const financeForm = document.querySelector('.finance__form');
// получим сумму кошелька
const financeAmount = document.querySelector('.finance__amount');
// получим кнопку Отчет
const openReport = document.querySelector('.finance__report');
// получим окно Отчет
const report = document.querySelector('.report');
// получим крестик на окне Отчет
const closeReport = document.querySelector('.report__close');


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

// слушаем событие клика на кнопку открыть Отчет
openReport.addEventListener('click', (e) => {
  e.preventDefault();
  // добавим класс Отчету чтобы открыть его
  report.classList.add('report__open');
});
// слушаем событие клика на Отчет
report.addEventListener('click', (e) => {
  // если кликнули на крестик то закрываем окно
  if(e.target.closest('.report__close')) {
    report.classList.remove('report__open');
  }
});





