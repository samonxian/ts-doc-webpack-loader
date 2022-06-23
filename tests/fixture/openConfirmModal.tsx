import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'antd';
import isBoolean from 'lodash/isBoolean';
import { ModalProps } from 'antd/lib/modal';

/**
 * 创建和读取 cookie，方便直接使用，同时保证对外 api 一致。
 *
 * @param options? 详细的配置说明看官方说明 https://github.com/js-cookie/js-cookie
 * @param options.expires? 有效期，单位为天。
 * @default 30
 * @param  options.path? 允许访问的 cookie 路径，只有在此路径下才可以读写 cookie，
 * @default /
 * @param options.domain? 设置的域名，默认为当前域名（一般都不用设置域名）
 * @return test
 */
export class CreateCookie {
  private options: CreateCookieOptions;

  public constructor(options = {}) {
    this.options = {
      ...{ expires: 30, path: '/' },
      ...options,
    };
  }
}

/**
 * Modal 样子的确认提示框, 不需要以 jsx 组件使用，可直接以函数调用。
 *
 * @remarks 也可以当做普通 Modal 使用，有时候 `Modal.cofirm`、`Modal.info` 等不适合定制，可以使用这个定制。
 * @param props? 继承 Antd Modal props，新增下面的 props.
 * @param props.content 模态框内部的内容
 * @returns gg
 * @example
 * ```js
 * openConfirmModal({
 *   content: '内容',
 *   footer: false,
 * });
 * ```
 * @see link
 * @beta
 */
export default function (props: ConfirmModalProps) {
  const tempElement = document.createElement('span');
  let modalInstance: ConfirmModal;

  ReactDOM.render(
    <ConfirmModal
      {...props}
      mountCallback={modal => {
        modal.openModal();
        modalInstance = modal;
      }}
      getContainer={tempElement}
      onCancel={() => {
        document.body.removeChild(tempElement);
      }}
    />,
    tempElement
  );

  document.body.appendChild(tempElement);
  return {
    close: () => {
      modalInstance.closeModal();
    },
  };
}

export interface ConfirmModalProps extends ModalProps {
  /**
   * ConfirmModal 组件 componentDidMout 触发的回调函数。
   */
  mountCallback?: (modalObj: ConfirmModal) => void;
  /**
   * 相当于 Antd Modal 子组件。
   */
  content: React.ReactNode;
}

export class ConfirmModal extends React.Component<ConfirmModalProps> {
  public static displayName = 'InfoModal';
  public static defaultProps = {
    closable: false,
  };
  public state = { visible: false };

  public componentDidMount() {
    const { mountCallback } = this.props;
    mountCallback?.(this);
  }

  public closeModal = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      visible: false,
    });
    const { onCancel } = this.props;
    onCancel?.(event as React.MouseEvent<HTMLElement, MouseEvent>);
  };

  public onOk = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({
      visible: false,
    });
    const { onOk } = this.props;
    onOk?.(event);
  };

  public openModal = () => {
    this.setState({
      visible: true,
    });
  };

  public render() {
    const { content, footer, ...rest } = this.props;
    const { visible } = this.state;
    let footerElement: boolean | React.ReactNode = false;

    if ((isBoolean(footer) && footer) || footer === undefined) {
      footerElement = (
        <Button type="primary" onClick={this.closeModal}>
          确认
        </Button>
      );
    } else if (footer) {
      footerElement = footer;
    }

    return (
      <Modal
        cancelText=""
        {...rest}
        visible={visible}
        onCancel={this.closeModal}
        onOk={this.onOk}
        footer={footerElement}
      >
        {content}
      </Modal>
    );
  }
}
