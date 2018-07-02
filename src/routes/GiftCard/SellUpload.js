import React, { Component } from 'react';
import { connect } from 'dva/index';

import { Modal, Input, Button, Icon, Upload, message } from 'antd';
import styles from './picWithText.less';

@connect(({ card }) => ({
  card,
}))
export default class SellUpload extends Component {
  token = 'PUT-YOUR-TOKEN-HERE';
  state = {
    previewImage: '',
    previewVisible: false,
  };

  //upload
  getToken = () => {
    return this.props.dispatch({
      type: 'card/getToken',
      payload: { bucket: 'images' },
    });
  };

  handlePreview = file => {
    this.setState({
      ptFileList: [],
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleChange = ({ fileList }, index) => {
    this.setState({
      ptFileList: fileList,
    });
  };

  render() {
    const { ptFileList } = this.state;
    const { changeFileData } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className={styles.imgBox}>
        <Upload
          action="http://up-z2.qiniu.com"
          listType="picture-card"
          fileList={ptFileList}
          data={() => {
            console.log(this.token);
            return {
              token:
                'eyJkZWFkbGluZSI6MTUyODQzMzYxNywic2NvcGUiOiJpbWFnZTpkNmY2M2ExMmVhYmI0ZDI2ODkwYmM5MDQ3N2RlOTAwOSJ9:',
            };
          }}
          onPreview={this.handlePreview}
          beforeUpload={async () => {
            const res = await this.getToken();
            if (res.code === 0) {
              this.token = res.data.token;
            } else {
              message.error(res.msg);
            }
          }}
          onChange={({ fileList }) => {
            this.handleChange({ fileList });
            changeFileData({ fileList });
          }}
        >
          {ptFileList && ptFileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
