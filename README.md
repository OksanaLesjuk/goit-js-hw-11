Це моя домашня робота із створення застосунку для пошуку зображень. Тут ви
можете прочитати умову домашнього завдання та додаткові завдання.

Умови ДЗ.

Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим
словом. Додай оформлення елементів інтерфейсу.

Для бекенду використовуй публічний API сервісу Pixabay. Зареєструйся, отримай
свій унікальний ключ доступу і ознайомся з документацією.

Якщо бекенд повертає порожній масив, значить нічого підходящого не було
знайдено. У такому разі показуй повідомлення з текстом "Sorry, there are no
images matching your search query. Please try again.". Для повідомлень
використовуй бібліотеку notiflix.

Елемент div.gallery спочатку міститься в HTML документі, і в нього необхідно
рендерити розмітку карток зображень. Під час пошуку за новим ключовим словом
необхідно повністю очищати вміст галереї, щоб не змішувати результати.

Pixabay API підтримує пагінацію і надає параметри page і per_page. Зроби так,
щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).

Початкове значення параметра page повинно бути 1. З кожним наступним запитом,
його необхідно збільшити на 1. У разі пошуку за новим ключовим словом, значення
page потрібно повернути до початкового, оскільки буде пагінація по новій
колекції зображень. HTML документ вже містить розмітку кнопки, по кліку на яку,
необхідно виконувати запит за наступною групою зображень і додавати розмітку до
вже існуючих елементів галереї.

<button type="button" class="load-more">Load more</button>

В початковому стані кнопка повинна бути прихована. Після першого запиту кнопка
з'являється в інтерфейсі під галереєю. При повторному сабміті форми кнопка
спочатку ховається, а після запиту знову відображається. У відповіді бекенд
повертає властивість totalHits - загальна кількість зображень, які відповідають
критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця
колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've
reached the end of search results.".

Додатково ! УВАГА Наступний функціонал не обов'язковий для здавання завдання,
але буде хорошою додатковою практикою.

Повідомлення Після першого запиту з кожним новим пошуком отримувати
повідомлення, в якому буде написано, скільки всього знайшли зображень
(властивість totalHits). Текст повідомлення - "Hooray! We found totalHits
images."

Бібліотека SimpleLightbox Додати відображення великої версії зображення з
бібліотекою SimpleLightbox для повноцінної галереї.

У розмітці необхідно буде обгорнути кожну картку зображення у посилання, як
зазначено в документації. Бібліотека містить метод refresh(), який обов'язково
потрібно викликати щоразу після додавання нової групи карток зображень. Для того
щоб підключити CSS код бібліотеки в проект, необхідно додати ще один імпорт,
крім того, що описаний в документації.

Прокручування сторінки Зробити плавне прокручування сторінки після запиту і
відтворення кожної наступної групи зображень.

Нескінченний скрол Замість кнопки «Load more», можна зробити нескінченне
завантаження зображень під час прокручування сторінки. Ми надаємо тобі повну
свободу дій в реалізації, можеш використовувати будь-які бібліотеки.

Також додано кнопку для прокрутки зображень на початок списку