const URL = 'http://localhost:3400/produtos'

let listaProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProdutos = document.querySelector("table>tbody");
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    quantidade: document.querySelector("#quantidade"),
    observacao: document.querySelector("#observacao"),
    valor: document.querySelector("#valor"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar"),

}

btnAdicionar.addEventListener('click', () => {
    limparModalProduto();
    modalProduto.show();
});


// Obter produtos da API
function obterProdutos() {
    fetch(URL, {
        method: "GET",
        headers: {
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(produtos => {
            listaProdutos = produtos;
            popularTabela(produtos);
        })
        .catch((erro) => { });
}

obterProdutos();

function popularTabela(produtos) {

    // Limpando a tabela para popular
    tabelaProdutos.textContent = '';

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    })
}

function criarLinhaNaTabela(produto) {
    // Criando uma linha na tabela
    let tr = document.createElement('tr');

    // Criando as TDs dos conteudos da tabela
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQuantidade = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');


    // Atualizar as TDs com base no produto
    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQuantidade.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString("pt-BR");
    tdAcoes.innerHTML = `<button onclick = "editarProduto(${produto.id})" class='btn btn-outline-primary btn-sm mr-3'>
                                Editar 
                            </button>
                            <button onclick = "excluirProduto(${produto.id})" class='btn btn-outline-primary btn-sm mr-3'>
                                Excluir
                            </button>`
    // Adicionar as TDs na TR
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQuantidade);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // Adicionar a TR na tabela
    tabelaProdutos.appendChild(tr);

}

formModal.btnSalvar.addEventListener('click', () => {

    let produto = obterProdutoDoModal();

    if (produto.validar()) {
        alert('Quantidade em estoque e Valor são obrigatórios.');
        return;
    }

    adcionarProdutosNoBackend(produto);

});

function obterProdutoDoModal() {
    return new Produto({
        id: formModal.id.value,
        quantidadeEstoque: formModal.quantidade.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()

    });
}

function adcionarProdutosNoBackend(produto) {

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            let novoProduto = new Produto(response);
            listaProdutos.push(novoProduto);

            popularTabela(listaProdutos);

            modalProduto.hide();

            alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
        })

}

function limparModalProduto() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.valor.value = '';
    formModal.quantidade.value = '';
    formModal.observacao.value = '';
    formModal.dataCadastro.value = '';
}

function excluirProduto(id){
    let produto = listaProdutos.find(produto => produto.id == id);
    if(confirm("Deseja realmente excluir o produto "+ produto.nome)){
        excluirProdutoNoBackEnd(id);
    }
}

function excluirProdutoNoBackEnd(id){
    fetch(`${URL}/${id}`,{
        method: "DELETE",
        headers: { 
            Authorization: obterToken()
         }
    })
    .then(()=>{
        removerProdutoDaLista(id);
        popularTabela(listaProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaProdutos.findIndex(produto => produto.id == id);

    listaProdutos.splice(indice, 1);
}