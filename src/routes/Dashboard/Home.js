import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import moment from 'moment';
// import TextTruncate from 'react-text-truncate';
import { Row, Col, Icon, Tooltip } from 'antd';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Home.less';
import HomeIcon from '../../../public/home_icon.png';

const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }}
  /> /* eslint-disable-line react/no-danger */
);

@connect(({ global, chart, loading }) => ({
  chart,
  statistics: global.statistics,
  banners: global.banners,
  //loading: loading.effects['chart/fetch'],
  loading: loading.models.global,
}))
export default class Analysis extends Component {
  state = {
    settings: {
      dots: true,
      //fade: true,
      infinite: true,
      speed: 500,
      //autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'global/fetchStatistics',
    });
    this.props.dispatch({
      type: 'global/fetchBanners',
    });
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'chart/clear',
    // });
  }

  getContent = v => {
    if (v.content.length > 350)
      return (
        <span>
          {`${v.content.substr(0, 350)}... `}
          <a href={v.link} target="_blank">
            更多
          </a>
        </span>
      );
    else return <span>{v.content}</span>;
  };

  render() {
    const { settings } = this.state;
    const { statistics, banners } = this.props;

    const bannersContent = [];
    if (banners && banners.length > 0) {
      map(banners, (item, key) => {
        bannersContent.push(
          <div key={key}>
            <div className={styles.banner_items}>
              <a href={item.link} target="_blank">
                <img className={styles.img} src={item.image_url} alt="" />
              </a>
              <Row className={styles.content}>
                <Col span={16}>
                  <div className={styles.content_title}>
                    <a href={item.link} target="_blank">
                      {item.title}
                    </a>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.content_date}>
                    <Icon type="calendar" className={styles.calendar_icon} />{' '}
                    {item &&
                      moment(new Date(parseInt(item.created_at) * 1000)).format('YYYY-MM-DD')}
                  </div>
                </Col>
                <Col span={24}>
                  <div className={styles.desc}>
                    {/* <TextTruncate
                      line={13}
                      truncateText="…"
                      text={item.content}
                      className=""
                      textTruncateChild={
                        <a href={item.link} target="_blank">
                          更多
                        </a>
                      }
                    /> */}
                  </div>
                  <div className={styles.desc}>{this.getContent(item)}</div>
                </Col>
              </Row>
            </div>
          </div>
        );
      });
    }

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };
    return (
      <Fragment>
        <Row gutter={24}>
          <Col span={12} className={styles.title}>
            最新资讯
          </Col>
          <Col span={12} className={styles.more}>
            <a className={styles.itunes_btn} href="/#/message/info-list">
              更多
            </a>
          </Col>
        </Row>
        {/* <button
          onClick={() => {
            this.props.dispatch({
              type: 'push_system_message',
              payload: {
                abc: 123,
              },
            });
          }}
        >
          测试推送消息
        </button> */}
        <div className={styles.banner}>
          <Slider {...settings}>{bannersContent}</Slider>
        </div>
        <div className={styles.realtime_header}>
          <span span={12} className={styles.title}>
            实时成交
          </span>
          <Icon className={styles.realtime_icon} type="bar-chart" />
        </div>
        <Row className={styles.realtime_content} gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered
              title="Itunes"
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title="Itunes销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.itunes}</Yuan>}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="礼品卡"
              avatar={<img alt="#" src={HomeIcon} className={styles.home_icon} />}
              action={
                <Tooltip title="礼品卡销售额">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={() => <Yuan>{statistics.gift_card}</Yuan>}
              contentHeight={46}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
