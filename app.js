const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8091;

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: '1234', // Substitua pela sua senha do MySQL
    database: 'produtos', // Nome do seu banco de dados
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL com sucesso!');
});

// Servir o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para inserir produtos
app.post('/submit', (req, res) => {
    const { NomeProduto, Preco, Quantidade } = req.body;
    const Total = Preco * Quantidade;
    const query = 'INSERT INTO produto (NomeProduto, Preco, Quantidade, Total) VALUES (?, ?, ?, ?)';
    db.query(query, [NomeProduto, Preco, Quantidade, Total], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Produto inserido com sucesso!' });
    });
});

// Rota para buscar produtos
app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM produto';
    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Rota para atualizar produto
app.put('/update/:idProduto', (req, res) => {
    const { idProduto } = req.params;
    const { NomeProduto, Preco, Quantidade } = req.body;
    const Total = Preco * Quantidade;
    const query = 'UPDATE produto SET NomeProduto = ?, Preco = ?, Quantidade = ?, Total = ? WHERE idProduto = ?';
    db.query(query, [NomeProduto, Preco, Quantidade, Total, idProduto], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
});

// Rota para deletar produto
app.delete('/delete/:idProduto', (req, res) => {
    const { idProduto } = req.params;
    const query = 'DELETE FROM produto WHERE idProduto = ?';
    db.query(query, [idProduto], (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Produto deletado com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});