const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 4001

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

let monitorData = {}

app.get('/api/monitor', (_, res) => {
    res.status(200).json(monitorData)
})

app.get('*', (_, res) => {
    res.status(200).sendFile(path.join(__dirname, './index.html'))
})

app.post('/api/monitor', (req, res) => {
    monitorData = req.body
    res.sendStatus(204)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = app
