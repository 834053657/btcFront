import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Popover,
  Progress,
  message,
  Checkbox,
  Modal,
} from 'antd';
import ImageValidation from 'components/ImageValidation';
import styles from './Register.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
  noPass: <div className={styles.error}>强度：不安全</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
  noPass: 'exception',
};

const infoMsg = {
  terms: {
    title: '服务条款',
    content:
      '请仔细阅读这些服务条款，通过点击“创建帐户”按钮或通过访问或使用本服务，您同意遵守本条款及所有附加条款。如果您不同意受本条款的约束，请勿访问本网站或使用本服务。\n' +
      '\n' +
      'utomarket保留随时更改或修改本条款中所含内容的权利，包括但不限于本网站的任何政策或准则。我们会将修改后的条款发布到本网站，并将“最后修订”日期列在本条款顶部，或通过电子邮件发送给用户提供的注册邮箱，或以utomarket确定的任何其他方式自行决定。任何更改会在发布网站更新后或声明更改后立即生效。您有放弃接收有关此类更改的特定通知的权力，如您继续使用本网站表示您接受此类更改。如果您不同意本条款，请立即停止使用本网站。我们希望您经常回顾本条款，以确保您了解适用于您访问和使用本服务的条款和条件。如果您在使用本网站中有任何疑问，请联系客服\n' +
      '\n' +
      '一. 本服务仅适用于18岁或以上的用户。通过访问或使用我们的服务，您声明并确保您至少年满18岁，没有被剥夺过适用本服务的权利。您也保证您不在任何贸易或经济制裁清单中，如联合国安理会制裁清单，也不受香港金融管理局、香港海关等香港行政执法机构限制或禁止适用任何交易平台。此外，utomarket对所在国家法律禁止交易比特币的国家或地区提供部分或不提供本服务，其中包括中国香港，古巴、伊朗、朝鲜、克里米亚、苏丹、马来西亚、叙利亚、美国[包括所有美国领土，如波多黎各、美属萨摩亚、关岛、北马里亚纳群岛邦、美属维尔京群岛（圣克罗伊岛，圣约翰岛和圣托马斯岛）]、孟加拉国、玻利维亚、厄瓜多尔和吉尔吉斯斯坦。本协议内容不受用户所属国家或地区法律的排斥。因此，如果您不符合这些要求，禁止使用本网站。\n' +
      '\n' +
      '二. 我们提供一个仅包含数字资产的在线点对点交易平台，用于交易数字资产（或称为加密代币或数字代币或加密货币）的交易。交易者在我们的平台上进行交易; utomarket作为平台提供商不参与实际交易。交易者必须在开始交易之前认证本人真实姓名银行账户。 utomarket不接受法定货币，也不适用法定货币结算，因此我们是一个仅提供数字资产间交易的平台。交易者可以随时要求提取其数字资产，但必须遵守本条款的限制。\n' +
      '\n' +
      '用户理解并同意，utomarket的服务是按照现有技术和条件所能达到的现状提供的。utomarket会尽最大努力向用户提供服务，确保服务的连贯性和安全性；确保每笔交易产生的纠纷可以公平公正的裁判。但utomarket不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。\n' +
      '\n' +
      '\n' +
      '系统平台因下列状况无法正常运作，使用户无法使用各项服务或不能正常委托时，utomarket不承担损害赔偿责任，该状况包括但不限于：\n' +
      '\n' +
      '1．utomarket平台公告之后系统停机维护期间；\n' +
      '\n' +
      '2．电信设备出现故障不能进行数据传输的；\n' +
      '\n' +
      '3．因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成utomarket平台系统障碍不能执行业务的；\n' +
      '\n' +
      '4．由于黑客攻击、计算机病毒侵入或发作、电信部门技术调整或故障、网站升级、银行方面的问题、因政府管制而造成的暂时性关闭等影响网络正常经营的原因而造成的服务中断或者延迟；\n' +
      '\n' +
      '5．因为行业现有技术力量无法预测或无法解决的技术问题而造成的损失；\n' +
      '\n' +
      '6．因第三方的过错或者延误而给用户或者其他第三方造成的损失。\n' +
      '\n' +
      '\n' +
      '由于系统故障，网络原因，DDos等黑客攻击等意外因素可能导致的异常成交，行情中断，以及其他可能的异常情况，utomarket有权根据实际情况取消异常成交结果，以及回滚某一段时间的所有成交。\n' +
      '\n' +
      '\n' +
      '三. utomarket的服务是以收费方式提供的，如用户使用，请遵守相关的协议。utomarket可能根据实际需要对收费服务的收费标准、方式进行修改和变更，utomarket也可能会对部分免费服务开始收费。前述修改、变更或开始收费前，utomarket将在相应服务页面进行通知或公告。如果用户不同意上述修改、变更或付费内容，则应停止使用该服务。\n' +
      '\n' +
      '\n' +
      'utomarket不会向任何用户索取密码，不会让用户往任何非本站交易中心里提供的帐户、BTC钱包地址打款，请大家不要相信任何utomarket打折、优惠等信息，如往非BTC交易中心提供的账户、地址里打款或币所造成的损失本站不负责任。\n' +
      '\n' +
      '\n' +
      '交易异常处理：用户使用本服务时同意并认可，可能由于数字货币网络连线问题或其他不可抗拒因素，造成本服务无法提供。用户确保所输入的您的资料无误，如果因资料错误造成本网站于上述异常状况发生时，无法及时通知用户相关交易后续处理方式的，本网站不承担任何损害赔偿责任。\n' +
      '\n' +
      '\n' +
      '用户同意，基于运行和交易安全的需要，本网站可以暂时停止提供或者限制本服务部分功能, 或提供新的功能，在任何功能减少、增加或者变化时，只要用户仍然使用本服务，表示用户仍然同意本协议或者变更后的协议。\n' +
      '\n' +
      '\n' +
      '本网站有权了解用户使用本网站产品或服务的真实交易背景及目的，用户应如实提供本网站所需的真实、全面、准确的信息；如果本网站有合理理由怀疑用户提供虚假交易信息的，本公司有权暂时或永久限制用户所使用的产品或服务的部分或全部功能。\n' +
      '\n' +
      '\n' +
      '四. 数字资产交易涉及重大风险。交易或持有数字资产很有可能会造成您的损失。因此，您应该根据自己的财务状况，仔细考虑是否要交易数字资产。\n' +
      '\n' +
      '1. 在使用本服务时，若用户或用户的交易指令出现错误（包括价格、数量等因素）而使用户的交易出现损失时，如果非本站交易规则的原因，损失责任将由用户自己承担。\n' +
      '\n' +
      '2. 因用户的过错导致的任何损失由用户自行承担，该过错包括但不限于：不按照交易提示操作，未及时进行交易操作，遗忘或泄漏密码，密码被他人破解，用户使用的计算机被他人侵入，损失责任将由用户自己承担。\n' +
      '\n' +
      '3. 在使用本服务时，若用户因为网站交易规则中潜在的尚未发现的某种漏洞而产生的不当得利，本站将联系用户追回，您必须有效予以配合，否则本站将采取包括但不限于限制账户交易、冻结账户资金、向有管辖权的法院起诉等追索措施，因用户不予有效配合而给utomarket产生的追索费用也将由您承担。\n' +
      '\n' +
      '\n' +
      '五. 为了使用本平台任何服务，您必须首先通过提供您的姓名，电子邮件和密码注册账户，以及确认接受本服务条款。您同意不允许任何人使用、指导您的帐户，并向utomarket更新您的任何信息更改，或者您的帐户是否被盗用。您有责任保留，保护和保障任何已提供给您的密钥，证书，密码，访问代码，用户ID或其他凭据和登录信息（统称为“密码”），或是由您使用服务生成的上述密码。如果您丢失密码，可能无法访问您的帐户。您同意立即通知utomarket任何未经授权使用您密码的事宜。由于未经授权使用您的密码而导致的任何责任，损失或损害，utomarket将不承担任何责任。由于本站是交易网站，登录密码、提现密码、交易密码、短信密码、谷歌密码等不得使用相同密码，否则会有安全隐患，相关责任由用户自身承担。\n' +
      '\n' +
      '用户有权选择是否成为utomarket用户，用户选择成为utomarket注册用户的，可自行创建、修改。用户名的命名及使用应遵守相关法律法规并符合网络道德。用户名和昵称中不能含有任何侮辱、威胁、淫秽、谩骂等侵害他人合法权益的文字。\n' +
      '\n' +
      '用户一旦注册成功，成为utomarket的用户，将得到用户名（用户邮箱）和密码，并对以此组用户名和密码登入系统后所发生的所有活动和事件负责，自行承担一切使用该用户名的言语、行为等而直接或者间接导致的法律责任。\n' +
      '\n' +
      '用户密码遗失的，可以通过注册电子邮箱发送的链接重置密码，以手机号码注册的用户可以凭借手机号码找回原密码。用户若发现任何非法使用用户名或存在其他安全漏洞的情况，应立即告知utomarket。\n' +
      '\n' +
      '\n' +
      '六. 用户不得利用本站危害国家安全、泄露国家秘密，不得侵犯国家社会集体的和公民的合法权益，不得利用本站制作、复制和传播下列信息：\n' +
      '\n' +
      '1. 煽动抗拒、破坏宪法和法律、行政法规实施的；\n' +
      '\n' +
      '2. 煽动颠覆国家政权，推翻社会主义制度的；\n' +
      '\n' +
      '3. 煽动分裂国家、破坏国家统一的；\n' +
      '\n' +
      '4. 煽动民族仇恨、民族歧视，破坏民族团结的；\n' +
      '\n' +
      '5. 捏造或者歪曲事实，散布谣言，扰乱社会秩序的；\n' +
      '\n' +
      '6. 宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；\n' +
      '\n' +
      '7. 公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；\n' +
      '\n' +
      '8. 损害国家机关信誉的；\n' +
      '\n' +
      '9. 其他违反宪法和法律行政法规的；\n' +
      '\n' +
      '10. 进行商业广告行为的。\n' +
      '\n' +
      '11. 禁止使用本网站从事洗钱、走私、商业贿赂等一切非法交易活动，若发现此类事件，本站将冻结账户，立即报送有权机关。\n' +
      '\n' +
      '\n' +
      '如用户违反上述规定，则utomarket有权直接采取一切必要的措施，暂停或查封用户帐号，取消因违规所获利益，乃至通过诉讼形式追究用户法律责任等。\n' +
      '\n' +
      '\n' +
      '禁止用户将utomarket以任何形式作为从事各种非法活动的场所、平台或媒介。未经utomarket的授权或许可，用户不得借用本站的名义从事任何商业活动，也不得以任何形式将utomarket作为从事商业活动的场所、平台或媒介。\n' +
      '\n' +
      '用户在utomarket以各种形式发布的一切信息，均应符合国家法律法规等相关规定及网站相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益，否则用户自行承担因此产生的一切法律后果，且utomarket因此受到的损失，有权向用户追偿。\n' +
      '\n' +
      '\n' +
      '七. 在用户使用本服务时，本公司有权相应规则向用户收取服务费用。utomarket拥有制订及调整服务费之权利，具体服务费用以用户使用本服务时utomarket上所列之收费方式公告或用户与utomarket达成的其他书面协议为准。服务费用详情请查看《费率说明》\n' +
      '\n' +
      '\n' +
      '八. 您个人有责任确定是否以及在多大程度上，向相关税务机关缴纳通过服务进行的任何交易所得收入并扣除正确数额后所对应的税款。使用我们的服务时，您确认您的行为是以合法和正确的方式，您的数字资产并非来源于非法活动。 utomarket可以酌情或与当地执法机关协调以控制、限制或清空您的账户和数字资产。\n' +
      '\n' +
      '\n' +
      '九. 1、utomarket作为“网络服务提供者”的第三方平台，不担保网站平台上的信息及服务能充分满足用户的需求。对于用户在接受utomarket的服务过程中可能遇到的错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，utomarket不承担法律责任。\n' +
      '\n' +
      '\n' +
      '2、基于互联网的特殊性，utomarket也不担保服务不会受中断，对服务的及时性、安全性都不作担保，不承担非因utomarket导致的责任。\n' +
      '\n' +
      '\n' +
      'utomarket力图使用户能对本网站进行安全访问和使用，但utomarket不声明也不保证本网站或其服务器是不含病毒或其它潜在有害因素的；因此用户应使用业界公认的软件查杀任何自utomarket下载文件中的病毒。\n' +
      '\n' +
      '\n' +
      '3、utomarket不对用户所发布信息的保存、修改、删除或储存失败负责。对网站上的非因utomarket故意所导致的排字错误、疏忽等不承担责任。\n' +
      '\n' +
      '\n' +
      'utomarket有权但无义务，改善或更正本网站任何部分之疏漏、错误。\n' +
      '\n' +
      '\n' +
      '4、除非utomarket书面形式明确约定，utomarket对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本网站所获得的任何内容信息，包括但不限于广告等，不保证其准确性、完整性、可靠性；对于用户因本网站上的内容信息而购买、获取的任何产品、服务、信息或资料，utomarket不承担责任。用户自行承担使用本网站信息内容所导致的风险。\n' +
      '\n' +
      '\n' +
      '5、utomarket内所有用户所发表的用户评论，仅代表用户个人观点，并不表示本网站赞同其观点或证实其描述，本网站不承担用户评论引发的任何法律责任。\n' +
      '\n' +
      '\n' +
      '6、utomarket有权删除utomarket内各类不符合法律或协议规定的信息，而保留不通知用户的权利。\n' +
      '\n' +
      '\n' +
      '7、所有发给用户的通告，utomarket都将通过正式的页面公告、站内信、电子邮件、客服电话、手机短信或常规的信件送达。任何非经utomarket正规渠道获得的中奖、优惠等活动或信息，utomarket不承担法律责任。\n' +
      '\n' +
      '\n' +
      '8、utomarket有权根据市场情况调整充值、提现、交易等手续费费率，有权决定免费推广期的终止。\n' +
      '\n' +
      '\n' +
      '十. 这些条款和您对服务的使用将受到***法律的约束和解释，而不诉诸于其冲突法规定。您同意，您根据本条款在法律上或依衡平法追究而不涉及仲裁（如下所述）的行为将仅在***提交，兹此，您不可撤销地和无条件地同意，根据本条款产生的任何诉讼或争议将提交至****法院专属管辖。\n' +
      '\n' +
      '\n' +
      '十一. 如果本协议的任何条款被视为不合法、无效或因任何原因而无法执行，则此等规定应视为可分割，不影响任何其他条款的法律效力。\n' +
      '\n' +
      '\n' +
      '十二. 如果您有任何投诉，反馈或问题，请通过contact@utomarket.com联系我们的客户服务。当您联系我们时，请提供您的姓名和电子邮件地址以及我们可能需要识别您的其他信息，以及您所反馈问题或投诉所涉及的交易信息。\n' +
      '\n' +
      '\n' +
      '十三. 这些条款规定了双方就服务主题的完整理解，取代了与之有关的所有先前的理解和沟通。 任何与本条款所规定的内容不一致的其他文件，将不对utomarket具有约束力。 您声明并保证所有披露给utomarket的与本服务条款有关的信息是真实，准确和完整的。',
  },
  disclaimer: {
    title: '免责申明',
    content: '免责申明',
  },
};

