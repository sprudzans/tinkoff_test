'use strict'

class Cart {
    constructor(){
        this.data = [];
        this.catalogJSON = {
                "products": [
                    {
                        "id": 1,
                        "name": "Декоративная маска \"Rules\"",
                        "image": "https://mamcupy.com/upload/resize_cache/iblock/e66/610_406_140cd750bba9870f18aada2478b24840a/e6699c6bcd9d42491ad6d37de20aea66.jpg",
                        "price": 600,
                        "description": "Маски выкраиваются из большого полотна, запечатанного принтом, поэтому рисунок на маске может отличаться от изделия к изделию."
                    },
                    {
                        "id": 2,
                        "name": "Декоративная маска \"RBL\"",
                        "image": "https://mamcupy.com/upload/resize_cache/iblock/b8e/610_406_140cd750bba9870f18aada2478b24840a/b8ef6fc8bbc94b58320ba803a9016699.jpg",
                        "price": 600,
                        "description": "Маски выкраиваются из большого полотна, запечатанного принтом, поэтому рисунок на маске может отличаться от изделия к изделию."
                    },
                    {
                        "id": 3,
                        "name": "Декоративная маска \"Дома\"",
                        "image": "https://mamcupy.com/upload/resize_cache/iblock/db3/610_406_140cd750bba9870f18aada2478b24840a/db3de205df3199ef36cc9131d19a145c.jpg",
                        "price": 600,
                        "description": "Маски выкраиваются из большого полотна, запечатанного принтом, поэтому рисунок на маске может отличаться от изделия к изделию."
                    }
                ]
            };
    }

    init = function () {
        fetch("./data.json")
            .then(response => response.json())
            .then((json) => {
                this.data = json
                this.catalogLoad(this.data)
            })
            .catch((e) => {
                console.log(e)
                this.data = this.catalogJSON
                this.catalogLoad(this.data)
            })
    }

    catalogLoad(data) {
        console.log(this);
        this.data.products.forEach(element => {
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
                                <button type="button" class="btn btn-success" onclick="shop.addCart(${element.id})">Добавить в корзину</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        });
    }

    addCart(id) {
        let item = this.data.products.find(item => item.id == id);

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
                <input id="quantity" type="number" size="10" min="1" value="1" onchange="shop.reloadCart();">
            </div>
        </div>
    `;
        cartCall.removeAttribute('disabled');
        this.reloadCart();
    }

    reloadCart() {
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

    clearCart() {
        cart.innerHTML = '';
        this.reloadCart();
        cartCall.setAttribute("disabled", "disabled");
    }

    buyCart() {
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

        fetch('https://securepay.tinkoff.ru/v2/Init', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "TerminalKey": "TinkoffBankTest",
                "Amount": cartValue.value * 100,
                "OrderId": "120423",
                "Description": "Buying masks",
                "Receipt": {
                    "Email": "a@test.ru",
                    "Taxation": "osn",
                    "Items": arr
                }
            })
        })
            .then(response => response.json())
            .then(json => window.location.replace(json.PaymentURL))
            .catch(e => console.log(e));
    }
}

let shop = new Cart;
shop.init()