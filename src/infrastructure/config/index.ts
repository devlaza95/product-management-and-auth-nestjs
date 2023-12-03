import { ConfigModuleOptions } from '@nestjs/config';
import configuration from './configuration';
import { validationSchema } from './validation';

const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  load: [configuration],
  validationSchema,
};

export default configModuleOptions;
