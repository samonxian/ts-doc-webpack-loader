/* eslint-disable no-restricted-syntax */
import { TSDocParser, ParserContext, DocBlock, StandardTags, DocBlockTag } from '@microsoft/tsdoc';
import Formatter from './Formatter';

/**
 * 通过 tsdoc 依赖包获取输入文本符合 tsdoc 规范的文档数据。
 *
 * 只支持单个函数 tsdoc 提前，有多个的 tsdoc 定义，读取第一个。
 *
 * @param source 文档源
 * @returns 返回 summaryBlock,remarkBlocks,paramBlocks,returnsBlock,exampleBlocks,modifierTags
 */
export default function getTsDocData(source: string) {
  const tsdocParser: TSDocParser = new TSDocParser();
  const parserContext: ParserContext = tsdocParser.parseString(
    source.replace(/import .* '.*';/g, '').replace(/import .* ".*";/g, '')
  );

  const { docComment } = parserContext;
  const paramBlocks = [];
  const exampleBlocks = [];
  const modifierTags = [];
  const seeBlocks = [];
  const modifierTagsDoc: ReadonlyArray<DocBlockTag> = docComment.modifierTagSet.nodes;
  const exampleBlocksDoc: DocBlock[] = docComment.customBlocks.filter(
    x => x.blockTag.tagNameWithUpperCase === StandardTags.example.tagNameWithUpperCase
  );

  if (modifierTagsDoc.length > 0) {
    for (const modifierTag of modifierTagsDoc) {
      modifierTags.push(modifierTag.tagName);
    }
  }

  for (const paramBlock of docComment.params.blocks) {
    const description = Formatter.renderDocNode(paramBlock.content) || '';
    const paramRegExp = /\s([a-z|A-Z|$_.?]+)\s/;
    const defaultRegExp = /@default\s(.*)/;
    const requiredRegExp = /^\?\s(.*)/;
    // 这里做了 `props.footer` 模式的兼容
    const name = paramBlock.parameterName || description.match(paramRegExp)?.[1];
    const lastDesc = description.replace(paramRegExp, '');
    const required = !(name?.includes('?') || requiredRegExp.test(lastDesc));

    paramBlocks.push({
      name: name?.replace('?', ''),
      description: lastDesc.replace(requiredRegExp, '$1').replace(defaultRegExp, ''),
      required,
      defaultValue: lastDesc.match(defaultRegExp)?.[1],
    });
  }

  for (const exampleBlock of exampleBlocksDoc) {
    exampleBlocks.push(Formatter.renderDocNode(exampleBlock.content));
  }

  if (docComment.seeBlocks.length > 0) {
    for (const seeBlock of docComment.seeBlocks) {
      seeBlocks.push(Formatter.renderDocNode(seeBlock.content));
    }
  }

  const genDocObject = {
    summarySection: Formatter.renderDocNode(docComment.summarySection),
    remarksBlock: docComment.remarksBlock && Formatter.renderDocNode(docComment.remarksBlock.content),
    paramBlocks,
    returnsBlock: docComment.returnsBlock && Formatter.renderDocNode(docComment.returnsBlock.content),
    exampleBlocks,
    seeBlocks,
    modifierTags,
  };

  return genDocObject;
}
