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
        panel: {
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
        this._isSwiper = true;
    },
    onLoad: function onLoad() {
        this.btnPrev.on(cc.Node.EventType.TOUCH_END, this.handlePrev, this);
        this.btnNext.on(cc.Node.EventType.TOUCH_END, this.handleNext, this);

        this.panel.on(cc.Node.EventType.TOUCH_END, this.handleEnd, this);
    },
    start: function start() {
        this.aniBtn('btnPrev', -20);

        this.aniBtn('btnNext', 20);
    },


    // 按钮动画
    aniBtn: function aniBtn(btn, offsetX) {
        var action = cc.repeatForever(cc.sequence(cc.moveBy(this._duration, offsetX, 0), cc.moveBy(this._duration, -offsetX, 0)));

        this[btn].runAction(action);
    },


    // 选择图片
    handleChoose: function handleChoose(index) {
        var customEvent = new cc.Event.EventCustom('choosePuzzle', true);

        customEvent.setUserData({
            msg: '选择图片',
            index: index
        });

        this.node.dispatchEvent(customEvent);
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
        var _this = this;

        var index = this.list.length - (4 - this._index);
        var x = this.swiper.x;
        var y = this.swiper.y;
        var offsetX = this.swiper.width / 3;

        this._isSwiper = false;

        var action = cc.sequence(cc.place(cc.v2(x, y)), cc.moveTo(this._duration, cc.v2(offsetX * index, y)), cc.place(cc.v2(offsetX * index, y)), cc.callFunc(function () {
            _this._isSwiper = true;
        }, this));

        this.swiper.runAction(action);
    },


    // 触摸结束
    handleEnd: function handleEnd(evt) {
        var startLoc = evt.getStartLocation();
        var endLoc = evt.getLocation();

        cc.log(startLoc.equals(endLoc));

        // 判断两个向量是否相等
        if (!startLoc.equals(endLoc)) {
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
        } else {
            var index = this.getIndexByPoint(endLoc);

            if (index !== null) {
                this.handleChoose(index);
            }
        }
    },


    /*
     * 通过坐标获取对应索引值
     * @param (object) point 坐标点
     */
    getIndexByPoint: function getIndexByPoint(point) {
        var itemIndex = null;

        this.list.map(function (item, index) {
            var polygonCollider = item.getComponent(cc.PolygonCollider);

            if (cc.Intersection.pointInPolygon(point, polygonCollider.world.points)) {
                itemIndex = index;
            }
        });

        return itemIndex;
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
        