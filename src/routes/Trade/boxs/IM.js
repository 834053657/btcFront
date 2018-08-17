import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom'
import { List, InfiniteLoader, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import moment from 'moment';
import { isEqual, get, findIndex, find, forEach } from 'lodash';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import debounce from 'lodash-decorators/debounce';
import throttle from 'lodash-decorators/throttle';
import bind from 'lodash-decorators/bind';
import antd from 'antd';
import getMessage from '../../../utils/getMessage';
import styles from './IM.less';

const {
  Card,
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

@connect(({ im, user, loading }) => ({
  im,
  loading: loading.effects['im/syncHistory'], 
  currentUser: user.currentUser,
}))
export default class IM extends PureComponent {
  static defaultProps = {
    orderId: null,
    header: null,
  }

  static propTypes = {
    orderId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]), 
    header: PropTypes.object,
  }

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
      type: 'im/syncHistory',
      payload: {
        order_id: this.props.orderId,
      },
      callback: () => {
        this.props.dispatch({ type: 'im/scrollToBottom' })
      }
    })
    this.props.dispatch({
      type: 'im/enterRoom',
      payload: { order_id: this.props.orderId },
    })
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.orderId !== nextProps.orderId) {
      nextProps.dispatch({
        type: 'im/syncHistory',
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
    const currRecords = get(this.props, 'im.records', [])
    const prevRecords = get(prevProps, 'im.records', []) 
    forEach(currRecords, (record, index) => {
      if (!isEqual(record, prevRecords[findIndex(prevRecords, record)])) {
        this.cache.clear(index)
        this.vlist && this.vlist.recomputeRowHeights(index)
      }
    })

    const currScrollBottom= get(this.props, 'im.scrollBottom', null)
    const prevScrollBottom = get(prevProps, 'im.scrollBottom', null) 
    if (currScrollBottom !== prevScrollBottom) {
      this.scrollToBottom()
    }
  }

  @bind()
  scrollToBottom() {
    if (!this.vlist) return
    const ele = findDOMNode(this.vlist)
    if (ele.scrollHeight - ele.clientHeight > ele.scrollTop) {
      this.vlist.scrollToPosition(ele.scrollHeight - ele.clientHeight)
      requestAnimationFrame(this.scrollToBottom)
    } 
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
  }

  handleMsgClick = e => {
    if (e.target.nodeName === 'IMG') {
      this.setState({maxImg: e.target.src, })
    }
  }

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
      })
    }
  }

  handleChangeMsg = e => {
    this.setState({
      message: e.target.value,
    })
  }

  @bind()
  @debounce(800)
  handleLoadMoreRows({startIndex, stopIndex}) {
    return this.props.dispatch({
      type: 'im/fetchHistory',
      payload: {
        order_id: this.props.orderId,
        start_index: startIndex,
        end_index: stopIndex,
      }
    })
  }

  @bind()
  @throttle(1000)
  handleUpload(event) {
    if (event.file.status !== 'done' || !event.file.response) {
      return false
    }
    const fileType = event.file.type ? event.file.type.toLowerCase() : '';
    let content = null;
    const upload = get(this.props, 'currentUser.upload') || {};
    const { orderId, dispatch } = this.props;
    const url = upload.prefix + event.file.response.hash
    if (!url) {
      Message.error(PROMPT('IM.upload_error')||'上传发生错误!');
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
    const uid = get(this.props, 'currentUser.user.id', {})
    const records = get(this.props, 'im.records', [])
    const members = get(this.props, 'im.members', [])
    const isOnline = (user) => (find(members, { id: user.id }) || {}).online === true
    const item = records[index] || {};
    const { msg_type, created_at_millisec, sender = {} } = item;
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
        {() => (
          <AList.Item key={key} style={style}>
            {msg_type == null ? (
              <AList.Item.Meta
                className={styles.loadingBox}
                avatar={
                  <Avatar size="large" />
                }
                title={<span className={styles.placeholder}>xxx</span>}
                description={
                  <div>
                    <div className={styles.messageContent}><span className={styles.placeholder}>xxxxxxxxxxxxxxxxxx</span></div>
                    <div className={styles.sendtime}><span className={styles.placeholder}>xxxxxxx</span></div>
                  </div>
                }
              /> 
            ) : (msg_type !== 101 ? (
              <div style={{ textAlign: 'center', flex: 1, color: '#1890ff' }}>{content}</div>
            ) : (
              <AList.Item.Meta
                className={sender.id === uid ? styles.myMessageBox : null}
                avatar={
                  <Badge style={{ top: '80%', left: '85%' }} status={isOnline(sender) ? 'success' : 'default'} dot>
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
                  </Badge>
                }
                title={sender.nickname}
                description={
                  <div>
                    <div
                      ref={(contentWrapper) => {this.contentWrapper = contentWrapper}}
                      className={styles.messageContent}
                      onClick={this.handleMsgClick}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <div className={styles.sendtime}>
                      {!item.id && <Icon type="loading" style={{ marginLeft: 10, fontSize: 10 }} spin />}
                      {created_at_millisec ? moment(created_at_millisec).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </div>
                  </div>
                }
              />
            ))}
          </AList.Item>
        )}
      </CellMeasurer>
    );
  };

  render() {
    const { maxImg, message } = this.state;
    // const { loading } = this.props;
    const records = get(this.props, 'im.records') || []
    const upload = get(this.props, 'currentUser.upload') || {}
    const uploadProps = {
      name: 'file',
      disabled: !this.props.im.room_id,
      action: upload.domain,
      multiple: false,
      showUploadList: false,
      data: { token: upload.token },
      accept: 'image/png, image/jpeg, image/gif',
      onChange: this.handleUpload,
      beforeUpload: (file) => {
        const isLtMB = file.size / 1024 / 1024 < 2;
        if (!isLtMB) {
          Message.error(PROMPT('IM.file_limit')||'文件必须小于2M!');
        }
        return isLtMB;
      }
    };
    return (
      <Card
        bodyStyle={{ padding: 0 }}
        className={styles.chat_card}
        title={!this.props.header && this.getChatUser()}
        {...this.props.header}
      >
        <Spin spinning={this.props.loading}>
          <div className={styles.card_body}>
            <div className={styles.chat_history}>
              {records.length > 0 ? (
                <AList
                  size="large"
                >
                  <InfiniteLoader
                    isRowLoaded={index => !!records[index]}
                    rowCount={records.length}
                    loadMoreRows={this.handleLoadMoreRows}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <AutoSizer disableHeight>
                        {({ width }) => (
                          <List
                            onRowsRendered={onRowsRendered}
                            ref={vlist => {
                              this.vlist = vlist
                              registerChild(vlist)
                            }}
                            deferredMeasurementCache={this.cache}
                            rowHeight={this.cache.rowHeight}
                            height={390}
                            width={width}
                            rowRenderer={this.renderMessage}
                            rowCount={records.length}
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
                onChange={this.handleChangeMsg}
                rows={4}
                placeholder={this.props.im.room_id ? (PROMPT('IM.enter_btn')||'请按回车键发送消息') : (PROMPT('IM.into_room')||'进入房间中...')}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>
        </Spin>
        <Modal style={{width: 'auto'}} visible={!!maxImg} footer={null} onCancel={() => this.setState({ maxImg: false })}>
          <div className={styles.maxImg}>{maxImg && <img src={maxImg} alt="img" />}</div>
        </Modal>
      </Card>
    );
  }
}
