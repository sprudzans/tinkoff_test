'use strict'

let catalog = document.querySelector('#catalog'),
    cartCall = document.querySelector('#cartCall'),
    cart = document.querySelector('#cart'),
    cartValue = document.querySelector('#cartValue'),
    cartQuantity = document.querySelector('#cartQuantity'),
    data = [];


let request = new XMLHttpRequest();
request.open('GET', 'data.json');
request.responseType = 'json';

request.send();
request.onload = function () {
    data = request.response;
    catalogLoad();
}

function catalogLoad() {
    data["products"].forEach(element => {
        catalog.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <img class="card-img-top" src="${element.image}" alt="${element.name}" >
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.price} р.</h6>
                        <p class="card-text">${element.description}</p>
                        <div class="d-flex justify-content-end"> 
                            <div class="btn-group"> 
                                <button type="button" class="btn btn-success" onclick="addCart(${element.id})">Добавить в корзину</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function addCart(id) {
    let item = data.products.find(item => item.id == id);

    cart.innerHTML += `
        <div class="row" id="cartItem" data-item="${item.id}">
            <div class="col-4">
                <img class="img-responsive" src="${item.image}" alt="${name}" width="120">
            </div>
            <div class="col-6">
                <h5>${item.name}</h5>
                <h6 class="text-muted"><span id="price">${item.price}</span> р.</h6>
            </div>
            <div class="col-2">
                <input id="quantity" type="number" size="10" min="1" value="1" onchange="reloadCart();">
            </div>
        </div>
    `;
    cartCall.removeAttribute('disabled');
    reloadCart();
}

function reloadCart() {
    let sum = 0;
    for (let item of cart.children) {
        sum += parseInt(item.querySelector('#price').textContent) * item.querySelector('#quantity').value;
    }
    cartValue.value = sum;
    if (cart.children.length !== 0){
        cartQuantity.textContent = cart.children.length;
    } else {
        cartQuantity.textContent = ''
    }
}

function clearCart() {
    cart.innerHTML = '';
    reloadCart();
    cartCall.setAttribute("disabled", "disabled");
}

function buyCart() {
    let arr = [];
    for (let item of cart.children) {
        arr.push({
            "Name": item.querySelector('h5').textContent,
            "Price": parseInt(item.querySelector('#price').textContent) * 100,
            "Quantity": parseInt(item.querySelector('#quantity').value),
            "Amount": parseInt(item.querySelector('#price').textContent) * 100 * parseInt(item.querySelector('#quantity').value),
            "Tax": "vat20",
        })
    }

    let req = new XMLHttpRequest();
    let params = {
        "TerminalKey": "TinkoffBankTest",
        "Amount": cartValue.value * 100,
        "OrderId": "120423",
        "Description": "Buying masks",
        "Receipt": {
            "Email": "a@test.ru",
            "Taxation": "osn",
            "Items": arr
        }
    };
    req.open("POST", "https://securepay.tinkoff.ru/v2/Init", true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("readystatechange", () => {
        if(req.readyState === 4 && req.status === 200) {
            let response = JSON.parse(req.response);
            window.location.replace(response.PaymentURL);
        }
    });
    req.send(JSON.stringify(params));
}