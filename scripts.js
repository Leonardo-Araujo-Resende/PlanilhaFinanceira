var saldoCasal = 0;

//--Selecões--------------------------------------------------------------------------------

//Div Compra
const divCompras = document.querySelector(".pagamentos");

//Adicionar compra
const inputTituloCompra = document.querySelector("#titulo-compra");
const inputLugarCompra = document.querySelector("#lugar-compra");
const inputValorCompra = document.querySelector("#valor-compra");
const inputItensCompra = document.querySelector("#itens-compra");
const inputQuemCompra = document.querySelector("#quem-compra");
const inputNotinhaCompra = document.querySelector("#notinha-compra");
const buttonAdicionarCompra = document.querySelector("#adicionar-compra");

//Pessoas esquerda e direita adicionar compra
const divPessoaAdicionarCompra = document.querySelectorAll(".auxiliar-para-hide");

//Titulos Quem deve Valor
const cabecalhoValorDeve = document.querySelector("#valor-devedor");
const cabecalhoQuemDeve = document.querySelector("#nome-devedor");

//Lista Alimentos
const listaAlimentosQuemComprou = document.querySelector(".selecionar-quem-comprou-itens");
const butaoFinalizarAlimentosQuemComprou = document.querySelector("#finalizar-alimentos-quem-comprou");

//Valor de cada um separado
const valorPagarPelaCompraLeonardo = document.querySelector(".cada-um-paga-leonardo");
const valorPagarPelaCompraIgor = document.querySelector(".cada-um-paga-igor");
//----Funções--------------------------------------------------------------------------------

function adicionarCompra(titulo, lugar, valorEsquerda, valorDireita, arrayAlimentos = null, quemPagou, notinhaCompra = "img/Notinha.jpeg", dataCompra, dataTransferencia = "Aguardando transferência", save = true, tarefaComItem = false){
    if(!(titulo && lugar && valorEsquerda && valorDireita && quemPagou !== "nenhum")){
        preencherTodosOsCampos();
        return;
    }
        dataFormatada = dataCompra;

        if(quemPagou === "Leonardo"){
            valorAtransferir = valorDireita;
        }
        if(quemPagou === "Igor"){
            valorAtransferir = valorEsquerda;
        }

        const quemPagouHtml = 
        `<div class="auxjs">
            <div class="auxiliar-display">
                <h1 class="titulo-transacao">Não pagou</h1>
                <p class="data-transacao">${dataTransferencia}</p>
            </div>
            <div class="auxiliar-display">
                <div class="dados-transacao">
                    <p>Método de pagamento: pix</p>
                    <h2 class="valor-a-transferir">R$${parseFloat(valorAtransferir).toFixed(2)}</h2>
                    <button class="efetuar-transferencia">Transferir</button>
                </div>
            </div>
        </div>`;

        const template = 
        `<div class="pagamento">
            <div class="pessoa-esquerda">

            </div>

            <div class="descricao-compra">

                <div class="descricao-compra-cabecalho">
                    <h1>${titulo}</h1>
                    <p class="data-compra">${dataFormatada}</p>
                </div>

                <div class="auxiliar-display">
                    <div class="dados-compra">
                        <p>Lugar: ${lugar}</p>
                        <p>Quem pagou: ${quemPagou}</p>
                        <h2>Total R$${(parseFloat(valorEsquerda) + parseFloat(valorDireita)).toFixed(2)}</h2>
                        <button class="detalhes-compra">Ver detalhes</button>
                    </div>
                    <div class="notinha">
                        <img src="${notinhaCompra}" alt="Notinha" id="notinha">
                    </div>
                </div>
                <div class="div-alimentos-comprados hide">
                </div>
            </div>

            <div class="pessoa-direita">

            </div>
        </div>`;




        if(arrayAlimentos === null) arrayAlimentos = retornaItens();

        //Adicionar itens na lista
        if(arrayAlimentos.length != 0 && tarefaComItem == false){
            adicionarItensNaLista();
        }else{


            //Atualiza quem deve
            if(quemPagou === "Leonardo"){
                saldoCasal += parseFloat(valorDireita);
            }
            if(quemPagou === "Igor"){
                saldoCasal -= parseFloat(valorEsquerda);
            }

            

            //Cria compra html
            const parse = new DOMParser(); //Cria objeto transforma
            const htmlTemplate = parse.parseFromString(template, "text/html"); //Transforma template de text para html
            const novaCompraAdicionar = htmlTemplate.querySelector(".pagamento"); //Seleciona no html criado(linha anterior) a referencia do objeto com classe entre parenteses

            const htmlTemplateQuemPagou = parse.parseFromString(quemPagouHtml, "text/html")
            const quemComprouHtml = htmlTemplateQuemPagou.querySelector(".auxjs");
            

            var adicionar
            if(quemPagou === "Leonardo"){
                adicionar = novaCompraAdicionar.querySelector(".pessoa-direita");
            }
            else if(quemPagou === "Igor"){
                adicionar = novaCompraAdicionar.querySelector(".pessoa-esquerda");
            }   

            if(arrayAlimentos.length == 0){ //Verifica se possui array alimentos , se n tiver remove o botao de detalhes
                novaCompraAdicionar.querySelector(".detalhes-compra").remove();
            }

            adicionar.appendChild(quemComprouHtml);

            if(dataTransferencia !== "Aguardando transferência") efetuarTransferencia(novaCompraAdicionar.querySelector(".efetuar-transferencia"),dataTransferencia);

            //Tirando borda
            const divEsquerda = novaCompraAdicionar.querySelector(".pessoa-esquerda")
            const divDireita = novaCompraAdicionar.querySelector(".pessoa-direita")

            if(quemPagou === "Leonardo")divEsquerda.style.border = "none"
            if(quemPagou === "Igor")divDireita.style.border = "none"
            

            divCompras.insertBefore(novaCompraAdicionar, divCompras.firstChild);

            //Atualiza cabecalho
            atualizarDevedor();

            //Salva Local Storage
            if(save) salvaCompraLocalStorage({titulo: titulo, lugar: lugar, valorEsquerda: valorEsquerda, valorDireita: valorDireita, arrayAlimentos: arrayAlimentos, quemPagou: quemPagou, notinhaCompra: notinhaCompra,  dataCompra:dataFormatada, dataTransferencia: dataTransferencia})

            //Reseta forms
            resetarFormularioTarefa();
        }
        
}

