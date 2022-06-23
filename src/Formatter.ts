import { DocNode, DocExcerpt } from '@microsoft/tsdoc';

/**
 * This is a simplistic solution until we implement proper DocNode rendering APIs.
 */
export default class Formatter {
  public static renderDocNode(docNode: DocNode): string {
    let result = '';

    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        result += docNode.content.toString();
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const childNode of docNode.getChildNodes()) {
        result += Formatter.renderDocNode(childNode);
      }
    }
    return result;
  }

  public static renderDocNodes(docNodes: ReadonlyArray<DocNode>): string {
    let result = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const docNode of docNodes) {
      result += Formatter.renderDocNode(docNode);
    }
    return result;
  }
}
