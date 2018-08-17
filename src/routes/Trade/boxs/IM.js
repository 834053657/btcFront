import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { List, InfiniteLoader, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import moment from 'moment';
import { isEqual, map, delay, defer, get, findIndex, forEach } from 'lodash';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import throttle from 'lodash-decorators/throttle';
import bind from 'lodash-decorators/bind';
import antd from 'antd';
import getMessage from '../../../utils/getMessage';
import styles from './IM.less';

const {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Input,
  List: AList,
  Icon,
  Avatar,
  Badge,
  Spin,
  Upload,
  message: Message
} = antd;
const { TextArea } = Input;

const ListItem = AList;
const ItemMate = ListItem.Meta;
const msg = defineMessages({
  upload_error: {
    id: 'IM.upload_error',
    defaultMessage: '上传发生错误!',
  },
  file_limit: {
    id: 'IM.file_limit',
    defaultMessage: '文件必须小于2M!',
  },
  enter_btn: {
    id: 'IM.enter_btn',
    defaultMessage: '请按回车键发送消息!',
  },
  into_room: {
    id: 'IM.into_room',
    defaultMessage: '进入房间中...',
  },
});
@injectIntl()

export default class TradeIM extends PureComponent {
  state = {
    maxImg: null,
  };

  constructor(props) {
    super(props)
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'im/fetchImHistory',
      payload: {
        order_id: this.props.orderId,
      }
    });
    this.props.dispatch({
      type: 'im/enterRoom',
      payload: { order_id: this.props.orderId },
    })
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.orderId !== nextProps.orderId) {
      nextProps.dispatch({
        type: 'im/fetchImHistory',
        payload: {
          order_id: nextProps.orderId,
        }
      });
      nextProps.dispatch({
        type: 'im/enterRoom',
        payload: { order_id: nextProps.orderId },
      })
    }
  }

  componentDidUpdate(prevProps) {
    const currHistoryList = get(this.props, 'im.historyList', [])
    const prevHistoryList = get(prevProps, 'im.historyList', [])
    forEach(currHistoryList, (history, index) => {
      if (!isEqual(history, prevHistoryList[findIndex(prevHistoryList, history)])) {
        this.cache.clear(index)
      }
    })
  }

  componentWillUnmount() {
    const { orderId, dispatch } = this.props;
    dispatch({
      type: 'im/leaveRoom',
      payload: { order_id: orderId },
    })
  }

  handleKeyPress = e => {
    if (e.shiftKey && e.charCode === 13) {
      return true;
    }
    if (e.charCode === 13) {
      this.handleSendMessage();
      e.preventDefault();
      return false;
    }
  };

  msgClick = e => {
    if (e.target.nodeName === 'IMG') {
      this.setState({maxImg: e.target.src, });
    }
  };

  @bind()
  @throttle(1000)
  handleSendMessage() {
    const { message } = this.state;
    const { orderId, dispatch } = this.props;
    if (message) {
      dispatch({
        type: 'im/sendMessage',
        payload: { content: message, order_id: orderId },
        callback: () => this.setState({ message: '' }),
      });
    }
  };

  handlerChangeMsg = e => {
    this.setState({
      message: e.target.value,
    });
  };

  @bind()
  @throttle(1000)
  handlerUpload(event) {
    if (event.file.status !== 'done' || !event.file.response) {
      return false
    }
    const fileType = event.file.type ? event.file.type.toLowerCase() : '';
    let content = null;
    const upload = get(this.props, 'currentUser.upload') || {};
    const { orderId, dispatch } = this.props;
    const url = upload.prefix + event.file.response.hash
    if (!url) {
      Message.error(this.props.intl.formatMessage(msg.upload_error));
      return false
    }
    if (~fileType.indexOf('image/')) {
      content = `<img class="chat-img" src="${url}" alt="${event.file.name}"/>`;
    } else {
      content = `<a href="${url}" download="${event.file.name}">${event.file.name}</a>`;
    }
    dispatch({
      type: 'im/sendMessage',
      payload: { content, order_id: orderId },
    });
  };

  getChatUser = () => {
    const { orderDetail, currentUser } = this.props;
    const { user = {} } = currentUser || {};
    const { ad = {}, trader = {} } = orderDetail || {};
    const { owner = {} } = ad || {};
    const traderUser = trader.id === user.id ? owner : trader;
    return (
      <div>
        <Badge status={traderUser.online ? 'success' : 'default'} text={traderUser.nickname} />
      </div>
    );
  };

  renderMessage = ({ index, key, parent, style }) => {
    const uid = get(this.props, 'currentUser.user.id') || {};
    const historyList = get(this.props, 'im.historyList') || [];
    const item = historyList[index] || {};
    const { message = {}, msg_type, created_at_millisec, sender = {} } = item;
    const detail = getMessage(item, 'im')
    const content = detail ? detail.content : ''
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        {({measure}) => (
          <AList.Item key={key} style={style}>
            {msg_type !== 101 ? (
              <div style={{ textAlign: 'center', flex: 1, color: '#1890ff' }}>{content}</div>
            ) : (
              <AList.Item.Meta
                className={sender.id === uid ? styles.myMessageBox : null}
                avatar={
                  <Avatar
                    src={sender.avatar}
                    style={{
                      color: '#fff',
                      verticalAlign: 'middle',
                    }}
                    size="large"
                  >
                    {sender.nickname.substr(0, 1)}
                  </Avatar>
                }
                title={sender.nickname}
                description={
                  <div>
                    <div
                      ref={(contentWrapper) => {this.contentWrapper = contentWrapper}}
                      className={styles.messageContent}
                      onClick={this.msgClick}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <div className={styles.sendtime}>
                      {created_at_millisec ? moment(created_at_millisec).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </div>
                  </div>
                }
              />
            )}
          </AList.Item>
        )}
      </CellMeasurer>
    );
  };

  render() {
    const { maxImg, message } = this.state;
    const { loading } = this.props;
    const historyList = get(this.props, 'im.historyList') || [];
    const upload = get(this.props, 'currentUser.upload') || {};
    const uploadProps = {
      name: 'file',
      disabled: !this.props.im.room_id,
      action: upload.domain,
      multiple: false,
      showUploadList: false,
      data: { token: upload.token },
      accept: 'image/png, image/jpeg, image/gif',
      onChange: this.handlerUpload,
      beforeUpload: (file) => {
        const isLtMB = file.size / 1024 / 1024 < 2;
        if (!isLtMB) {
          Message.error(this.props.intl.formatMessage(msg.file_limit));
        }
        return isLtMB;
      }
    };
    return (
      <Spin spinning={false}>
        <Card
          bodyStyle={{ padding: 0 }}
          className={styles.chat_card}
          title={this.getChatUser()}
          ref={(card) => this.card = card}
        >
          <div className={styles.card_body}>
            <div className={styles.chat_history}>
              {historyList.length > 0 ? (
                <AList
                  size="large"
                  // dataSource={historyList}
                  // renderItem={this.renderMessage}
                >
                  <InfiniteLoader
                    isRowLoaded={index => !!historyList[index]}
                    rowCount={historyList.length}
                    loadMoreRows={() => {}}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <AutoSizer disableHeight>
                        {({ width }) => (
                          <List
                            overscanRowCount={20}
                            deferredMeasurementCache={this.cache}
                            rowHeight={this.cache.rowHeight}
                            scrollToIndex={historyList.length - 1}
                            height={390}
                            width={width}

                            rowRenderer={this.renderMessage}
                            rowCount={historyList.length}
                          />
                        )}
                      </AutoSizer>
                    )}
                  </InfiniteLoader>
                </AList>
              ) : null}
            </div>

            <div className={styles.chat_message_box}>
              <div className={styles.chat_tools}>
                {/* <Icon type="smile-o" style={{ fontSize: 18, marginRight: 15 }} /> */}
                <Upload {...uploadProps}>
                  <Icon type="picture" style={{ fontSize: 18 }} />
                </Upload>
              </div>
              <TextArea
                disabled={!this.props.im.room_id}
                value={message}
                onChange={this.handlerChangeMsg}
                rows={4}
                placeholder={this.props.im.room_id ? (this.props.intl.formatMessage(msg.enter_btn)) : this.props.intl.formatMessage(msg.into_room)}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>
        </Card>
        <Modal style={{width: 'auto'}} visible={!!maxImg} footer={null} onCancel={() => this.setState({ maxImg: false })}>
          <div className={styles.maxImg}>{maxImg && <img src={maxImg} alt="img" />}</div>
        </Modal>
      </Spin>
    );
  }
}
