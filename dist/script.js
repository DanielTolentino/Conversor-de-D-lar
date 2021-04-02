//API para consultar valor do dólar via fetch
const URL_TO_FETCH = 'https://economia.awesomeapi.com.br/json/all/USD-BRL,EUR-BRL,BTC-BRL';
fetch(URL_TO_FETCH, {
  method: 'get' // opcional
})
.then(function(response) {
  
    response.json()

    .then(function(result) {
     dolarHoje = result.USD["ask"]
     eurHoje = result.EUR["ask"]
     btcHoje = result.BTC["ask"]
        /* var json = JSON.parse(dolarHoje)
        console.log(json) */
    })
})
.catch(function(err) { 
  console.error(err);
});

//Cria a função para multiplicar o valor em real por dólar, e mostar na tela o resultado
function converter(){
       //recebe o input digitado pelo usuário no HTML
var moeda = document.getElementById('entrada').value
//converte o valor digitado para um número Float, com cadas decimais
parseFloat(moeda)

//multiplica o valor da variável 'moeda', deixa 2 casas decimais fixas, e substitui o ponto por vírgulas
var valorEmReal = (moeda * dolarHoje)
var valorEmEuro = (moeda * eurHoje)
var valorEmBtc = (moeda * btcHoje)

var valorEmReal =  
document.getElementById('resultado-dolar').value= "R$" + valorEmReal.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});
var valorEmEuro =  
document.getElementById('resultado-euro').value= "R$" + valorEmEuro.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});
var valorEmBtc =  
document.getElementById('resultado-btc').value= "R$" + valorEmBtc.toLocaleString({style: 'currency', currency: 'BRL'}, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    //exibe a cotação após a conversão
    var divCotacaoHoje = document.getElementById("valor-atual")
    var htmlDolar = "Dólar:" + dolarHoje
    var htmlEuro = " Euro:" + eurHoje
    var htmlBitcoin = " BTC:" + btcHoje
  
    divCotacaoHoje.innerHTML = htmlDolar + htmlEuro + htmlBitcoin 
}
