(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/choose.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96d5aiRUM1CIK0OPfe9frEA', 'choose', __filename);
// script/choose.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        list: {
            default: [],
            type: [cc.Node]
        },
        swiper: {
            default: null,
            type: cc.Node
        },
        btnPrev: {
            default: null,
            type: cc.Node
        },
        btnNext: {
            default: null,
            type: cc.Node
        }
    },

    ctor: function ctor() {
        // 动画时间
        this._duration = .6;
        // 当前索引值
        this._index = 1;
        // 是否可切换
        this._isSwiper = false;
        // 是否是点击
        this._isClick = false;
    },
    onLoad: function onLoad() {
        this.btnPrev.on(cc.Node.EventType.TOUCH_END, this.handlePrev, this);
        this.btnNext.on(cc.Node.EventType.TOUCH_END, this.handleNext, this);

        this.swiper.on(cc.Node.EventType.TOUCH_START, this.handleStart, this);
        this.swiper.on(cc.Node.EventType.TOUCH_MOVE, this.handleMove, this);
        this.swiper.on(cc.Node.EventType.TOUCH_END, this.handleEnd, this);
    },
    start: function start() {
        var _this = this;

        this.list.map(function (item, index, arr) {
            var x = item.x;
            var y = item.y;

            item.opacity = 0;

            var action = cc.sequence(cc.delayTime(_this._duration * index), cc.place(cc.v2(x - 50, y)), cc.spawn(cc.moveTo(_this._duration, cc.v2(x, y)), cc.fadeIn(_this._duration)), cc.place(cc.v2(x, y)), cc.callFunc(function () {
                if (index === arr.length - 1) {
                    _this._isSwiper = true;
                }
            }, _this));

            item.runAction(action);

            item.on(cc.Node.EventType.TOUCH_END, function (evt) {
                _this.handleChoose(evt, index);
            }, _this);
        });
    },


    // 选择图片
    handleChoose: function handleChoose(evt, index) {
        var _this2 = this;

        this.scheduleOnce(function () {
            if (!_this2._isSwiper || !_this2._isClick) {
                return;
            }

            var customEvent = new cc.Event.EventCustom('choosePuzzle', true);

            customEvent.setUserData({
                msg: '选择图片',
                index: index
            });

            _this2.node.dispatchEvent(customEvent);
        }, 0.1);
    },


    // 上一页
    handlePrev: function handlePrev(evt) {
        if (this._index === 0 || !this._isSwiper) {
            return;
        }

        this._index--;

        this.swiperPuzzle();
    },


    // 下一页
    handleNext: function handleNext(evt) {
        if (this._index === this.list.length - 1 || !this._isSwiper) {
            return;
        }

        this._index++;

        this.swiperPuzzle();
    },


    // 切换拼图
    swiperPuzzle: function swiperPuzzle() {
        var _this3 = this;

        var index = this.list.length - (4 - this._index);
        var x = this.swiper.x;
        var y = this.swiper.y;
        var offsetX = this.swiper.width / 3;

        this._isSwiper = false;

        var action = cc.sequence(cc.place(cc.v2(x, y)), cc.moveTo(this._duration, cc.v2(offsetX * index, y)), cc.place(cc.v2(offsetX * index, y)), cc.callFunc(function () {
            _this3._isSwiper = true;
            _this3._isClick = true;
        }, this));

        this.swiper.runAction(action);
    },


    // 触摸开始
    handleStart: function handleStart(evt) {
        this._isClick = false;
    },


    // 触摸移动
    handleMove: function handleMove(evt) {},


    // 触摸结束
    handleEnd: function handleEnd(evt) {
        var startLoc = evt.getStartLocation();
        var endLoc = evt.getLocation();

        this._isClick = startLoc.equals(endLoc);

        if (!this._isClick) {
            var span = endLoc.sub(startLoc);

            //认定为水平方向滑动
            if (Math.abs(span.x) > Math.abs(span.y)) {
                if (span.x > 30) {
                    //向右
                    this.handleNext(evt);
                } else if (span.x < -30) {
                    //向左
                    this.handlePrev(evt);
                }
            }
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=choose.js.map
        