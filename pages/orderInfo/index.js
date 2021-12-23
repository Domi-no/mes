import {
  queryOrderInfo,
  editExpend,
  changeShifts,
  confirmProductOrder,
  confirmQualityOrder,
  queryQualityOrder,
  qualityHandler,
  putInStorage,
  productionEnd
} from '../../api/order';
import { getUser } from '../../utils/auth';
Page({
  data: {
    oid: '',
    isProductor: false, // 默认当前账号不是生产人员
    orderinfo: {}, // 订单详情
    steps: [], //工序步骤
    currentStepIdx: 1, // 当前工序步骤索引值
    isShowExpend: false, // 是否显示领取/换回耗材弹窗
    expendType: '', // 1 领取； 2 还回
    expendId: '', // 当前耗材id
    expendNum: '', // 领取、换回耗材数量
    completeNum: '', // 完成数量
    goodNum: '', // 良品数量
    badNum: '', // 次品数量
    consumes: [], // 耗材查验
    productors: [], // 质检时查询生产人员信息
    pNames: '', // 质检时查询生产人员姓名
    isShowQuality: false, //是否显示质检信息弹窗
    isShowConsume: false, //是否显示耗材查验弹窗
    isShowStorage: false, //是否显示入库弹窗
    scannerRes: {modify:false}, // 扫码进入数据结果
    isPutInStorage: false, //订单底栏确认按钮文字是否显示“入库”
    hasConsumes: true, // 当前订单是否有生成耗材
    waitQuliators: '' ,// 待质检人员姓名
    isScanCode:false,//是否扫码
    completeClick:false,//确认完成是否点击
    productionClick:false,//是否生产结束
  },
  async onLoad(options){
    const { oid, scanner } = options;
    this.setData({
      isScanCode:scanner ? true : false,
      isProductor: getUser().roleName === '生产人员',
      oid,
      scannerRes: scanner ? JSON.parse(scanner) : {}
    });
    console.log(this.data.isScanCode)
    await this._queryOrderInfo();
  },
  // 获取订单详情
  async _queryOrderInfo(pid){
    const { isProductor,oid } = this.data;
    const { data } = await queryOrderInfo(oid,pid);
    const { currentProcessId, productionStatus} = data.baseInfo;
    const { processList, consumeList, pending ,productionInfo } = data;
    // 当前工序步骤索引值
    const currentStepIdx = processList.findIndex(p => p.processId === currentProcessId);
    
    const steps = processList.map( p => ({ text: p.processName,pid:p.processId }));
    steps.push({text: '结束'});
    // 根据工序步骤最后一步,判断当前质检订单，是需要下一步还是直接入库
    const lastProcessId = processList[processList.length - 1].processId;
    const isPutInStorage = !isProductor && (currentProcessId === lastProcessId);
    console.log('orderinfo');
    this.setData({
      orderinfo: data,
      steps,
      isPutInStorage,
      hasConsumes: consumeList && consumeList.length !== 0,
      waitQuliators: pending?.qualityInfo.map( item => item.productionName ).join(','),
      scannerRes : {modify:getUser().roleId === data.baseInfo.currentProcessId}
    });
    // 防止步骤条点击进度被覆盖
    pid ? '' :this.setData({
      currentStepIdx: productionStatus != '5' ? currentStepIdx : steps.length - 1,
    })
    productionStatus == 5 ? this.setData({ productionClick:true }):this.setData({ productionClick:false });
    productionInfo.status == 1 ? this.setData({ completeClick:true}):this.setData({ completeClick:false});
  },
  // 交接班
  async handleShiftOver(){
    await changeShifts(this.data.oid);
    wx.showToast({title: '操作完成',icon: 'success'});
    this.closeProduction();
    setTimeout(() => {
      wx.navigateBack();
    }, 750);
  },
  // 质检
  async clickQuality(){
    // 获取质检信息
    const data = this.data.orderinfo.pending ? this.data.orderinfo.pending.qualityInfo:'';
    if(!data.length){
      return wx.showModal({
        title: '温馨提示',
        content: '当前订单已经完成质检入库操作，请勿重复操作',
        showCancel: false,
        success: () => {}
      });
    } 
    
    this.setData({
      productors: data,
      goodNum: '',
      badNum: '',
      isShowQuality: !this.data.isShowQuality
    });
    console.log(data);
  },
  closeQuality(){
    this.setData({ isShowQuality: !this.data.isShowQuality });
  },
  // 质检下一步：耗材查验
  nextToConsume(){
    /**
     * 判断当前订单是否有生成耗材
     * 1. 如果有，进行下一步：耗材查验
     * 2. 否则，直接提交入库
     */
    if(this.data.hasConsumes){
      const { consumeList } = this.data.orderinfo;
      const consumes = consumeList.map( item => {
        const { proSortName, plannedNumber, actualNumber, proId, proPicture } = item;
        return {
          proPicture,
          proSortName,
          plannedNumber,
          actualNumber,
          accId: '', // 生产人员编号
          proId, // 耗材编号
          actual: '' // 实际消耗数量
        }
      });
      this.setData({
        isShowConsume: !this.data.isShowConsume,
        consumes
      });
    } else {
      this.submitQuality();
    }
    
    // wx.showToast({ title: '操作成功', icon: 'success'});
    this.setData({
      isShowQuality: !this.data.isShowQuality
    })
    
  },
  closeConsume(){
    this.setData({ isShowConsume: !this.data.isShowConsume });
  },
  // 耗材查验下一步：入库
  nextToStorage(){
    const { consumes } = this.data;
    for(let i = 0; i < consumes.length; i++ ){
      if(consumes[i].actual === ''){
        return wx.showToast({title: '请输入实际耗材数量',icon: 'none'});
      }
    }
    this.setData({
      isShowQuality: !this.data.isShowQuality,
      isShowConsume: !this.data.isShowConsume,
      isShowStorage: !this.data.isShowStorage
    });
  },
  closeStorage(){
    this.setData({ isShowStorage: !this.data.isShowStorage });
  },
  // 入库下一步：提交质检
  async submitQuality(){
    const { productionOrderId, currentProcessId } = this.data.orderinfo.baseInfo;
    const { consumes, goodNum, badNum, isShowStorage } = this.data;
    const consumeList = consumes.map( item => {
      const { accId, proId, actual } = item;
      return { accId, proId, actual }
    });
    const doc = {
      productionOrderId,
      currentProcessId,
      qualified: goodNum,
      unqualified: badNum,
      consumeList
    }
    await qualityHandler(doc);
    wx.showToast({ title: '操作成功', icon: 'success' });
    this._queryOrderInfo()
    // this.setData({ isShowStorage: !isShowStorage });
    // setTimeout(() => {
    //   wx.navigateBack();
    // }, 750);
  },
  // 确认生产，质检订单完成
  async submitComplete(){
    const { completeNum, isProductor, isPutInStorage  } = this.data;
    const { productionOrderId, currentProcessId } = this.data.orderinfo.baseInfo;
    const { qualified, unqualified } = this.data.orderinfo.productionInfo;
    if(isProductor){ //生成订单
      if(!completeNum){
        return wx.showToast({title: '请输入完成数量', icon: 'none'});
      }
      const doc = {
        productionOrderId,
        currentProcessId,
        number: completeNum
      }
      await confirmProductOrder(doc);
      wx.showToast({ title: '操作成功', icon: 'success'});
      this.setData({ completeClick:true });
      this.closeProduction();
    } else { // 质检订单
      // 根据isPutInStorage再进一步判断是需要进行下一步，还是直接入库
      let title, content = '';
      if(isPutInStorage){
        title = '入库信息';
        content = `良品数量：${qualified}\r\n次品数量：${unqualified}`;
      } else {
        title = '是否确认完成';
        content = '确认完成后工序自动进入下一步';
      }
      wx.showModal({
        title,
        content,
        confirmColor: '#075FFF',
        success: async (action) => {
          if(action.confirm){
            isPutInStorage
              ? 
                await putInStorage(productionOrderId,currentProcessId)
              :
                await confirmQualityOrder({ productionOrderId, currentProcessId });
                
            wx.showToast({ title: '操作成功', icon: 'success'});
            isPutInStorage ? '': this.setData({ completeClick:true });
          }
        }
      });
    }
    // setTimeout(() => {
    //   wx.reLaunch({ url: '/pages/index/index' })
    // }, 750);
  },
  // 领取还回耗材
  showExpend(e){
    const { key, eid } = e.currentTarget.dataset;
    // 1 领取，2 还回
    this.setData({
      expendType: key,
      expendId: eid,
      expendNum: '',
      isShowExpend: true
    })
  },
  closeExpend(){
    this.setData({ isShowExpend: false});
  },
  async submitExpend(){
    const {currentProcessId, productionOrderId } = this.data.orderinfo.baseInfo;
    const {
      expendId: proId,
      expendNum: number,
      expendType: type
    } = this.data;
    const doc = {
      productionOrderId,
      currentProcessId,
      proId,
      number,
      type
    }
    await editExpend(doc);
    wx.showToast({ title: '操作成功', icon: 'success'});
    this.setData({ isShowExpend: false});
    setTimeout(() => {
      wx.navigateBack();
    }, 750);
  },
  // 关闭扫码进入弹窗
  closeProduction(){
    const pkey = `scannerRes.popup`;
    this.setData({ [pkey]: false});
  },
  // 输入框双向绑定
  handleInputChange(e){
    const filed = e.currentTarget.dataset.filed;
    const value = e.detail.value;
    this.setData({ [filed]: value })
  },
  // 输入实际消耗数量
  inputConsume(e){
    const { cidx, pidx } = e.currentTarget.dataset;
    const { productors } = this.data;
    const rowAccId = `consumes[${cidx}].accId`;
    const rowActual = `consumes[${cidx}].actual`;
    this.setData({
      [rowAccId]: productors[pidx].production,
      [rowActual]: e.detail.value,
    });
  },
  //成品入库按钮点击
  clickWarehousing(e){
    this.setData({ isPutInStorage: true });
    this.submitComplete()
  },
  //确认完成按钮点击
  clickConfirmCompletion(e){
    if(this.data.completeClick){
      return false
    }
    this.setData({ isPutInStorage: false });
    console.log(this.data.completeClick);
    this.submitComplete()
  },
  //生产结束按钮点击
  async clickProductionEnd(){
    if(this.data.productionClick){
      return false
    }
    const {productionOrderId } = this.data.orderinfo.baseInfo;
    await productionEnd(productionOrderId)
    wx.showToast({ title: '操作成功', icon: 'success'});
    this.setData({
      productionClick:true
    })
    // setTimeout(() => {
    //   wx.navigateBack();
    // }, 750);
  },
  // 步骤条点击
  clickStep({detail}){
    const { steps,currentStepIdx,orderinfo:{baseInfo:{productionStatus}} } = this.data
    detail >= steps.length-1 && productionStatus !=5 ? '' : this.setData({currentStepIdx:detail});
    detail >= steps.length-1 && productionStatus !=5 ? '':this._queryOrderInfo(steps[detail].pid)
  }
})