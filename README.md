# ts-doc-loader

基于 tsdoc 的 webpakc loader，提供 markdown 和 data 两种模式的 loader，默认为 markdown 模式的 loader。

遵循 tsdoc 规范，同时新加了 `@default`，`?`（即非必填）两种用法，如下

```ts
/**
 * 数组（成员是可枚举对象）或可枚举对象 key 值下划线会转为驼峰式 key 值（可枚举的属性才会转换）
 * 同时保证 key 值第一个字母是小写。
 *
 * @remarks 这个函数的主要目的是为了统一规范后端接口返回的变量，前端变量规范采用驼峰式。
 * @param obj 需要格式化的变量，可以是任意值
 * @param options? 配置
 * @default { firstLetter: true }
 * @param options.firstLetter? 配置
 * @default true
 * @returns 如果不是可可枚举对象或者数组则直接返回传入参数，可枚举对象或者数组则返回处理后的对象或者数组
 * @example
 * toCamelCase("test")  // test
 * @example
 * toCamelCase({ test_a: 1 })  // { testA: 1 }
 * @example
 * toCamelCase({ _test_a: 1 })  // { testA: 1 }
 * @example
 * toCamelCase({ test_a_b: 1 })  // { testAB: 1 }
 * @example
 * toCamelCase([[{ test_a: 1 }]])  // [[{ testA: 1 }]]
 */
```

## 安装

```
npm i @tencent/ts-doc-loader
```

## 使用

### 使用 markdown 模式的 loader

** markdown 模式的 loader 处理出来的源数据还需要 md 或者 mdx 相关的 loader 进行再次处理。**

markdown 模式的 loader 会把符合规则的文本替换为一段 markdown 文本。

#### 文本规则

文本规则如下（这里采用 jsx 的模式， TsDoc 只是个语法糖）：

```jsx
<TsDoc src="path/to/your/code" exportName="default" />
// 或者
<TsDoc src="path/to/your/code">
  {/* Examplexx 组件会替换 tsdoc example 展示位置  */}
  {/* Examplexx 组件是真实的组件 */}
  <Examplexx />
</TsDoc>
```

**其中 exportName 默认为 default，和 es6 export 出来的函数或者 class 名一致，暂时不支持变量，所以如果解析的 tsdoc 不是 default，那么需要设置 exportName。**

> 其中 `src` 路径可以是相对根目录路径，也可以是绝对路径。

文本规则例子

```jsx
<TsDoc src="@tencent/shared-components/src/openConfirmModal/index.tsx">
  <Playground
    fileList={[
      {
        fileName: 'openConfirmModal',
        fileSuffix: 'tsx',
        fileContent: require('!!raw-loader!../demo/openConfirmModal/Basic.tsx'),
      },
    ]}
    sourceUrl="demo/openConfirmModal"
  >
    <Basic />
  </Playground>
</TsDoc>
```

#### webpack 配置例子

```js
const config = {
  module: {
    rules: [
      {
        test: /(\.mdx?)$/,
        use: [
          'babel-loader',
          '@mdx-js/loader',
          {
            loader: require.resolve('@tencent/ts-doc-loader'),
            options: {},
          },
        ],
      },
    ],
  },
};
```

也可以配置路径 alias，如果需要在 tsdoc 配置路径中使用 webpack alias 需要配置 options.alias。

和 webpack alias 不一样的地方在于 index.js 是不可省略的。

```js
const config = {
  module: {
    rules: [
      {
        test: /(\.mdx?)$/,
        use: [
          'babel-loader',
          '@mdx-js/loader',
          {
            loader: require.resolve('@tencent/ts-doc-loader'),
            options: {
              alias: {
                '@tencent/shared-components': path.resolve(__dirname, '../shared-components'),
                '@tencent/shared-utils': path.resolve(__dirname, '../shared-utils'),
              },
            },
          },
        ],
      },
    ],
  },
};
```

## markdow 模式 loader options

| 参数                          | 说明                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| alias                         | 别名，相当于 webpakc alias，可以在 tsdoc 读取路径使用。                              |
| locale                        | 国际化                                                                               |
| showOptionalPropsQuestionMark | 是否展示问号来展示是否是必填项，如果是使用 ts 的这个多余，如果使用 js 的话有点作用。 |

locale 结构如下：

```ts
const locale: {
  remarksTitle: string;
  exampleTitle: string;
  paramTitle: string;
  returnTitle: string;
  seeTitle: string;
  modifierTagTitle: string;
};
```
