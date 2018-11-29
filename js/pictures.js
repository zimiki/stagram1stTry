'use strict';

// БЛОК ВЫБОРА СЛУЧАЙНОГО

// 1. Выбирает  случайное значение  по диапазону
var getRandInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};
// 2. Выбирает случайное значение из массива
var getRandArr = function (arr) {
  var rand = Math.random() * arr.length;
  rand = Math.floor(rand);
  return arr[rand];
};
// 3. Выбирает случайное значение да/нет
var randBolean = Boolean(Math.round(Math.random()));
// 4. Магические числа
var ESC_KEYCODE = 27;

// СОЗДАНИЕ СЛУЧАЙНЫХ ДАННЫХ
function generateMockData() {
  var data = {
    photos: [],
    selectPhotoIndex: 0
  };
  var PHOTOS_LENGHT = 25;
  var MAX_COMMENTS = 4;
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var DESCRIPTION = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  //  Создает случайный комментарий из 1 или 2 предложений
  var generComments = function () {
    var comment = getRandArr(COMMENTS);
    var twoSentence = randBolean;
    if (twoSentence === true) {
      comment = getRandArr(COMMENTS) + ' ' + getRandArr(COMMENTS);
    }
    return comment;
  };

  //  Создает массив  с коментариями к одной фото
  var generArrComments = function () {
    var NumPhotoComments = getRandInt(1, MAX_COMMENTS);
    var photoComments = [];
    for (var i = 0; i < NumPhotoComments; i++) {
      photoComments[i] = generComments();
    }
    return photoComments;
  };

  //  Создает массив из всех возможных картинок
  var originPhotos = [];
  for (var i = 0; i < PHOTOS_LENGHT; i++) {
    originPhotos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandInt(15, 200),
      comments: generArrComments(),
      description: getRandArr(DESCRIPTION)
    };
  }

  // Формирование случайной последовательности, путем создание нового массива  данных из исходного
  for (var k = 0; k < PHOTOS_LENGHT; k++) {
    var randSpliceNum = getRandInt(1, originPhotos.length);
    var a = originPhotos.splice((randSpliceNum - 1), 1);
    data.photos.push(a[0]);
  }
  return data;
}


// ГЕНЕРАЦИЯ НА ОСНОВЕ ДАННЫХ
function renderAll(data) {

  // Создание страницы с маленькими фотографиями
  function renderPhotosOnPage() {
    // - создание одной фотографии в соответсвии с данными

    var renderPhoto = function () {
      var photoElement = template.cloneNode(true);
      photoElement.querySelector('.picture__img').src = data.photos[i].url;
      photoElement.querySelector('.picture__likes').textContent = data.photos[i].likes;
      photoElement.querySelector('.picture__comments').textContent = data.photos[i].comments.length;
      return photoElement;
    };
    //  - создание и вставка фрагмента маленьких фотографий
    var blockInt = document.querySelector('.pictures');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.photos.length; i++) {
      fragment.appendChild(renderPhoto());
      blockInt.appendChild(fragment);
    }
  }

  // Изменение блока с большой картинкой
  function renderBigPicturesOnPage(bigStyle) {
    // - заполнение блока большой фотографии данными из первого элемента сгенерированного  массива свойств, так указано в задании
    bigStyle.querySelector('img').src = data.photos[data.selectPhotoIndex].url;
    bigStyle.querySelector('.likes-count').textContent = data.photos[data.selectPhotoIndex].likes;
    bigStyle.querySelector('.comments-count').textContent = data.photos[data.selectPhotoIndex].comments.length;
    bigStyle.querySelector('.social__caption').textContent = data.photos[data.selectPhotoIndex].description;
    // - скрытие элементов п.5 задания
    bigStyle.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigStyle.querySelector('.comments-loader').classList.add('visually-hidden');
  }

  // Изменение блока с комментариями к большой фото
  function renderCommentsOnPage(bigStyle) {
    // - выборка коментрия, чтобы сохранился шаблон.  Удаление коментариев созданых в верстве
    var socialComment = bigStyle.querySelector('.social__comment');
    var socialComments = bigStyle.querySelector('.social__comments');
    // - удаление всех потомков, применяем ее на список коментариев
    var removeAllChildren = function (elem) {
      while (elem.lastChild) {
        elem.removeChild(elem.lastChild);
      }
    };
    removeAllChildren(socialComments);
    // - создание одного комментария по шаблону из верстки
    var renderComment = function () {
      var commentElement = socialComment.cloneNode(true);
      commentElement.querySelector('img').src = 'img/avatar-' + getRandInt(1, 6) + '.svg';
      commentElement.querySelector('p').textContent = data.photos[0].comments[i];
      return commentElement;
    };
    // - создание и вставка фрагмента комментариев
    var fragmentComments = document.createDocumentFragment();
    for (var i = 0; i < data.photos[0].comments.length; i++) {
      fragmentComments.appendChild(renderComment());
      socialComments.appendChild(fragmentComments);
    }
  }

  // Запуск отрисовки элементов на основе данных
  var template = document.querySelector('#picture').content.querySelector('a'); // шаблон для маленьких фото
  var bigPicrure = document.querySelector('.big-picture'); // шаблон для больших фото
  renderPhotosOnPage(data.photos);
  renderBigPicturesOnPage(bigPicrure);
  renderCommentsOnPage(bigPicrure);
}


