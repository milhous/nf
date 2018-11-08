(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/puzzle.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2b575zImClMB5JBWxAjRcN6', 'puzzle', __filename);
// script/puzzle.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        btnAgain: {
            default: null,
            type: cc.Node
        },
        blocks: {
            default: [],
            type: [cc.Node]
        },
        themeOne: {
            default: [],
            type: [cc.SpriteFrame]
        },
        themeTwo: {
            default: [],
            type: [cc.SpriteFrame]
        },
        themeThree: {
            default: [],
            type: [cc.SpriteFrame]
        }
    },

    ctor: function ctor() {
        // 块编号
        this._id = [0, 1, 2, 3, 4, 5];

        // 起始块
        this._startBlock = null;
    },
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.handleMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleEnd, this);
    },
    start: function start() {},
    update: function update(dt) {},


    // 选中拼图
    handleStart: function handleStart(evt) {
        this._startBlock = null;

        var touchLoc = evt.touch.getLocation();

        var block = this.getBlockByPoint(touchLoc);

        if (block) {
            this._startBlock = block;
        }
    },


    // 移动拼图
    handleMove: function handleMove(evt) {},


    // 放置拼图
    handleEnd: function handleEnd(evt) {
        var touchLoc = evt.touch.getLocation();

        var block = this.getBlockByPoint(touchLoc);

        if (this._startBlock && block) {
            var startPoint = this._startBlock.getPosition();
            var endPoint = block.getPosition();
            var startIndex = this._startBlock.puzzleIndex;
            var endIndex = block.puzzleIndex;

            this._startBlock.puzzleIndex = endIndex;
            this._startBlock.setPosition(endPoint);

            block.puzzleIndex = startIndex;
            block.setPosition(startPoint);

            this.sortPuzzleId();

            this.checkPuzzleId();
        }
    },


    /*
     * 通过坐标获取对应块
     * @param (object) point 坐标点
     */
    getBlockByPoint: function getBlockByPoint(point) {
        var result = this.blocks.filter(function (block) {
            var polygonCollider = block.getChildByName('collider').getComponent(cc.PolygonCollider);

            return cc.Intersection.pointInPolygon(point, polygonCollider.world.points);
        });

        return result[0];
    },


    /*
     * 更新块
     * @param (number) themeIndex 主题索引值
     */
    updateBlock: function updateBlock(themeIndex) {
        var arr = this.getRandomOrder();
        var theme = this.getThemeSpriteFrame(themeIndex);

        this.blocks.map(function (block, index) {
            var puzzleId = arr[index];
            var spriteFrame = theme[puzzleId];
            var sprite = block.getComponent(cc.Sprite);

            block.puzzleId = puzzleId;
            block.puzzleIndex = index;

            sprite.spriteFrame = spriteFrame;
        });

        this.sortPuzzleId();
    },


    // 获取随机顺序
    getRandomOrder: function getRandomOrder() {
        var id = Array.from(this._id);
        var arr = [];

        while (id.length > 0) {
            var index = Math.floor(Math.random() * id.length);
            var item = id.splice(index, 1);

            if (item[0] !== undefined) {
                arr.push(item[0]);
            }
        }

        return arr;
    },


    /*
     * 获取主题纹理
     * @param (number) index 主题索引值
     */
    getThemeSpriteFrame: function getThemeSpriteFrame(index) {
        var sp = null;

        switch (index) {
            case 0:
                sp = this.themeOne;

                break;
            case 1:
                sp = this.themeTwo;

                break;

            case 2:
                sp = this.themeThree;

                break;
        }

        return sp;
    },


    // 检测拼图是否正确
    checkPuzzleId: function checkPuzzleId() {
        var _this = this;

        var arr = [];

        this.blocks.map(function (block, index) {
            arr.push(block.puzzleId);
        });

        if (arr.toString() === this._id.toString()) {
            var action = cc.sequence(cc.delayTime(1), cc.callFunc(function () {
                var customEvent = new cc.Event.EventCustom('nextScene', true);
                customEvent.setUserData({
                    msg: '成功'
                });

                _this.node.dispatchEvent(customEvent);
            }, this));

            this.node.runAction(action);
        }
    },


    // 排序
    sortPuzzleId: function sortPuzzleId() {
        this.blocks.sort(function (a, b) {
            return a.puzzleIndex - b.puzzleIndex;
        });
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
        //# sourceMappingURL=puzzle.js.map
        