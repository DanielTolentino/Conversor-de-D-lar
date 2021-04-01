//Cria a função para multiplicar o valor em real por dólar, e mostar na tela o resultado
function converter(){
    //recebe o input digitado pelo usuário no HTML
var moeda = document.getElementById('entrada').value
//converte o valor digitado para um número Float, com cadas decimais
parseFloat(moeda)

//multiplica o valor da variável 'moeda', deixa 2 casas decimais fixas, e substitui o ponto por vírgulas
var valorEmReal = (moeda * 5.71).toFixed(2).replace('.' , ',')
//var valorEmRealDecimal = valorEmReal.toFixed(2)
//var valoremRealVir = valorEmRealDecimal.replace('.', ',')

//passa para o elemento 'resultado' no HTML e exibe o valor para o usuário
var valorEmReal =  
document.getElementById('resultado').value= "R$" + valorEmReal;
}
