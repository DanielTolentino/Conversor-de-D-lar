async function fetchData() {
  const URL_TO_FETCH = 'https://economia.awesomeapi.com.br/json/all/USD-BRL,EUR-BRL,BTC-BRL';
  try {
    const response = await fetch(URL_TO_FETCH);
    const result = await response.json();
    dolarHoje = result.USD["ask"];
    eurHoje = result.EUR["ask"];
    btcHoje = result.BTC["ask"];
    displayValues();
  } catch (err) {
    console.error(err);
  }
}

fetchData();

function displayValues() {
    let divCotacaoHoje = document.getElementById("valor-atual")
    let htmlDolar = "Dólar:" + dolarHoje
    let htmlEuro = " Euro:" + eurHoje
    let htmlBitcoin = " BTC:" + btcHoje

    //Escreve no html os valores atribuídos acima
    divCotacaoHoje.innerHTML = htmlDolar + htmlEuro + htmlBitcoin
}

let inputValue;
let valorEmReal;
let valorEmEuro;
let valorEmBtc;

function getInput() {
         //recebe o input digitado pelo usuário no HTML
         inputValue = document.getElementById('entrada').value;
         if(!inputValue) return; // return if inputValue is empty or not a number
}

function multiply() {
    //multiplica o valor inserido pelo usuário para corrigir o display das casas decimais no BTC
    let btcRate = inputValue * 1000;
    //multiplica o valor da variável 'moeda'
    valorEmReal = (inputValue * dolarHoje)
    valorEmEuro = (inputValue * eurHoje)
    valorEmBtc = (btcRate * btcHoje)
  
}
function converter(){
  let input = getInput();
  multiply();
  document.getElementById('resultado-dolar').value = "R$" + valorEmReal.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  document.getElementById('resultado-euro').value = "R$" + valorEmEuro.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  document.getElementById('resultado-btc').value = "R$" + valorEmBtc.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});

}
