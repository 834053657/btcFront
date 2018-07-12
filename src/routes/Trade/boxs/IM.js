import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import {List, InfiniteLoader, AutoSizer} from 'react-virtualized';
import moment from 'moment';
import { map, delay,get } from 'lodash';
import antd from 'antd';
import styles from './IM.less';

const {
  Button,
  Card,
  Row,
  Col,
  Modal,
  Input,
  List:AList,
  Icon,
  Avatar,
  Badge,
  Spin,
  Upload,
} = antd;
const { TextArea } = Input;

const ListItem = AList;
const ItemMate = ListItem.Meta;

export default class TradeIM extends PureComponent {
  state = {
    maxImg: null,
  };

  componentDidMount() {
    const { orderId, dispatch } = this.props;
    dispatch({
      type: 'trade/fetchImHistory',
      payload: {
        order_id: orderId,
      }
    })
  }

  componentWillUnmount() {}

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
      this.setState({
        maxImg: e.target.src,
      });
    }
  };

  handleSendMessage = () => {
    const { message } = this.state;
    const { orderId, dispatch } = this.props;

    if (message) {
     dispatch({
        type: 'socket/send_message',
        payload: { message, order_id: orderId },
        callback: () => this.setState({ message: '' }),
      });
    }
  };

  scrollToBottom = () => {
    delay(() => {
      const messagesContainer = findDOMNode(this.messagesBox);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  };

  handlerChangeMsg = e => {
    this.setState({
      message: e.target.value,
    });
  };

  handlerUpload = event => {
    if (event.file.status !== 'done' || !event.file.response) {
      return false;
    }
    const fileType = event.file.type ? event.file.type.toLowerCase() : '';
    let content = null;
    const { orderId, dispatch } = this.props;

    if (~fileType.indexOf('image/')) {
      const url = event.file.response.data.url;
      content = `<img class="btc-chat-img" src=${url} alt=${event.file.name}/>`;
    } else {
      const url = event.file.response.Data.url;
      content = `<a href=${url} download=${event.file.name}>${event.file.name}</a>`;
    }
    dispatch({
      type: 'tradeIm/sendMessage',
      payload: { message: content, order_id: orderId },
    });
  };

  getChatUser = () => {
    const { orderDetail, currentUser } = this.props;
    const { user = {} } = currentUser || {};
    const { ad = {}, trader={} } = orderDetail || {};
    const { owner={} } = ad || {};
    const traderUser = trader.id === user.id ? owner : trader;
    return (
      <div>
        <Badge status={traderUser.online ? 'success': 'default'} text={traderUser.nickname} />
      </div>
    )
  }

  renderMessage = ({index, key,style}) => {
    const uid =get(this.props, 'currentUser.user.id') || {};
    const historyList = get(this.props, 'tradeIm.historyList') || [];
    const item =  historyList[index]|| {};
    const { message={}, msg_type, created_at, sender={} } = item;

    return (
      <AList.Item key={key} style={style}>
        {msg_type !== 1 ? (
          <div style={{ textAlign: 'center', flex: 1, color: '#1890ff' }}>
            {message.content}
          </div>
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
                  className={styles.messageContent}
                  onClick={this.msgClick}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
                <div className={styles.sendtime}>
                  {created_at ? moment(created_at* 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </div>
              </div>
            }
          />
        )}
      </AList.Item>
    )
  }

  render() {
    const { maxImg, message } = this.state;
    const {  tradeIm, loading } = this.props;
    const { historyList = [] } = tradeIm || {};
    const props = {
      name: 'uploadfile',
      action: CONFIG.upload_url,
      showUploadList: false,
      data: file => {
        return {
          filename: file.name,
        };
      },
      accept: 'image/png, image/jpeg, image/gif',
      onChange: this.handlerUpload,
    };

    return (
      <Spin spinning={false}>
        <Card
          bodyStyle={{ padding: 0 }}
          className={styles.chat_card}
          title={this.getChatUser()}
        >
          <div className={styles.card_body}>
            <div ref={el => (this.messagesBox = el)} className={styles.chat_history}>
              {historyList.length > 0 ? (
                <AList
                  size="large"
                  loading={loading}
                  // dataSource={historyList}
                  // renderItem={this.renderMessage}
                >
                  <InfiniteLoader
                    isRowLoaded={(index)=> !!historyList[index]}
                    rowCount={historyList.length}
                    loadMoreRows={function () { }}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <AutoSizer disableHeight>
                        {({ width }) => (
                          <List
                            rowHeight={73}
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
                <Upload {...props}>
                  <Icon type="picture" style={{ fontSize: 18 }} />
                </Upload>
              </div>
              <TextArea
                value={message}
                onChange={this.handlerChangeMsg}
                rows={4}
                placeholder="请按回车键发送消息"
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>
        </Card>
        <Modal visible={!!maxImg} footer={null} onCancel={() => this.setState({ maxImg: false })}>
          <div className="maxImg">{maxImg && <img src={maxImg} alt="img" />}</div>
        </Modal>
      </Spin>
    );
  }
}
