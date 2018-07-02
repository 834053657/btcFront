import React, { Component } from 'react';
import DescriptionList from 'components/DescriptionList';
import { map } from 'lodash';
import styles from './VideoAuthForm.less';

const { Description } = DescriptionList;

export default class VideoAuthForm extends Component {
  static defaultProps = {};
  static propTypes = {};
  state = {};

  render() {
    return (
      <div className={styles.main}>
        <DescriptionList
          className={styles.headerList}
          title="请主动联系客服,进行视频认证"
          size="large"
          col="1"
        >
          {map(CONFIG.videoAuthConcat, (item, index) => (
            <Description key={index} term={item.text}>
              {item.account}
            </Description>
          ))}
        </DescriptionList>
      </div>
    );
  }
}
