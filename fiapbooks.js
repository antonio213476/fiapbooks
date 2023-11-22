// Variaveis
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { Number } = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = 3000;


// mongo 
mongoose.connect('mongodb://127.0.0.1:27017/fiapbooks',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
});

const usuarioSchema = new mongoose.Schema({
    email : {type : String, required: true},
    senha : {type : String, required: true}
})

const produtoSchema = new mongoose.Schema({
    codigo : {type : Number, required: true},
    descricao : {type : String},
    fornecedor : {type : String},
    dataImpressao : {type : Date},
    quantidadeEstoque : {type : Number}
})

const Usuario = mongoose.model("Usuario", usuarioSchema)
const Produto = mongoose.model("ProdutoBooks", produtoSchema)

app.get("/", async(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/cadastro", async(req,res)=>{
    res.sendFile(__dirname+"/cadastro.html")
})

app.get("/cadastroFiapBooks", async(req,res)=>{
    res.sendFile(__dirname+"/cadastroFiapBooks.html")
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})

app.post("/cadastro",async(req,res)=>{
    const email = req.body.email
    const senha = req.body.senha 

    if ([email,senha].some(el => el == null) ) {          
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        return res.status(400).json({error : "Email Já Existe!"})
    }

    const usuarios = new Usuario({
        email : email,
        senha : senha,
    })

    try{
        const newUser = await usuarios.save();
        res.json({error : null, msg: "Cadastro feito com successo",userId : newUser._id})
    } catch(err) {
        res.status(400).json({err})
    }
})

app.post("/cadastroFiapBooks",async(req,res)=>{
    const codigo = req.body.codigo
    const descricao = req.body.descricao 
    const fornecedor = req.body.fornecedor
    const dataImpressao = req.body.dataImpressao 
    const quantidadeEstoque = req.body.quantidadeEstoque




    if ([codigo,descricao,fornecedor,dataImpressao,quantidadeEstoque].some(el => el == null) ) {          
        console.log()
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const idExiste = await Produto.findOne({codigo:codigo})

    // error checks
    if(idExiste) {
        return res.status(400).json({error : "Id do produto já Existe!"})
    }

    const produtos = new Produto({
        codigo : codigo,
        descricao : descricao,
        fornecedor : fornecedor,
        dataImpressao : dataImpressao,
        quantidadeEstoque : quantidadeEstoque
    })

    try{
        const newProduto = await produtos.save();
        res.json({error : null, msg: "Cadastro do produto feito com successo",produtoId : newProduto._id})
    } catch(err) {
        res.status(400).json({err})
    }
})

