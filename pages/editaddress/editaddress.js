import { Promise } from '../../utils/util';
// 使用腾讯地图API
const API = 'https://apis.map.qq.com/ws/district/v1/getchildren?key=MNZBZ-PJSW4-35BUY-DDZGQ-MEH77-FFF65';
var addressArr,editIndex;
Page({
    data: {
        username : '',
        userPhone: '',
        userAddress : '',
        isNewAdd : true, // 是否新增
        hiddenToast: true,
        //地区选择
        isShowRegion: false,
        provinceData: [],
        cityData: [],
        areaData: [],
        region: [14, 0, 0],
        regionName: ''
    },
    onLoad: function (options) {
        //console.log(options,'options');
        var _this = this;
        addressArr = getStorageAddress()? getStorageAddress():[];
        console.log(addressArr, 'addressArr')
        if(options.edit){
            addressArr.forEach(function(v,index){
                if(v.id == options.edit){
                    editIndex = index;
                    _this.setData({
                        username: v.username,
                        userPhone: v.userPhone,
                        userAddress: v.userAddress,
                        regionName: v.regionName,
                        isNewAdd: false
                    });
                }
            })
        }

        const me = this;
        Promise(wx.request, {
            url: API,
            method: 'GET'
        })
        .then(res => {
            if (+res.statusCode == 200) {
                let provinceList = res.data.result[0];
                me.setData({
                    provinceData: provinceList,
                });

                let firstProvince = provinceList[14]; //默认山东

                return Promise(wx.request, {
                    url: API + '&id=' + firstProvince.id,
                    method: 'GET'
                })
            }
            else {
                me.setData({ provinceData: [] });
            }
        })
        .catch(err => {
            me.setData({ provinceData: [] });
        })
        .then(res => {
            if (+res.statusCode == 200) {
                let cityList = res.data.result[0];
                me.setData({
                    cityData: cityList
                });

                let firstCity = cityList[0];

                return Promise(wx.request, {
                    url: API + '&id=' + firstCity.id,
                    method: 'GET'
                })
            }
            else {
                me.setData({ cityData: [] });
            }
        })
        .catch(err => {
            me.setData({
                cityData: []
            });
        })
        .then(res=>{
            me.setData({
                areaData: res.data.result[0]
            })
        })
    },
    saveInfo: function(e){
        let item = e.target.dataset.item;
        let value = e.detail.value;
        let username = item == 'username'? value : this.data.username;
        let userPhone = item == 'userPhone'? value: this.data.userPhone;
        let userAddress = item == 'userAddress' ? value : this.data.userAddress;
        this.setData({
            username: username,
            userPhone: userPhone,
            userAddress: userAddress
        });
    },
    save: function(){
        let {username, userPhone, userAddress, isNewAdd, regionName} = this.data;
        if (isNewAdd){
            let id = new Date().getTime();
            var json = {
                id: id,
                username: username,
                userPhone: userPhone,
                userAddress: userAddress,
                regionName: regionName,
                isDefault: true
            }
            addressArr.forEach(function(v,i){
                if(v.isDefault){
                    v.isDefault = false;
                }
            })
            addressArr.push(json);
            setStorageAddress(addressArr);
        }else{
            addressArr.forEach(function (v,i) {
                if (v.isDefault) {
                    v.isDefault = false;
                }
            })
            addressArr[editIndex]['username'] = username;
            addressArr[editIndex]['userPhone'] = userPhone;
            addressArr[editIndex]['userAddress'] = userAddress;
            addressArr[editIndex]['regionName'] = regionName;
            addressArr[editIndex]['isDefault'] = true;
            setStorageAddress(addressArr);
        }
        wx.navigateBack({
            delta: 2
        });
    },
    del: function () {
        addressArr.splice(editIndex,1); 
        if (addressArr.length > 0){
            var flag = false;
            addressArr.forEach(function(v){
                if(v.isDefault){
                    flag = true;
                    return;
                }
            });
            if (!flag){
                addressArr[0]['isDefault'] = true;
            }
        } 
        setStorageAddress(addressArr); 
        wx.navigateBack({
            delta: 1
        });    
    },
    showToast: function (str) {
        var _this = this;
        var timer;
        if (this.data.hiddenToast) {
            this.setData({
                hiddenToast: false,
                toast: str
            });
            clearTimeout(timer);
            timer = setTimeout(function () {
                clearTimeout(timer);
                _this.setData({
                    hiddenToast: true,
                    toast: ''
                });
            }, 3000);
        }
    },

    selectAddress: function(){
        this.setData({
            isShowRegion : true,
        })
    },
    tapMasker: function () {
        this.setData({ isShowRegion: false });
    },
    preventMaskerMove: function (e) {
        e.preventDefault();
    },
    toggleShowRegion: function (e) {
        this.setData({ isShowRegion: true });
    },
    cancelRegion: function (e) {
        this.setData({ isShowRegion: false });
    },
    confirmRegion: function (e) {
        let val = e.detail.value;
        let {region, provinceData, cityData,areaData} = this.data;
        //console.log(region,'region')
        let regionName = provinceData[region[0]].name + '省 ' + cityData[region[1]].name + '市 ' + areaData[region[2]].fullname;

        this.setData({
            regionName: regionName,
            isShowRegion: false
        });
    },
    bindRegionChange: function (e) {
        let me = this;
        let val = e.detail.value;
        let provinceIndex = val[0];
        let cityIndex = val[1];
        let areaIndex = val[2];
        let {provinceData,region} = me.data;
       
        Promise(wx.request, {
            url: API + '&id=' + provinceData[provinceIndex].id,
            method: 'GET'
        })
        .then(res => {
            if (+res.statusCode == 200) {
                let cityList = res.data.result[0];
                region[0] = provinceIndex
                me.setData({
                    cityData: cityList,
                    region: region
                });
    
                let firstCity = cityList[cityIndex];
                region[1] = cityIndex;
                return Promise(wx.request, {
                    url: API + '&id=' + firstCity.id,
                    method: 'GET'
                })
            }
            else {
                me.setData({ cityData: [] });
            }
        })
        .catch(err => {
            me.setData({
                cityData: []
            });
        })
        .then(res => {
            region[2] = areaIndex;
            me.setData({
                areaData: res.data.result[0],
                region: region
            })
        })
    }
});

function setStorageAddress(addressArr){
    try{
        wx.setStorageSync('addressArr', addressArr);
    }catch(e){
        console.log(e);
    }
}
function getStorageAddress(){
    try {
       return wx.getStorageSync('addressArr');
    } catch (e) {
        console.log(e);
    }
}