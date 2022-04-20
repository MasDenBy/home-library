import configuration from '../core/config/configuration';
import fs = require('fs');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configuration().typeOrmConfig, null, 2),
);
