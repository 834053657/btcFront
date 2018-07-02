import React, { Component } from 'react';

import { Modal, Input, Button, Icon, Upload, message } from 'antd';
import styles from './OnlyPic.less';
import UploadComponent from '../../MarketBuy/Upload';

export default class SendPicWithText extends Component {
  constructor(props) {
    super();
    this.state = {
      iptValue: props.renderInput,
    };
  }

  changeValue = (e, i) => {
    const a = this.state.iptValue;
    a[i].password = e.target.value;
    this.setState({
      iptValue: a,
    });
  };

  render() {
    const { item, index, changePTPass } = this.props;
    const { ptFileList } = this.state;

    const state = {
      previewVisible: false,
      previewImage: '',
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className={styles.denominationPWT}>
        <header>
          <span>{item.money || '-'}</span>
          面额 （{item.count || '-'}）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <ul>
              {this.props.renderInput &&
                this.props.renderInput.map((d, i) => {
                  return (
                    <li className={styles.leftSquare} key={i}>
                      <div className={styles.cardTop}>
                        <span className={styles.title}>卡密：</span>
                        <div className={styles.input}>
                          <Input
                            value={this.state.iptValue[i].password}
                            onChange={e => {
                              changePTPass(e, i);
                              this.changeValue(e, i);
                            }}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className={styles.cardBottom}>
                        <span className={styles.title}>卡图：</span>
                        <UploadComponent
                          picNum={1}
                          sendPic={(info, url) => this.props.sendPicWithText(info, url, i)}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className={styles.receipt}>
            <div className={styles.left}>
              <span>收据:</span>
            </div>
            <div className={styles.right}>
              <UploadComponent
                picNum={1}
                sendPic={(info, url) => this.props.sendRecWithText(info, url)}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