// Блок для описания сценария popup большой фотографии
var showBigPictureModal = function () {
  var bigPicture = document.querySelector('.big-picture');
  var openBigPicture = document.querySelectorAll('.picture__img');
  var closeBigPicture = bigPicture.querySelector('#picture-cancel');

  // - открытие большой фотографии при нажатии на любую из галерии маленьких
  for (var i = 0; i < openBigPicture.length; i++) {
    openBigPicture[i].addEventListener('click', function () {
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);
    });
  }
  // описание как закрывается окно
  var closeModal = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };
  // -кнопка закрыть большую фотографию
  closeBigPicture.addEventListener('click', function () {
    closeModal();
  });
  // -закрытие окна по Esc
  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
    }
  };
};


// Блок для описания сценария popup фильтров фотографий
var showUploadModal = function () {
  var filtersSetting = document.querySelector('.img-upload__overlay');
  var openUploadFile = document.querySelector('#upload-file');
  var closeFiltersSetting = document.querySelector('#upload-cancel');

  // - открытие большой фото-фильтров
  openUploadFile.addEventListener('change', function () {
    filtersSetting .classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
  });
  // описание как закрывается окно фото-фильтров
  var closeModal = function () {
    filtersSetting.classList.add('hidden'); // !!!! Не сделано- обратите внимание на то, что при закрытии формы, дополнительно нужно сбрасывать значение поля выбора файла #upload-file.
    document.removeEventListener('keydown', onEscPress);
  };
  // -кнопка закрыть настройку фото-фильтров
  closeFiltersSetting.addEventListener('click', function () {
    closeModal();
  });
  // -закрытие окна по Esc
  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
    }
  };
};

// _______Блок расчета и наложения эффекта________
var EFFECT_CHROME_MAX = 1;
var EFFECT_SEPIA_MAX = 1;
var EFFECT_MARVIN_MAX = 100; // %
var EFFECT_PHOBOS_MAX = 5;
var EFFECT_HEAT_MAX = 3;

var levelLine = document.querySelector('.effect-level__line');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectHeat = document.querySelector('.effects__preview--heat');
var photo = document.querySelector('.img-upload__preview');

// ? определить чекнутый элемент и передать его


// Функция расчета значания от максимального
var onEffectLevelPin = function (evt) {
  var coordsLevelLine = levelLine.getBoundingClientRect();
  var leveLineWidth = coordsLevelLine.right - coordsLevelLine.left;
  var valueEffectLevel = (evt.clientX - coordsLevelLine.left) / leveLineWidth * EFFECT_HEAT_MAX;
  effectHeat.style.fiter = 'brightness(' + valueEffectLevel + ')';
  photo.classList.add('effects__preview--heat');
};

// Отлавливает событие отпускание пина
effectLevelPin.addEventListener('mouseup', onEffectLevelPin);


// Запуск функций срипта
var mockData = generateMockData();
renderAll(mockData);
showBigPictureModal();
showUploadModal();
