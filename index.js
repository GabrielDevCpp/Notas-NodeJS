const express = require('express')
const exphbs = require('express-handlebars')

const fs = require('fs')
const path = require('path')

const app = express()
const port = 3001

const hbs = exphbs.create({
  partialsDir: ['views/partials'],
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.use(express.static('public'))

const basePath = path.join(__dirname, 'notes')

app.get('/notes/add', (req, res) =>{
  res.render('addnote')
})

app.post('/notes/save', function (req, res) {


  console.log(req.body.category)
  console.log(req.body.textnote)

  const filename = 'notes/' + req.body.category + '.txt'
  fs.writeFileSync(filename, req.body.textnote, function (err) { console.log(err) })

  res.redirect('/')
})

app.get('/notes', (req, res) => {
  items = []

  const notesPath = path.join(__dirname, 'notes')

  console.log(notesPath)
  const result = fs.readdirSync(`${notesPath}`)
  result.forEach(file => {
    console.log(file)

    const filename = path.resolve('notes', file)
    const filecontent = fs.readFileSync(filename, 'utf8')

    items.push({
      category: path.basename(filename, '.txt'),
      text: filecontent
    })

    });

  res.render('notes', {items})
})

app.get('/', function(req, res) {
  res.render('home')
})

app.listen(port, () =>{
  console.log('Executando na porta ' + port)
})