import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import moment from 'moment';
import { map, delay } from 'lodash';
import { Button, Card, Row, Col, Modal, Input, Tabs, Icon, List, Avatar, Badge, Spin, Upload } from 'antd';
import { getAuthority } from '../../../utils/authority';
import styles from './IM.less';

const { TextArea } = Input;

@connect(({ tradeIm, loading }) => ({
  tradeIm,
  loading: loading.effects['tradeIm/connectSuccess'],
}))
export default class TradeIM extends PureComponent {
  state = {
    maxImg: null
  };

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    // if (this.props.tradeIm.historyList !== newProps.tradeIm.historyList) {
    //   this.scrollToBottom();
    // }
  }

  componentWillUnmount() {
  }

  handleKeyPress = (e) => {
    if (e.shiftKey && e.charCode === 13) {
      return true;
    }
    if (e.charCode === 13) {
      this.handleSubmit();
      e.preventDefault();
      return false;
    }
  }

  msgClick = (e) => {
    if (e.target.nodeName === 'IMG') {
      this.setState({
        maxImg: e.target.src
      });
    }
  }

  handleSubmit = (e) => {
    const { message } = this.state;
    console.log(message);

    if (message) {
      this.props.dispatch({
        type: 'tradeIm/sendMessage',
        payload: { message, messagetype: 1 },
        callback: () => this.setState({ message: '' })
      });
    }
  }

  scrollToBottom = () => {
    delay(() => {
      const messagesContainer = findDOMNode(this.messagesBox);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }

  handlerChangeMsg = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  handlerUpload = (event) => {
    if (event.file.status !== 'done' || !event.file.response) {
      return false;
    }
    let fileType = event.file.type ? event.file.type.toLowerCase() : '';
    let content = null;
    if (~fileType.indexOf('image/')) {
      let url = event.file.response.data.url;
      content = `<img class="btc-chat-img" src=${url} alt=${event.file.name}/>`;
    } else {
      let url = event.file.response.Data.url;
      content = `<a href=${url} download=${event.file.name}>${event.file.name}</a>`;
    }
    this.props.dispatch({
      type: 'tradeIm/sendMessage',
      payload: { message: content, messagetype: 1 }
    });
  }

  render() {
    const { maxImg } = this.state;
    const { id: uid, name, token } = getAuthority() || {};
    const { orderInfo, historyList=[], roomInfo, loading } = this.props.tradeIm || {};
    const { detail = {}, prices = {}, traders = {} } = orderInfo || {};
    const { dealer = {}, owner = {} } = traders || {};
    const { membersonlinestatus = {} } = roomInfo || {};
    const props = {
      name: 'uploadfile',
      action: CONFIG.upload_url,
      showUploadList: false,
      data: (file) => {
        return {
          filename: file.name
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
          title={(
            <div>
              <Badge style={{ marginRight: 15 }} status={membersonlinestatus[dealer.name] && !!membersonlinestatus[dealer.name].status ? 'success' : 'default'} text={`${detail.ad_type === 1 ? '买' : '卖'}家${dealer.id === detail.owner_id ? '(广告主)' : '(发起人)'}: ${dealer.name}`} />
              <Badge style={{ marginRight: 15 }} status={membersonlinestatus[owner.name] && !!membersonlinestatus[owner.name].status ? 'success' : 'default'} text={`${detail.ad_type === 1 ? '卖' : '买'}家${owner.id === detail.owner_id ? '(广告主)' : '(发起人)'}: ${owner.name}`} />
              <Badge status="success" text={`客服: ${name}`} />
            </div>
          )}
        >
          <div className={styles.card_body}>
            <div ref={el => this.messagesBox = el} className={styles.chat_history}>
              {
                historyList.length > 0 ?
                  (
                    <List
                      size="large"
                      rowKey="messageid"
                      loading={loading}
                      dataSource={historyList}
                      renderItem={item => (
                        <List.Item>
                          {
                            item.messagetype !== 1 ?
                              <div style={{ textAlign: 'center', flex: 1, color: '#1890ff' }}>{item.message}</div>
                              :
                              (
                                <List.Item.Meta
                                  className={item.sender === name ? styles.myMessageBox : null}
                                  avatar={<Avatar style={{ backgroundColor: '#f5222d', color: '#fff', verticalAlign: 'middle' }} size="large" >{item.sender.substr(0, 1)}</Avatar>}
                                  title={item.sender}
                                  description={(
                                    <div>
                                      <div className={styles.messageContent} onClick={this.msgClick} dangerouslySetInnerHTML={{ __html: item.message }} />
                                      <div className={styles.sendtime}>{moment(item.sendtime * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    </div>
                                  )}
                                />
                              )
                          }
                        </List.Item>
                      )}
                    />
                  )
                  :
                  null
              }
            </div>
            <div className={styles.chat_message_box}>
              <div className={styles.chat_tools}>
                {/* <Icon type="smile-o" style={{ fontSize: 18, marginRight: 15 }} /> */}
                <Upload {...props}>
                  <Icon type="picture" style={{ fontSize: 18 }} />
                </Upload>
              </div>
              <TextArea value={this.state.message} onChange={this.handlerChangeMsg} rows={4} placeholder="请按回车键发送消息" onKeyPress={this.handleKeyPress} />
            </div>
          </div>
        </Card>
        <Modal
          visible={!!maxImg}
          footer={null}
          onCancel={() => this.setState({ maxImg: false })}
        >
          <div className="maxImg">
            {maxImg && <img src={maxImg} alt="img" />}
          </div>
        </Modal>
      </Spin>
    );
  }
}
