const API_KEY = 'e888b7d5740a43508ddee6cd91c1a5ec';
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

const choicesElem = document.querySelector('.js-choice');

const choices = new Choices(choicesElem, {
  searchEnabled: false,
  itemSelectText: '',
});


const getdata = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    }
  });

  const data = await response.json();

  return data;
};

const getDateCorrectFormat = (isoDate) => {
  const date = new Date(isoDate);
  const fullDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const fullTime = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });


  return `<span class="news-date">${fullDate}</span> ${fullTime}`
};

const getImage = (url) => new Promise((resolve) => {
  const image = new Image(270, 200);
  image.addEventListener('load', () => {
    resolve(image);
  });

  image.addEventListener('error', () => {
    image.src = './image/no-photo.jpg';
    resolve(image);
  });

  image.src = url || './image/no-photo.jpg';
  image.className = 'news-image';
  return image;
});

const renderCard = (data) => {
  newsList.textContent = '';
  data.forEach(async ({ urlToImage, title, url, description, publishedAt, author }) => {

    const card = document.createElement('li');
    card.className = 'news-item';

    const image = await getImage(urlToImage);
    image.alt = title;
    card.append(image);

    card.insertAdjacentHTML('beforeend', `
    <h3 class="news-title">
      <a href="${url}" class="news-link" target="_blank">${title || ''}</a>
    </h3>

    <p class="new-description">${description || ''}</p>

    <div class="news-footer">
      <time class="news-datetime" datetime="${publishedAt}">
        ${getDateCorrectFormat(publishedAt)}
      </time>
      <div class="new-author">${author || ''}</div>
    </div>
  `);

    newsList.append(card);
  });
};

const loadNews = async () => {
  newsList.innerHTML = '<li class="preLoad"></li>'
  const country = localStorage.getItem('country') || 'ru';
  choices.setChoiceByValue(country);
  title.classList.add('hide');
  const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100`);
  renderCard(data.articles);
};

const loadSearch = async (value) => {

  const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
  title.classList.remove('hide');
  title.textContent = `???? ???????????? ?????????????? ???${value}??? ?????????????? ${data.articles.length} ??????????????????????`;
  choices.setChoiceByValue('');
  renderCard(data.articles);
};

choicesElem.addEventListener('change', (event) => {

  const value = event.detail.value;
  localStorage.setItem('country', value);
  loadNews();
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  loadSearch(formSearch.search.value);
  formSearch.reset();
})

loadNews();

