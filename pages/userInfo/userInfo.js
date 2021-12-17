import { getUser } from '../../utils/auth';
Page({
  data: {
    info: {}
  },
  onLoad(){
    this.setData({ info: getUser()})
  }
})