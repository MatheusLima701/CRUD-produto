// Preciso capturar e-mail e senha do usuário

const EMAIL = "admin@admin.com";
const SENHA = "123456";

let campoEmail = document.querySelector("#email");
let campoSenha = document.querySelector( "#senha" );
let btnEntrar = document.getElementById("btn-entrar");

btnEntrar.addEventListener("click", () => {

    // Capturando os valores digitados pelo usuário
    let emailDigitado = campoEmail.value.toLowerCase();
    let senhaDigitada = campoSenha.value;

    // validadndo o e-mail e senha
    // if(!emailDigitado || !senhaDigitada){
    //     alert("O campo de e-mail e senha não podem ficar vazios. Por favor preencha todos os campos.");
    //     return;
    // }

    // if(emailDigitado != EMAIL || senhaDigitada != SENHA){
    //     alert("E-mail ou senha incorreta! Tente novamente");
    //     return;
    // }
    // Acessar o sistema
    // location.href="home.html";

    // window.open('home.html', '_self'); 

    autenticar(emailDigitado, senhaDigitada);
});

function autenticar (email, senha) {

    //Preciso saber qual a url da API
    const URL = 'http://localhost:3400/login';

    //Criar um request para a API
    fetch(URL, {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha})
    })
    // Se der certo, direcionar para tela de home
    .then(response  => response = response.json())
    .then(response => {
        console.log(response)

        if(!!response.mensagem){
            alert(response.mensagem);
            return;
        }

        // Mostrar tela loading
        mostrarloading();

        // Aqui preciso salvar o token e o usuario na Store
        salvarToken(response.token);
        salvarUsuario(response.usuario);

        setTimeout(()=>{
            window.open('home.html', '_self');
        },3000)

    })
    // Se der errado, mandar mensagem para o usuário
    .catch(erro => {
        console.log(erro)
    })

}

function mostrarloading(){
    // capturar o campo de loading e mostrar ele
    const divLoading = document.getElementById("loading");
    divLoading.style.display = "block";
    // pegar elemento caixa de login e esconder ele
    const divBoxLogin = document.querySelector('div.caixa-login');
    divBoxLogin.style.display = "none";
}
    