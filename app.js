const searchWrapper = document.querySelector('.search-input')
const input = searchWrapper.querySelector('input')
const autBox = searchWrapper.querySelector('.autocomplite')
const users = document.querySelector('.users');

// Удаление репозитория
users.addEventListener("click", function (e) {
    let target = e.target;  
    target.parentElement.remove();
});

// Обработчик добавление репозитория
autBox.addEventListener('click', function(e) {
    let target = e.target;
    addChosen(target);
    input.value = "";
    removePredictions();
})

// Удаление списка
function removePredictions() {
    autBox.textContent = "";
}

// Селект
const showRepo = (users) => {
    removePredictions()
    users.length = 5
    let usersData = users.join('')
    autBox.insertAdjacentHTML('afterbegin', usersData)
}

// Добавление репозитория
function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    users.insertAdjacentHTML('afterbegin', `<li>Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></li>`)
}

// API Github
async function handleInput(e) {
    let userData = e.target.value
    let arr = []
    if (userData == '' || userData.match(/\s/)) {
        removePredictions()
        return;
    }
    try {
        let response = await fetch(`https://api.github.com/search/repositories?q=${userData}`)
        if (response.ok) {
            let repo = await response.json()
            arr = await repo.items.filter(g => g.name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()))
                                  .map(g => `<li data-owner="${g.owner.login}" data-stars="${g.stargazers_count}">${g.name}</li>`)
            showRepo(arr)
        }
    }
    catch(e) {
        console.log(e)
    }
}


// Обертка
function debounce(f, ms) {
    let isCooldown = false;
    return function() {
      if (isCooldown) return;
      f.apply(this, arguments);
      isCooldown = true;
      setTimeout(() => isCooldown = false, ms);
    };
}


const debouncedHandle = debounce(handleInput, 500)
input.addEventListener('keyup', debouncedHandle)

