
```
npm i // Устанавливаем зависимости
npm start // Запускаем
```

Конфиг находится по адресу `config/config.json`, оставил отладку (console.log)

Потратил вечер на написание кода, перед этим изучил мануал по предварительной валидации коллекций mongodb

Из доп фич реализовал:
> Сделайте так, чтобы при клике по ссылке все события успели дойти до бекенда до перехода на новую страницу.

Отправка происходит с флагом keepalive: true.

Бонус-трек замечания:

- Для отправки CORS запроса без префлайт OPTIONS запроса необходимо использовать `Content-Type` с `application/x-www-form-urlencoded` или `multipart/form-data` или `text/plain`

- Cниппет вставки трекера на страницу в ga устроен именно таким образом для асинхронной инициализации клиентских данных и передачи их в основному коду трекера. После того, как код трекера загружен, происходит отправка событий инициализация трекера, просмотр страницы.