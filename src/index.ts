require('dotenv').config({ path: '.env' });
import app from './app';

const PORT = process.env.PORT || 3000;

app.set('port', PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running on PORT ${PORT}`);
});
