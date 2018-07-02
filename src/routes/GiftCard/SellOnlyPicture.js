import React, { Component } from 'react';
import { Modal, Input, Button, Icon, Upload, message, Popover } from 'antd';
import UploadComponent from './MarketBuy/Upload';

export default class OnlyPicture extends Component {
  constructor(props) {
    super();
    this.state = {
      fileList: [],
    };
  }

  renderItem = (item, key) => {
    const { styles, getToken } = this.props;
    const imgContent = (
      <div className={styles.contentBox}>
        <img width="85%" src={item.src} alt="" />
      </div>
    );

    return (
      <div key={key} className={styles.imgBox}>
        <Popover placement="topLeft" content={imgContent} title="详情" trigger="click">
          <img width="85%" src={item.src} alt="" />
        </Popover>
        <Icon className={styles.iconDel} type="minus-circle-o" />
      </div>
    );
  };

  changeAppealPic = (info, prefix) => {
    this.props.changeAppealPic(info, prefix);
    // console.log(info);
    // this.setState({
    //   fileList: info.fileList
    // })
  };

  render() {
    const { item, styles, index, changeFileData } = this.props;
    const { fileList = [] } = this.state;
    return (
      <div className={styles.denomination}>
        <header>
          <span>{item.money}</span>
          面额 （{item.items.length}）
        </header>
        <section className={styles.onlyPic}>
          <div className={styles.left}>
            <span>卡图：</span>
          </div>
          <div className={styles.picsbox}>
            <div className={styles.uploadBoxInSendPic}>
              <UploadComponent
                picNum={1000}
                multiple
                changeAppealPic={this.changeAppealPic}
                //onlyPic={info => this.props.onlyPic(info)}
                remove={info => this.props.remove(info)}
              />
            </div>
          </div>
          <div className={styles.receipt}>
            <div className={styles.left}>
              <span>收据:</span>
            </div>
            <div className={styles.right}>
              <div className={styles.addBtn}>
                <UploadComponent
                  picNum={1}
                  changeFileData={changeFileData}
                  getUrl={this.props.getReceipt}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
