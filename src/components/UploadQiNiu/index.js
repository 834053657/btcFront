import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, message, Spin } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { delay, map } from 'lodash';
import { getAuthority } from '../../utils/authority';
import styles from './index.less';

const Dragger = Upload.Dragger;

export default class UploadQiNiu extends Component {
  state = {
    uploading: false,
  };

  static MIME_TYPE = {
    IMAGE: 'image/gif, image/png, image/jpg, image/jpeg, image/bmp',
    VIDEO: 'video/mp4,video/x-m4v,video/*',
  };

  static propTypes = {
    accept: PropTypes.string,
    sizeLimitMB: PropTypes.number,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    accept: UploadQiNiu.MIME_TYPE.IMAGE,
    sizeLimitMB: 5,
    disabled: false,
  };

  getImgUrl = (obj = {}) => {
    const { upload = {} } = getAuthority() || {};

    let url = '';
    if (obj.status === 'done' && obj.url) {
      url = obj.url;
    } else if (obj.status === 'done' && obj.response) {
      url = obj.response.hash;
    }
    return url ? upload.prefix + url : null;
  };

  uploadHandler = info => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true,
      });
    } else if (info.file.status === 'done') {
      const url = this.getImgUrl(info.file);
      this.props.onChange(url);
      this.setState({ uploading: false });
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error(PROMPT('QiNioUpload.upload_error')||'上传错误，可能请求已过期，请刷新页面重试');
    }
  };

  beforeUpload = file => {
    const isLtMB = file.size / 1024 / 1024 < this.props.sizeLimitMB;
    if (!isLtMB) {
      message.error(PROMPT('QiNioUpload.upload_size_limit')||'文件必须小于{size}M!', {size:this.props.sizeLimitMB});
    }
    return isLtMB;
  };

  render() {
    const { value } = this.props;
    const { upload = {} } = getAuthority() || {};

    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={this.state.uploading ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text"><FM id='QiNioUpload.file_to_upload' defaultMessage='单击或拖动文件到此区域进行上传' />
        </p>
      </div>
    );

    return (
      <Spin spinning={this.state.uploading}>
        <Dragger
          name="file"
          disabled={this.props.disabled}
          accept={this.props.accept}
          showUploadList={false}
          multiple={false}
          action={upload.domain}
          onChange={this.uploadHandler}
          beforeUpload={this.beforeUpload}
          data={{ token: upload.token }}
        >
          {value ? (
            <img style={{ maxWidth: '100%', maxHeight: '150px' }} src={value} alt="qrcode" />
          ) : (
            uploadButton
          )}
        </Dragger>
      </Spin>
    );
  }
}
