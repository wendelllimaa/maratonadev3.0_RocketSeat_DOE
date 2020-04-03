// lógica de fazer um café

// = -> atribui valor a variável

//const tamanho = 2.5

//function verificarSeOCopoEstaSujo (sujo) {
    // logica para verificar se o copo está sujo

//    return `o copo ${sujo}`
//}

//const copo = {
//    cor: "branco",
//    tamanho,
//    verificarSeOCopoEstaSujo,
//}

//console.log (copo.verificarSeOCopoEstaSujo("não está sujo"))

// configurando o servidor
const express = require ("express") //está pedindo para o node pegar o express e colocar aqui
const server = express () //server vai receber a funcionalidade express

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))


// configurar a conexão com o banco de dados - Postgres e postbird
const Pool = require ('pg').Pool
const db = new Pool ({
    user: 'postgres',
    password: '285679',
    host:'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
// raiz do projeto ./
nunjucks.configure("./", {
    express: server,
    noCache: true, //boolean
}) 

// Devido a utilização do banco de dados postgres não precisa mais dessa lista
// lista de doadores: Vetor ou Array
//const donors = [
//    {
//        name: "Diego Fernandes",
//        blood: "AB+"
//    },
//    {
//        name: "Miguel Ferreira",
//        blood: "B+"
//    },
//    {
//        name: "Túlio Souza",
//        blood: "O-"
//    },
//    {
//        name: "Vanessa Souza",
//        blood: "O-"
//    }
//]






//configurar a apresentação da página
server.get ("/", function(req, res){
    
    db.query ("SELECT * FROM donors", function (err, result){
        if (err) return res.send ("Erro de banco de dados.")
        
        
        const donors = result.rows         
        return res.render("index.html", { donors })
    })


})

server.post ("/", function(req, res){
    // pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //coloco valores dentro do array - Não precisa mais, devido o banco de dados
//    donors.push({
//        name: name,
//        blood: blood,
//    })

if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
}   

// coloco valores dentro do banco de dados
    const query = 
    `INSERT INTO donors ("name","email","blood") 
    VALUES ($1,$2,$3)`



    db.query(query,[name, email, blood],function (err) {
        // fluxo de erro
        if (err) return res.send ("erro no banco de dados.")

       // fluxo ideal
        return res.redirect("/")
    })

})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log ("iniciei o servidor")
})