import app from './app';
import { SERVER_CONFIGS } from './configs';

const PORT = SERVER_CONFIGS.PORT;
app.listen(PORT, () => {
  console.log('Server is up and running at PORT:', PORT);
});
