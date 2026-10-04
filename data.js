/* ===== 数据层：分类定义与模拟商品数据 =====
   本项目为课程练手演示，商品与统计均为模拟数据 */

const CATEGORIES = [
  { id: 'textbook', name: '教材教辅', color: '#4A7BC5', img: 'assets/img/item-01.jpg' },
  { id: 'digital',  name: '数码电子', color: '#2E9E9B', img: 'assets/img/item-03.jpg' },
  { id: 'daily',    name: '生活用品', color: '#E8934A', img: 'assets/img/item-05.jpg' },
  { id: 'sports',   name: '运动户外', color: '#5B9B52', img: 'assets/img/item-07.jpg' },
  { id: 'clothes',  name: '衣物包包', color: '#D96E8B', img: 'assets/img/item-09.jpg' },
  { id: 'other',    name: '其他闲置', color: '#8A7FA3', img: 'assets/img/item-04.jpg' }
];

const MOCK_ITEMS = [
  {
    id: 1, title: '高等数学 上册（第七版）', price: 15,
    category: 'textbook', condition: '八成新',
    desc: '大一高数课本，笔记不多，书页整洁，期末考完用不上啦。\n适合刚入学的学弟学妹，配合课堂使用刚刚好。',
    seller: '小林', dorm: '3栋407', time: '3天前', views: 86,
    img: 'assets/img/item-01.jpg'
  },
  {
    id: 2, title: 'C语言程序设计 教材', price: 18,
    category: 'textbook', condition: '九成新',
    desc: '大二课程用书，九成新，内页干净，附课后习题参考答案。\n代码入门必备，几乎没怎么写画。',
    seller: '阿哲', dorm: '7栋215', time: '5天前', views: 64,
    img: 'assets/img/item-02.jpg'
  },
  {
    id: 3, title: '白色无线蓝牙耳机', price: 45,
    category: 'digital', condition: '九成新',
    desc: '用了半年，续航依旧很好，音质清晰。\n充电盒外壳有一点小划痕，不影响使用，附原装充电线。',
    seller: '小雨', dorm: '2栋318', time: '1天前', views: 132,
    img: 'assets/img/item-03.jpg'
  },
  {
    id: 4, title: '10000mAh 便携充电宝', price: 29,
    category: 'digital', condition: '八成新',
    desc: '磨砂质感不沾指纹，容量大，一天一充够用。\n双口输出，附一根白色数据线，宿舍自习神器。',
    seller: '小唐', dorm: '5栋602', time: '2天前', views: 71,
    img: 'assets/img/item-04.jpg'
  },
  {
    id: 5, title: 'LED 护眼台灯', price: 25,
    category: 'daily', condition: '九成新',
    desc: '光线柔和不刺眼，三档亮度可调，灯臂可以弯曲。\n宿舍桌面必备，毕业带不走，低价出。',
    seller: '阿乐', dorm: '4栋501', time: '4天前', views: 58,
    img: 'assets/img/item-05.jpg'
  },
  {
    id: 6, title: '磨砂白色保温杯', price: 12,
    category: 'daily', condition: '八成新',
    desc: '保温效果好，杯盖弹扣单手可开。\n换了新杯子，这个出给需要的同学。',
    seller: '圆圆', dorm: '8栋303', time: '6天前', views: 43,
    img: 'assets/img/item-06.jpg'
  },
  {
    id: 7, title: '标准七号篮球', price: 35,
    category: 'sports', condition: '八成新',
    desc: '室外场常客，手感很好，球面无破损。\n毕业离校带不走，出给喜欢打球的同学。',
    seller: '大鹏', dorm: '3栋106', time: '昨天', views: 95,
    img: 'assets/img/item-07.jpg'
  },
  {
    id: 8, title: '羽毛球拍（一对）', price: 40,
    category: 'sports', condition: '九成新',
    desc: '碳素材质，拍线紧实，附一筒羽毛球。\n和室友组队打球用，毕业后闲置了。',
    seller: '小颖', dorm: '6栋208', time: '3天前', views: 52,
    img: 'assets/img/item-08.jpg'
  },
  {
    id: 9, title: '浅灰纯色圆领卫衣', price: 22,
    category: 'clothes', condition: '九成新',
    desc: '穿过几次，干净无起球，均码偏宽松。\n秋冬宿舍保暖好搭，需要可小刀。',
    seller: '瑶瑶', dorm: '9栋415', time: '今天', views: 39,
    img: 'assets/img/item-09.jpg'
  },
  {
    id: 10, title: '藏蓝色双肩背包', price: 30,
    category: 'clothes', condition: '八成新',
    desc: '上课通勤容量够用，内衬干净，拉链顺滑。\n前置口袋放充电宝雨伞都方便，可小刀。',
    seller: '小凯', dorm: '2栋111', time: '2天前', views: 47,
    img: 'assets/img/item-10.jpg'
  }
];
