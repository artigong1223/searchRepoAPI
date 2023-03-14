const searchWrapper = document.querySelector('.search-input')
const input = searchWrapper.querySelector('input')
const autBox = searchWrapper.querySelector('.autocomplite')
const users = document.querySelector('.users');

// Удаление репозитория
users.addEventListener("click", function(e) {
    let target = e.target;  
    if (!target.classList.contains("btn-close")) {
        return;
    }
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
    for (let i = 0; i < users.length; i++) {
        const li = document.createElement('li')
        autBox.prepend(li)
        li.setAttribute('data-owner', users[i].owner.login)
        li.setAttribute('data-stars', users[i].stargazers_count)
        li.prepend(users[i].name)
    }
}

// Добавление репозитория
function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    const li = document.createElement('li')
    const button = document.createElement('button')
    button.classList.add("btn-close")
    li.prepend(button)
    li.prepend(`Name: ${name}\nOwner: ${owner}\nStars: ${stars}`)
    users.prepend(li)
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
            arr = await repo.items.filter(g => g.name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())).filter((a, b) => {
                if (b < 5) {
                    return a
                }
            })
            showRepo(arr)
        }
    }
    catch(e) {
        console.log(e)
    }
}


// Обертка
const debounce = (fn, debounceTime) => {
    let isCooldown
    return function() {
        clearTimeout(isCooldown)
        isCooldown = setTimeout(() => {
            fn.apply(this, arguments)
        }, debounceTime)
    }
};


const debouncedHandle = debounce(handleInput, 500)
input.addEventListener('input', debouncedHandle)
