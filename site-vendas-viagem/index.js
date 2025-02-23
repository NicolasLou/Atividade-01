const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');

// Configuração do Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulários
app.use(session({
    secret: 'segredo_para_a_sessao',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Alterar para 'true' em produção com HTTPS
}));

// Dados de pacotes de viagem
const pacotes = [
    { id: 1, nome: "Pacote Europa", data: "15 de Junho de 2025", destino: "Europa", preco: 5000 },
    { id: 2, nome: "Pacote Estados Unidos", data: "10 de Julho de 2025", destino: "Estados Unidos", preco: 4000 },
    { id: 3, nome: "Pacote Japão", data: "20 de Agosto de 2025", destino: "Japão", preco: 6000 },
];

// Usuário fixo para autenticação
const usuarioAutenticado = {
    username: "usuario",
    password: "senha123"
};

// Página inicial com lista de pacotes
app.get('/', (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/login'); // Se o usuário não estiver autenticado, redireciona para a página de login
    }

    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota de login - Autenticação do usuário
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === usuarioAutenticado.username && password === usuarioAutenticado.password) {
        req.session.authenticated = true;
        return res.redirect('/'); // Redireciona para a página inicial após login bem-sucedido
    } else {
        res.send('Credenciais inválidas! Tente novamente.'); // Mensagem de erro caso as credenciais estejam erradas
    }
});

// Página de detalhes do pacote (somente para usuários autenticados)
app.get('/package/:id', (req, res) => {
    if (!req.session.authenticated) {
        return res.redirect('/login'); // Se o usuário não estiver autenticado, redireciona para o login
    }

    const pacoteId = req.params.id;
    const pacote = pacotes.find(p => p.id == pacoteId);
    if (pacote) {
        res.sendFile(path.join(__dirname, 'views', 'packageDetails.html'));
    } else {
        res.status(404).send("Pacote não encontrado");
    }
});

// Deslogar (encerrar a sessão)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao deslogar.');
        }
        res.redirect('/'); // Redireciona para a página inicial após logout
    });
});

// Servir a aplicação na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
