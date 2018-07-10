import React, { Component } from 'react';
import { InputNumber } from 'antd';
import cx from 'classnames';
import styles from './index.less';

export default class MyInputNumber extends Component {
  render() {
    const { style, className, size, addonAfter, value, onChange, ...ret } = this.props;
    return (
      <div className={cx(styles.inputnumber, className)} style={style}>
        <InputNumber
          {...ret}
          size={size}
          value={value}
          onChange={onChange}
          className={null}
          style={null}
        />
        {addonAfter && (
          <span className={cx(styles.after, size === 'large' ? styles.after_lg : '')}>
            {addonAfter}
          </span>
        )}
      </div>
    );
  }
}