function preencherTodosOsCampos(){
    buttonAdicionarCompra.textContent = "É preciso preencher todos os campos com asterisco *"
    buttonAdicionarCompra.style.color = "red"
    setTimeout(() => {
        buttonAdicionarCompra.textContent = "Adicionar compra ✅";
        buttonAdicionarCompra.style.color = "#93DB9A"
    }, 5000);
}


function resetarFormularioTarefa(){
    inputTituloCompra.value = "";
    inputLugarCompra.value = "";
    inputValorCompra.value = "";
    inputNotinhaCompra.value = "";
    inputItensCompra.value = "";
}

function retornaDataHora(){

    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth() + 1; 
    const dia = dataAtual.getDate();
    const hora = dataAtual.getHours();
    const minuto = dataAtual.getMinutes();
    const segundo = dataAtual.getSeconds();

    return (dia < 10 ? '0' : '') + dia + '/' + (mes < 10 ? '0' : '') + mes + '/' + ano + " " + (hora < 10? "0" : "") + hora + "h" + (minuto < 10? "0" : "") + minuto + "m" + (segundo < 10? "0" : "") + segundo + "s";

}

function atualizarDevedor(){
    if(saldoCasal > -0.009 && saldoCasal < 0.009) saldoCasal = 0

    const valor = Math.abs(saldoCasal);   
    cabecalhoValorDeve.textContent = "R$ " + valor.toFixed(2);

    if(saldoCasal > 0) cabecalhoQuemDeve.textContent = "Igor";
    if(saldoCasal < 0) cabecalhoQuemDeve.textContent = "Leonardo";
    if(saldoCasal === 0) cabecalhoQuemDeve.textContent = "Ninguém";
}

