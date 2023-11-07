
// проверяет данные и приводит к целому числу
export const convertStringNumber = (str) => {
  // убираем все пробелы по регулярному выражению
  const noSpaceStr = str.replace(/\s+/g, '');
  // получим точное число с точкой
  const num = parseFloat(noSpaceStr);

  // проверим что точно получили число, а не NaN и что оно конечное
  if (!isNaN(num) && isFinite(num)) {
    // если так, то вернем это число
    return num;
  } else {
    // если нет, вернем false
    return false;
  }
}