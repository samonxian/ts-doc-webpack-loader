/* eslint-disable no-restricted-syntax */
import webpack from 'webpack';
import getTsDocData from './getTsDocData';

/**
 * 返回对象模式
 */
export default function ReactDocGenLoader(this: webpack.loader.LoaderContext, source: string) {
  const genDocObject = getTsDocData(source);

  return `module.exports = ${JSON.stringify(genDocObject, null, 2)}`;
}
