import React, { Component } from 'react';

import { Modal, Input, Button, Icon, Upload, message } from 'antd';
import styles from './picWithText.less';
import UploadComponent from './MarketBuy/Upload';

export default class PicWithText extends Component {
  state = {};

  render() {
    const { item, index, changeFileData, addCDKBox, delCDKBox, changePTPass } = this.props;
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
    console.log(item);
    return (
      <div className={styles.denomination}>
        <header>
          <span>{item.money}</span>
          面额 （{item.items.length}）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <ul>
              {item.items && item.items.length
                ? item.items.map((d, i) => {
                    return (
                      <li key={i}>
                        <div className={styles.cardTop}>
                          <span className={styles.title}>卡密：</span>
                          <div className={styles.input}>
                            <Input
                              value={d.password}
                              onChange={e => changePTPass(e, i, index)}
                              type="text"
                            />
                          </div>
                          <Icon
                            className={styles.iconDel}
                            type="minus-circle-o"
                            onClick={() => {
                              delCDKBox(item.money, i);
                            }}
                          />
                        </div>
                        <div className={styles.cardBottom}>
                          <span className={styles.title}>卡图：</span>
                          <UploadComponent
                            picNum={1}
                            changeFileData={changeFileData}
                            getUrl={url => this.props.getUrl(url, i)}
                          />
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
            <div className={styles.addBtn}>
              <Button
                onClick={() => {
                  addCDKBox(item.money);
                }}
                className={styles.uploadButton}
              >
                添加
              </Button>
            </div>
          </div>
          <div className={styles.receipt}>
            <div className={styles.left}>
              <span>收据:</span>
            </div>
            <div className={styles.right}>
              <UploadComponent picNum={1} getUrl={this.props.getReceipt} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
