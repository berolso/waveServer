const app = require('./app')

const {PORT} = require('./config')

app.listen(PORT, () => {
  console.log(`ok nice.. Started on http://localhost:${PORT}`);
});