@connect(({ register, loading }) => ({
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    agree: false,
    count: 0,
    confirmDirty: false,
    visible: false,
    imageValidationVisible: false,
    help: '',
    image: '',
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showImageValidationModal = () => {
    this.props.form.validateFieldsAndScroll(['email'], {}, (err, values) => {
      if (!err) {
        this.setState({
          imageValidationVisible: true,
        });
      }
    });
  };

  onGetCaptcha = (err, code, loadCaptcha) => {
    const { form } = this.props;
    const mail = form.getFieldValue('email');
    if (!err) {
      this.props.dispatch({
        type: 'register/sendVerify',
        payload: {
          code,
          data: {
            mail,
          },
          type: 'mail',
          usage: 1,
        },
        callback: res => {
          if (res.code === 0) {
            let count = 59;
            this.setState({ count, imageValidationVisible: false });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          } else {
            loadCaptcha();
            message.error(res.msg);
          }
        },
      });
    }
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (!regex.test(value)) {
      return 'noPass';
    }
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6 || !regex.test(value)) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  loadCaptcha = async () => {
    const params = {
      r: Math.random(),
      usage: 'login',
    };
    const res = await getCaptcha(params);
    if (res.data) {
      this.setState({
        image: res.data.img,
      });
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  changeAgree = e => {
    const value = e.target.checked;

    this.setState({
      agree: value,
    });
  };

  hideModal = () => {
    this.setState({
      infoVisible: false,
    });
  };

  handleShowInfo = type => {
    this.setState({
      infoVisible: infoMsg[type] || false,
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, agree, imageValidationVisible, infoVisible } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<Input size="large" placeholder="邮箱" />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('verify_code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ],
                })(<Input size="large" placeholder="验证码" />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.showImageValidationModal}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
                // {
                //   min: 2,
                //   message: '请输入至少2位字符！',
                // },
                // {
                //   max: 20,
                //   message: '请输入最多20位字符！',
                // },
                {
                  pattern: /^[a-zA-Z0-9_-]{2,20}$/,
                  message: '用户名只能包含 2~20位的字母，数字，下划线，减号',
                },
              ],
            })(<Input size="large" placeholder="用户名 2-20位" />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请输入6 ~ 16 个字母，数字组合字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                  {
                    min: 6,
                    message: '请输入6 ~ 16 位字母，数字组合。！',
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder="6~16位字母数字组合,并区分大小写"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('invite_code', {
              rules: [
                {
                  required: true,
                  message: '请输入邀请码！',
                },
              ],
            })(<Input size="large" placeholder="邀请码" />)}
          </FormItem>

          <FormItem>
            <Checkbox checked={agree} onChange={this.changeAgree}>
              我已阅读并同意
            </Checkbox>
            <a onClick={this.handleShowInfo.bind(this, 'terms')}>《服务条款》</a>{' '}
            <a onClick={this.handleShowInfo.bind(this, 'disclaimer')}>《免责申明》</a>
          </FormItem>

          <FormItem>
            <Button
              size="large"
              disabled={!agree}
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
        <ImageValidation
          title="安全验证"
          onCancel={() => {
            this.setState({ imageValidationVisible: false });
          }}
          onSubmit={this.onGetCaptcha}
          visible={imageValidationVisible}
        />

        {!!infoVisible && (
          <Modal title={infoVisible.title} visible onOk={this.hideModal} onCancel={this.hideModal}>
            <div
              className={styles.info_content}
              dangerouslySetInnerHTML={{ __html: infoVisible.content }}
            />
          </Modal>
        )}
      </div>
    );
  }
}
