import React, { Component } from 'react';
import { connect } from 'dva/index';

import { Modal, Input, Button, Icon, Upload, message, Popover } from 'antd';
import styles from '../SellCard.less';

@connect(({ global, card, user }) => ({
  user,
  card,
  global,
}))
export default class UploadComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
    this.previewUrl = 'http://images.91jianke.com/';
  }

  fileChange = info => {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    this.previewUrl = 'http://images.91jianke.com/';
    const file = info.file;
    const id = file.response.hash;
    this.previewUrl += id;
    this.props.getUrl ? this.props.getUrl(this.previewUrl) : null;
    this.props.onlyPic ? this.props.onlyPic(this.previewUrl) : null;
    //this.props.appealPic ? this.props.appealPic(info, upload.prefix) : null;
    this.props.sendPic ? this.props.sendPic(info, this.previewUrl) : null;
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'global/fetchConfigs',
    });
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  uploadHandler = info => {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    this.props.changeAppealPic && this.props.changeAppealPic(info, upload.prefix);
    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
    } else if (info.file.status === 'done') {
      this.fileChange(info);
    } else if (info.file.status === 'error') {
      this.setState({ uploadLoading: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
    this.setState({
      fileList: info.fileList,
    });
  };

  beforeUpload = file => {
    console.log(file);
  };

  render() {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    const { item, index } = this.props;
    const { picNum } = this.props;
    const self = this;

    return (
      <div className={styles.upload}>
        <div className={styles.right}>
          <div className={styles.addBtn}>
            <Upload
              name="file"
              accept="image/*"
              listType="picture-card"
              beforeUpload={this.beforeUpload}
              fileList={this.state.fileList}
              onPreview={self.handlePreview}
              action={upload.domain}
              onChange={this.uploadHandler}
              data={{ token: upload.token }}
              multiple={this.props.multiple ? this.props.multiple : false}
            >
              {this.state.fileList.length < picNum ? (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传</div>
                </div>
              ) : null}
            </Upload>
            <Modal visible={self.state.previewVisible} footer={null} onCancel={self.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={self.state.previewImage} />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
