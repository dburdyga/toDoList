// План:
// 0. Составить план +++
// 1. Составить прототип верстки +++
// 2. Отрендерить тестовые объекты +++
// 3. Реализовать добавление дел +++
// 4. Реализовать удаление дел +++
// 5. Реализовать редактирование дел +++
// 6. Реализовать сохранение в хранилище (localStorage) +++

let store = localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')) : [];

const todo = document.querySelector('.todo__list'),
    addInput = document.querySelector('.todo__add-input'),
    saveButton = document.querySelector('.todo__save-btn');


//render actions
const createElement = item => {
    const li = document.createElement('li');
    li.classList.add('todo__item');
    li.setAttribute('data-id', item.id);
    const name = document.createElement('div');
    name.classList.add('todo__name');
    name.innerText = item.name; //вносим данные из массива
    const input = document.createElement('input');
    input.classList.add('todo__input');
    input.value = item.name;
    input.setAttribute('data-id', item.id)
    const actions = document.createElement('div');
    actions.classList.add('todo__actions');
    const close = document.createElement('div');
    close.classList.add('todo__close');

    actions.appendChild(close);
    li.appendChild(name);
    li.appendChild(input);
    li.appendChild(actions);

    return li;
};
const render = list => {
    list.innerHTML = '';

    list.forEach(item => {
        const li = createElement(item)
        todo.appendChild(li);
    })
};
//add actions
const addItemToStore = name => {
    const item = { id: Date.now(), name };
    store.push(item);

    return item;
}

const addItemToHtml = item => {
    const li = createElement(item);
    todo.appendChild(li);
};

// delete actions
const removeItemFromStore = id => {
    // отфильтровываем лишние id
    store = store.filter(item => item.id !== Number(id));
}

const removeItemFromHtml = li => {
    li.remove();
}

//edit actions
const editItemInStore = (id, name) => {
    const founed = store.find(item => item.id === +id);
    founed.name = name;
}

const editItemInHtml = input => {
    const li = input.closest('.todo__item');
    const name = li.querySelector('.todo__name');
    name.innerText = input.value;
}

//helpers
const closeActiveInput = () => {
    const inputs = document.querySelectorAll('.todo__input');
    inputs.forEach(elem => elem.style.display='none');
}

//event handlers
addInput.addEventListener('keyup', e => {
    if (e.keyCode !== 13) return;
    if(!e.target.value || e.target.value.length < 3) return;

    const item = addItemToStore(e.target.value);
    addItemToHtml(item); //рендер
    e.target.value = "";
});

todo.addEventListener('click', e => {
    if (!e.target.classList.contains('todo__close')) return; //клик только по кнопке close
    const close = e.target;
    const li = close.closest('.todo__item'); //ищем ближайший вверх (li)
    const id = li.getAttribute('data-id');

    removeItemFromStore(id);
    removeItemFromHtml(li);

});

todo.addEventListener('dblclick', e => {
    if (!e.target.classList.contains('todo__name')) return;
    closeActiveInput();


    const li = e.target.closest('.todo__item');
    const input = li.querySelector('.todo__input');
    input.style.display = 'block';
});

todo.addEventListener('keyup', e => {

    const input = e.target;
    const id = input.getAttribute('data-id');
    editItemInStore(id, input.value);
    editItemInHtml(input);
})

document.addEventListener('click', e => {
    if (!e.target.classList.contains('todo__name')) return;
    closeActiveInput();
})

saveButton.addEventListener('click', e => {
    localStorage.setItem('store', JSON.stringify(store));
    alert('Data saved!')
})

render(store);


