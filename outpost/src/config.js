import { readFileSync } from 'fs';
import YAML from 'yaml';

export default YAML.parse(readFileSync('./config.yml', 'utf8'));