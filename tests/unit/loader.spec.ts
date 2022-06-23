import path from 'path';
import markdownModeCompiler from '../helper/markdownModeMockCompiler';

describe('markdownLoader(default example)', () => {
  it('generates correctly with relative path.', async () => {
    const output = markdownModeCompiler('./tests/fixture/openConfirmModalDefaultExample.mdx');

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('openConfirmModal({'); // 默认例子
    expect(output).toContain('## 备注');
    expect(output).toContain('## 参数');
    expect(output).toContain('## 返回值');
    expect(output).toContain('## 参考');
    expect(output).toContain('## 其他');
  });

  it('generates correctly with absolute path.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/openConfirmModalDefaultExample.mdx'));

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('openConfirmModal({'); // 默认例子
    expect(output).toContain('## 备注');
    expect(output).toContain('## 参数');
    expect(output).toContain('## 返回值');
    expect(output).toContain('## 参考');
    expect(output).toContain('## 其他');
  });

  it('generates correctly with options locale.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/openConfirmModalDefaultExample.mdx'), {
      locale: {
        remarksTitle: '## Remarks',
        exampleTitle: '## Example',
        paramTitle: '## Params',
        returnTitle: '## returns',
        seeTitle: '## See',
        modifierTagTitle: '## Modifier Tag',
      },
    });

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('openConfirmModal({'); // 默认例子
    expect(output).toContain('## Remarks');
    expect(output).toContain('## Params');
    expect(output).toContain('## returns');
    expect(output).toContain('## See');
    expect(output).toContain('## Modifier Tag');
  });

  it('generates correctly with options locale.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/openConfirmModalDefaultExample.mdx'), {
      showOptionalPropsQuestionMark: false,
    });

    expect(!!~output.indexOf('props?')).toBe(false);
  });
});

describe('markdownLoader(custom example)', () => {
  it('generates correctly with relative path.', async () => {
    const output = markdownModeCompiler('./tests/fixture/default.mdx');

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('<Playground');
    expect(output).toContain('<Basic />');
    expect(output).toContain('## 备注');
    expect(output).toContain('## 参数');
    expect(output).toContain('## 返回值');
    expect(output).toContain('## 参考');
    expect(output).toContain('## 其他');
  });

  it('generates correctly with absolute path.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/default.mdx'));

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('<Playground');
    expect(output).toContain('<Basic />');
    expect(output).toContain('## 备注');
    expect(output).toContain('## 参数');
    expect(output).toContain('## 返回值');
    expect(output).toContain('## 参考');
    expect(output).toContain('## 其他');
  });

  it('generates correctly with options locale.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/default.mdx'), {
      locale: {
        remarksTitle: '## Remarks',
        exampleTitle: '## Example',
        paramTitle: '## Params',
        returnTitle: '## returns',
        seeTitle: '## See',
        modifierTagTitle: '## Modifier Tag',
      },
    });

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。');
    expect(output).toContain('props?');
    expect(output).toContain('<Playground');
    expect(output).toContain('<Basic />');
    expect(output).toContain('## Remarks');
    expect(output).toContain('## Params');
    expect(output).toContain('## returns');
    expect(output).toContain('## See');
    expect(output).toContain('## Modifier Tag');
  });

  it('generates correctly with options locale.', async () => {
    const output = markdownModeCompiler(path.resolve(__dirname, '../fixture/default.mdx'), {
      showOptionalPropsQuestionMark: false,
    });

    expect(!!~output.indexOf('props?')).toBe(false);
  });
});

describe('markdownLoader(custom exportName)', () => {
  it('generates correctly with relative path.', async () => {
    const output = markdownModeCompiler('./tests/fixture/custom.mdx');

    expect(output).toContain('id: open-confirm-modal');
    expect(output).toContain("import Basic from '../demo/openConfirmModal/Basic.tsx';");
    expect(output).toContain('创建和读取 cookie，方便直接使用，同时保证对外 api 一致。');
    expect(output).toContain('options?');
    expect(output).toContain('options.expires?');
  });
});