function efetuarTransferencia(botao, dataTransferencia){
    var divPai = botao.closest("div").parentNode.parentNode.parentNode;

    const tituloTransferencia = divPai.querySelector(".titulo-transacao");
    const dataTransferenciaHtml = divPai.querySelector(".data-transacao");
    var valorTransferencia = divPai.querySelector(".valor-a-transferir");

    tituloTransferencia.textContent = "Transferido";
    dataTransferenciaHtml.textContent = dataTransferencia;
    valorTransferencia = parseFloat(valorTransferencia.textContent.replace("R$",""));

    botao.remove();

    if(divPai.classList.contains("pessoa-direita")) {
        saldoCasal -= valorTransferencia;
    }
    else {
        saldoCasal += valorTransferencia;
    }
    atualizarDevedor();
    
}

function retornaItens(){
    const df = inputItensCompra.value.split("\n");
    var arrayAlimentos = [];

    for(let i = 0; i < df.length; i ++){
        if (df[i].trim() !== "") {
            var infos = df[i].split("\t");
            arrayAlimentos.push(infos);
        }
    }
    return arrayAlimentos;
}

function adicionarItensNaLista(){
    const arrayAlimento = retornaItens();

    arrayAlimento.forEach(alimento =>{
        const html = `<div class="item-a-selecionar">
                        <p class="nome-itens">${alimento[1]}</p>
                        <p class="preco-itens">${alimento[5]}</p>
                        <div class="quem-comprou-itens">
                            <input type="checkbox" name="leonardo[]" class="itens-leonardo">
                            <input type="checkbox" name="igor[]" class="itens-igor">
                        </div>
                    </div>`;

            const parse = new DOMParser(); //Cria objeto transforma
            const htmlTemplate = parse.parseFromString(html, "text/html"); //Transforma template de text para html
            const novoAlimentoAdicionar = htmlTemplate.querySelector(".item-a-selecionar"); //Seleciona no html criado(linha anterior) a referencia do objeto com classe entre parenteses

            listaAlimentosQuemComprou.insertBefore(novoAlimentoAdicionar, butaoFinalizarAlimentosQuemComprou.parentNode);
    })
}



function adicionaEventosNosCheckBoxItens(){
    document.querySelectorAll(".itens-leonardo").forEach(item =>{
        item.addEventListener("click", (e)=>{
            var valorNovo = parseFloat(item.parentNode.parentNode.querySelector(".preco-itens").textContent.replace("R$","").replace(",","."));
            var valorAtualLeonardo = parseFloat(valorPagarPelaCompraLeonardo.textContent);
            var valorAtualIgor = parseFloat(valorPagarPelaCompraIgor.textContent);

            if (item.checked){
                if(item.closest("div").querySelector(".itens-igor").checked){
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo + (valorNovo/2)).toFixed(3));
                    valorPagarPelaCompraIgor.textContent = Math.abs((valorAtualIgor - (valorNovo/2)).toFixed(3));
                }
                else{
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo + valorNovo).toFixed(3));
                }

            }
            else{
                if(item.closest("div").querySelector(".itens-igor").checked){
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo - (valorNovo/2)).toFixed(3));
                    valorPagarPelaCompraIgor.textContent = Math.abs((valorAtualIgor + (valorNovo/2)).toFixed(3));
                }
                else{
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo - valorNovo).toFixed(3));
                }
            }
        })
    })

    document.querySelectorAll(".itens-igor").forEach(item =>{
        item.addEventListener("click", (e)=>{
            var valorNovo = parseFloat(item.parentNode.parentNode.querySelector(".preco-itens").textContent.replace("R$","").replace(",","."));
            var valorAtualLeonardo = parseFloat(valorPagarPelaCompraLeonardo.textContent);
            var valorAtualIgor = parseFloat(valorPagarPelaCompraIgor.textContent);

            if (item.checked){
                if(item.closest("div").querySelector(".itens-leonardo").checked){
                    valorPagarPelaCompraIgor.textContent = Math.abs((valorAtualIgor + (valorNovo/2)).toFixed(3));
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo - (valorNovo/2)).toFixed(3));
                }
                else{
                    valorPagarPelaCompraIgor.textContent = (valorAtualIgor + valorNovo).toFixed(3);
                }
            }else{
                if(item.closest("div").querySelector(".itens-leonardo").checked){
                    valorPagarPelaCompraIgor.textContent = Math.abs((valorAtualIgor - (valorNovo/2)).toFixed(3));
                    valorPagarPelaCompraLeonardo.textContent = Math.abs((valorAtualLeonardo + (valorNovo/2)).toFixed(3));
                }else{
                    valorPagarPelaCompraIgor.textContent = Math.abs((valorAtualIgor - valorNovo).toFixed(3));
                }
            }
        })
    })
}

