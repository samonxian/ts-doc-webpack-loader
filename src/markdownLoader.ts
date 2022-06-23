/* eslint-disable no-restricted-syntax */
import path from 'path';
import resolve from 'resolve';
import webpack from 'webpack';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import fs from 'fs';
import { Schema } from 'schema-utils/declarations/ValidationError';
import getTsDocData from './getTsDocData';
import getJsxCodeAst from './utils/getJsxCodeAst';

/**
 * 标题国际化文案，需要使用 markdown 格式，一般都是二级标题
 */
export const zhCnLocale = {
  remarksTitle: '## 备注',
  exampleTitle: '## 使用例子',
  paramTitle: '## 参数',
  returnTitle: '## 返回值',
  seeTitle: '## 参考',
  modifierTagTitle: '## 其他',
};

export interface Option {
  /**
   * 别名设置，类似 webpack alias
   */
  alias?: Record<string, any>;
  /**
   * 标题国际化
   */
  locale?: typeof zhCnLocale;
  /**
   * 是否展示问号来展示是否是必填项，如果是使用 ts 的这个多余，如果使用 js 的话有点作用。
   * @default true
   */
  showOptionalPropsQuestionMark?: boolean;
}

const schema: Schema = {
  type: 'object',
  properties: {
    alias: {
      type: 'object',
    },
  },
};

/**
 * 返回 markdown 文本
 */
export default function loader(this: webpack.loader.LoaderContext, source: string) {
  const options = (getOptions(this) as unknown) as Readonly<Option>;
  validateOptions(schema, options);
  const { showOptionalPropsQuestionMark = true } = options;

  const fileText = source.replace('\r', ''); // 替换掉 windows 的 \r
  const tsdocRegExp = /<TsDoc[\s\n][^>]*>([^]*)<\/TsDoc>/; // 格式为 <TsDoc ..></TsDoc>
  const tsdocNoChidRegExp = /<TsDoc[\s\n][^>]*\/>/gi; // 格式为 <TsDoc ../>
  const matchedCode = fileText.match(RegExp(tsdocRegExp, 'gi')) || [];
  const matchedNoChildCode = fileText.match(tsdocNoChidRegExp) || [];
  const code = matchedCode.concat(matchedNoChildCode).filter(Boolean)[0]; // 取第一个匹配的
  let tsdocPath = '';
  let exampleContent = '';
  // 参数表格展示的 export 函数名，默认为 default，即 export default。
  let exportNameToShow = 'default';

  if (code) {
    const result = getJsxCodeAst(code);
    // prettier-ignore
    const { props } = result
        .map(re => {
          if (re.$componentName === 'TsDoc') {
            return re;
          }
        })
        .filter(Boolean)[0] || {};
    tsdocPath = props.src;

    if (tsdocRegExp.test(code)) {
      exampleContent = RegExp.$1;
    }

    if (props.exportName) {
      exportNameToShow = props.exportName;
    }
  }

  if (!!tsdocPath) {
    if (options.alias) {
      Object.keys(options.alias).forEach(aliasName => {
        if (RegExp(`^${aliasName.replace('$', '\\$')}.*`).test(tsdocPath)) {
          tsdocPath = resolve.sync(path.relative(__dirname, tsdocPath.replace(aliasName, options.alias?.[aliasName])), {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          });
        }
      });
    }
    // 这个添加当前读取的文件进 watch 监控模式
    this.addDependency(tsdocPath);
    const fileInput = fs.readFileSync(path.resolve(tsdocPath), { encoding: 'utf-8' });
    // 匹配出 /**\n  \n*/ 格式的注释。
    const tsDocList = fileInput.match(/\/\*\*\n[^]*?\*\/\n.*/g);
    let tsDocInput = '';

    if (!tsDocList) {
      return source;
    }

    const reg1 = RegExp(`export\\s${exportNameToShow}.*`); // export default function test()
    const reg2 = RegExp(`export\\s(function|class).*${exportNameToShow}.*`); // export function test()
    const reg3 = RegExp(`export\\s(const|let|var)\\s${exportNameToShow}.*=.*`); // export const test = function a()
    tsDocList.forEach(doc => {
      if (reg1.test(doc) || reg2.test(doc) || reg3.test(doc)) {
        tsDocInput = doc;
      }
    });

    const {
      summarySection,
      remarksBlock,
      exampleBlocks,
      paramBlocks,
      returnsBlock,
      seeBlocks,
      modifierTags,
    } = getTsDocData(tsDocInput);
    const locale = options.locale || zhCnLocale;
    const { remarksTitle, exampleTitle, paramTitle, returnTitle, seeTitle, modifierTagTitle } = locale;

    let remardMarkdownText = '';
    if (remarksBlock) {
      remardMarkdownText = `
${remarksTitle}

${remarksBlock}
      `;
    }

    let examplesMarkdownText = '';
    if (exampleContent) {
      examplesMarkdownText = `${exampleTitle}\n${exampleContent}`;
    } else if (exampleBlocks.length > 0) {
      exampleBlocks.map((block, index) => {
        examplesMarkdownText += `
${exampleTitle} ${index !== 0 ? index : ''}

${block}
        `;
      });
    }

    let paramsMarkdownText = '';
    if (paramBlocks.length > 0) {
      paramsMarkdownText = `
${paramTitle}

| 参数 | 说明 | 默认值 |
| :--- | :--- | :----- |
`;
      paramBlocks.map(({ name, defaultValue = '-', description = '-', required }) => {
        const showQuestionMark = !required && showOptionalPropsQuestionMark;

        paramsMarkdownText += `| ${name}${showQuestionMark ? '?' : ''} | ${description.trim()} | ${defaultValue} |\n`;
      });
    }

    let returnMarkdownText = '';
    if (returnsBlock) {
      returnMarkdownText = `
${returnTitle}

${returnsBlock}
      `;
    }

    let seeMarkdownText = '';
    if (seeBlocks.length > 0) {
      seeMarkdownText = seeTitle;
      seeBlocks.map(blocks => {
        seeMarkdownText += `

${blocks}
        `;
      });
    }

    let modifierTagMarkdownText = '';
    if (modifierTags.length > 0) {
      modifierTagMarkdownText = modifierTagTitle;
      modifierTags.map(blocks => {
        modifierTagMarkdownText += `

${blocks}
        `;
      });
    }

    const tsDocMarkdownText = `
${summarySection}
${remardMarkdownText}
${examplesMarkdownText}
${paramsMarkdownText}
${returnMarkdownText}
${seeMarkdownText}
${modifierTagMarkdownText}
    `;

    return source.replace(code, tsDocMarkdownText);
  }

  return source;
}
