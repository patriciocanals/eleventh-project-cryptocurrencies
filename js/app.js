const cryptoSelect = document.querySelector('#cryptocurrencies');
const currencySelect = document.querySelector('#currency');
const form = document.querySelector('#form');
const resultDiv = document.querySelector('#result');

const searchObj = {
    currency : '',
    cryptocurrency : ''
}
const obtainCrypto = cryptocurrencies => new Promise(resolve => { resolve(cryptocurrencies) });

document.addEventListener('DOMContentLoaded', ()=>{
    requestCrypto();
    form.addEventListener('submit',submitForm);
    cryptoSelect.addEventListener('change',readValue);
    currencySelect.addEventListener('change',readValue);
} )

function requestCrypto(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
                .then(response => response.json() )
                .then(result => obtainCrypto(result.Data) )
                .then(cyptocurrencies => selectCryptocurrencies(cyptocurrencies) )

}

function selectCryptocurrencies(cryptos){
    cryptos.forEach(crypto => {
        const {FullName,Name} = crypto.CoinInfo;
        const opt = document.createElement('option');
        opt.value = Name;
        opt.textContent = FullName;
        cryptoSelect.appendChild(opt);
    } )

}

function readValue(e){
    searchObj[e.target.name] = e.target.value;
    console.log(searchObj);
}

function submitForm(e){
    e.preventDefault();

    const {currency,cryptocurrency} = searchObj;

    if(currency === '' || cryptocurrency === ''){
        showAlert('Both fields required');
        return;
    }

    requestAPI();
}

function showAlert(msg){
    const exists = document.querySelector('.error');
    if(!exists){
    const divAlert = document.createElement('div');
        divAlert.classList.add('error');
        divAlert.textContent = msg;
        form.appendChild(divAlert);
        
        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }
}

function requestAPI(){
    const {currency,cryptocurrency} = searchObj;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

    showSpinner();

    fetch(url)
                .then(response => response.json() )
                .then(quote => showQuote( quote.DISPLAY[cryptocurrency][currency] ) )
}

function showQuote(quote) {
    cleanHTML();

    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = quote;

    const price = document.createElement('p');
    price.classList.add('price');
    price.innerHTML = `
        The pice is: <span>${PRICE}</span>
    `;
    resultDiv.appendChild(price);

    const highPrice = document.createElement('p');
    highPrice.innerHTML = `
        Highest price of the day: <span>${HIGHDAY}</span>
    `;
    resultDiv.appendChild(highPrice);

    const lowPrice = document.createElement('p');
    lowPrice.innerHTML = `
        Lowest price of the day: <span>${LOWDAY}</span>
    `;
    resultDiv.appendChild(lowPrice);

    const last24h = document.createElement('p');
    last24h.innerHTML = `
        Last 24 hs change: <span>${CHANGEPCT24HOUR}%</span>
    `;
    resultDiv.appendChild(last24h);

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `
        Last update: <span>${LASTUPDATE}</span>
    `;
    resultDiv.appendChild(lastUpdate);
}

function cleanHTML() {
    while(resultDiv.firstChild){
        resultDiv.remove(resultDiv.firstChild);
    }
}

function showSpinner() {
    cleanHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
    `;
    resultDiv.appendChild(spinner);
}