//Resetar forms itens quem comprou
function resetarFormularioQuemComprou(){


    //Remvoe alimentos
    var elementosAremover = listaAlimentosQuemComprou.querySelectorAll(".item-a-selecionar");
    elementosAremover.forEach(elemento =>{
        elemento.remove()
    })

    //Reseta valores cada um deve pagar
    valorPagarPelaCompraIgor.textContent = "00.00"
    valorPagarPelaCompraLeonardo.textContent = "00.00"

}

//Salva quem comprou cada item no local storage
function salvaQuemComprouCadaItem(){

    var todosAlimentos = listaAlimentosQuemComprou.querySelectorAll(".item-a-selecionar .quem-comprou-itens")
    var compras = JSON.parse(localStorage.getItem("compras")) || []; //Pega array de compras ou vazio

    for(var i = 0; i < todosAlimentos.length; i++){
        if(todosAlimentos[i].querySelector(".itens-leonardo").checked && todosAlimentos[i].querySelector(".itens-igor").checked){
            compras[compras.length -1].arrayAlimentos[i][3] = 3;
        }
        else if(todosAlimentos[i].querySelector(".itens-leonardo").checked){
            compras[compras.length -1].arrayAlimentos[i][3] = 1;
        }
        else if(todosAlimentos[i].querySelector(".itens-igor").checked){
            compras[compras.length -1].arrayAlimentos[i][3] = 2;
        }
    }

    localStorage.setItem("compras", JSON.stringify(compras)); //Sobscreve com nova compra

}

function verificarPreencheuTodosItens(){
    var todosAlimentos = listaAlimentosQuemComprou.querySelectorAll(".item-a-selecionar .quem-comprou-itens");
    var retorno = true

    todosAlimentos.forEach(alimento =>{
        if(alimento.querySelector(".itens-leonardo").checked === false && alimento.querySelector(".itens-igor").checked === false){
            alimento.closest("div").parentNode.style.color = "red";
            setTimeout(() => {
                alimento.closest("div").parentNode.style.color = "#93DB9A";
            }, 5000);
            retorno = false;
        }
    })
    
    return retorno;
}

function preencherTodosOsItens(){
    butaoFinalizarAlimentosQuemComprou.textContent = "Selecione quem comprou em todos os itens"
    butaoFinalizarAlimentosQuemComprou.style.color = "red"
    setTimeout(() => {
        butaoFinalizarAlimentosQuemComprou.textContent = "Finalizar escolha dos produtos"
        butaoFinalizarAlimentosQuemComprou.style.color = "#93DB9A"
    }, 5000);
}

function retornaNotinha(){
    setTimeout(() => {
        localStorage.removeItem("tempImagem")
    }, 2000);
    if(!localStorage.getItem("tempImagem")) return "img/Notinha.jpeg";
    return localStorage.getItem("tempImagem");
}


//Eventos--------------------------------------------------------------------------------

//Imagem Notinha
inputNotinhaCompra.addEventListener("change",()=>{
    if (!inputNotinhaCompra || !inputNotinhaCompra.files || inputNotinhaCompra.files.length === 0) return;

    const reader = new FileReader();

    reader.readAsDataURL(inputNotinhaCompra.files[0])

    reader.onload = () => {
        localStorage.setItem("tempImagem",reader.result)
    }
})



//Adicionar itens quem comprou
butaoFinalizarAlimentosQuemComprou.addEventListener("click",()=>{
    if(!verificarPreencheuTodosItens()){ 
        preencherTodosOsItens();
        return
    }
    adicionarCompra(inputTituloCompra.value, inputLugarCompra.value, parseFloat(valorPagarPelaCompraLeonardo.textContent).toFixed(3), parseFloat(valorPagarPelaCompraIgor.textContent).toFixed(3), null, inputQuemCompra.value, retornaNotinha(),retornaDataHora(), dataTransferencia = "Aguardando transferência", save = true, tarefaComItem = true);
    salvaQuemComprouCadaItem()
    resetarFormularioQuemComprou();
;})

