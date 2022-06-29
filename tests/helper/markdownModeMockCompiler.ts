import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import markdownLoader, {  Option } from '../../src/markdownLoader';

export default (entry: string, options?: Option) => {
  const source = fs.readFileSync(entry, { encoding: 'utf-8' });

  return markdownLoader.bind(({
    query: {
      alias: {
        'shared-components': path.resolve(__dirname, '../fixture'),
      },
      ...options,
    },
    addDependency: () => {},
  } as unknown) as webpack.loader.LoaderContext)(source);
};
