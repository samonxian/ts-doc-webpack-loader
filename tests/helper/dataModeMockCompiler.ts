import fs from 'fs';
import webpack from 'webpack';
import dataLoader from '../../src/dataLoader';

export default (entry: string) => {
  const source = fs.readFileSync(entry, { encoding: 'utf-8' });

  return dataLoader.bind(({} as unknown) as webpack.loader.LoaderContext)(source);
};
