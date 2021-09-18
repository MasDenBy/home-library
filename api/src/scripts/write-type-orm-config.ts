import { config } from '../core/config/config';
import fs = require('fs');

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(config.typeOrmConfig, null, 2),
);
