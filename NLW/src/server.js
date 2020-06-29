const express = require("express")
const server = express()

//pegar o banco de deletados
const db = require("./database/db.js")

// configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body
server.use(express.urlencoded({
  extended: true
}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})

// configurar rotas
// home
server.get("/", (req, res) => {
  return res.render("index.html", {
    title: "Faça Sua coleta seletiva"
  })
})

server.get("/create-point", (req, res) => {
  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
  //req.query --> Query Strings da url (não funciona no post)
  //req.body --> retorna o corpo da requisição
  const query = req.body
  console.log(query)

  //inserir dados no banco de Dados
  //inserir dados na tabela
  const dbQuery = `
      INSERT INTO places (
          image,
          name,
          address,
          address2,
          state,
          city,
          items

      ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
    query.image,
    query.name,
    query.address,
    query.address2,
    query.state,
    query.city,
    query.items
  ]

  //aqui usamos uma callback function que é uma função chamada quando retornar a resposta
  //this referencia o retorno do run (não pode ser chamada quando utiliza-se arrow function)
  function afterInsertData(err) {
    if(err) {
      console.log(err)
      return res.send("erro no cadastro")
    }

    console.log("cadastrado com sucesso")
    console.log(this)

    return res.render("create-point.html", {
      saved: true
    })
  }
  db.run(dbQuery, values, afterInsertData)
})

server.get("/search-results", (req, res) => {

  const search = req.query.search

  if(search == "") {
    //pesquisa vazia
    return res.render("search-results.html", {
      total: 0
    })

  }

  //pegar os dados do banco de deletados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    if(err) {
      console.log(err)
    }

    console.log("Registros encontrados: ")
    console.log(rows)

    const total = rows.length

    return res.render("search-results.html", {
      places: rows,
      total: total
    })
  })


})

// ligar o servidor
server.listen(3000)