//Adicionar compra
buttonAdicionarCompra.addEventListener("click", ()=>{
    resetarFormularioQuemComprou()
    adicionarCompra(inputTituloCompra.value, inputLugarCompra.value, (inputValorCompra.value/2).toFixed(3), (inputValorCompra.value/2).toFixed(3), null, inputQuemCompra.value, retornaNotinha(), retornaDataHora(), dataTransferencia = "Aguardando transferência", save = true, tarefaComItem = false);
    adicionaEventosNosCheckBoxItens();
})



//Realizar Transferencia
document.addEventListener("click", (e)=>{

    if(e.target.classList.contains("efetuar-transferencia")){ 

        var divPai = e.target.closest("div").parentNode.parentNode;

        efetuarTransferencia(e.target);

        //Atualiza Local Storage
        var idCompra = divPai.parentNode.parentNode.querySelector(".data-compra").textContent; 

        const compras = JSON.parse(localStorage.getItem("compras")) || []; //Pega array de compras ou vazio

        compras.forEach(compra =>{
            if(idCompra == compra.dataCompra){ //Procura compra
                compra.dataTransferencia = retornaDataHora(); //Realiza trasnferencia
            }
        })

        localStorage.setItem("compras", JSON.stringify(compras)); //Sobscreve com nova compra
    }   
})

//Exibir detalhes da compra
document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("detalhes-compra")){

        const compras = JSON.parse(localStorage.getItem("compras")) || []; //Pega array de compras ou vazio
        var divPai = e.target.parentNode.parentNode.parentNode;


        if(!divPai.classList.contains("alimentos-criados")){
            var arrayAlimentos 

            compras.forEach(compra =>{
                if(compra.dataCompra == divPai.querySelector(".data-compra").textContent){
                    arrayAlimentos = compra.arrayAlimentos;
                    return
                }
            })
            
            arrayAlimentos.forEach(alimento =>{
                var quemComprou

                if(alimento[3] == 1) quemComprou = "Leonardo";
                else if(alimento[3] == 2) quemComprou = "Igor";
                else if(alimento[3] == 3) quemComprou = "Ambos";
                
                const html = 
                `<div class="item-a-selecionar">
                    <p class="nome-itens">${alimento[1]}</p>
                    <p class="detalhes-compra-itens">${alimento[5]}</p>
                    <p class="detalhes-compra-itens">${quemComprou}</p>
                </div>`;

                const parse = new DOMParser(); //Cria objeto transforma
                const htmlTemplate = parse.parseFromString(html, "text/html"); //Transforma template de text para html
                const novoAlimentoAdicionar = htmlTemplate.querySelector(".item-a-selecionar"); 

                divPai.querySelector(".div-alimentos-comprados").appendChild(novoAlimentoAdicionar);
                divPai.classList.add("alimentos-criados");
                divPai.querySelector(".div-alimentos-comprados").classList.remove("hide");
            })
        }
        else{
            divPai.querySelector(".div-alimentos-comprados").classList.toggle("hide");
        }
    }

})




//Local Storage
//salva
function salvaCompraLocalStorage(compra){
    const compras = JSON.parse(localStorage.getItem("compras")) || []; //Pega array de compras ou vazio

    compras.push(compra); //Adiciona compra

    localStorage.setItem("compras", JSON.stringify(compras)); //Sobscreve com nova compra
};

//carrega
function carregaCompras(){
    const compras = JSON.parse(localStorage.getItem("compras")) || []; //Pega array de compras ou vazio

    compras.forEach(compra => {
        adicionarCompra(compra.titulo, compra.lugar, compra.valorEsquerda, compra.valorDireita, compra.arrayAlimentos, compra.quemPagou, compra.notinhaCompra, compra.dataCompra, compra.dataTransferencia, false, true);
    })

}

carregaCompras();   



