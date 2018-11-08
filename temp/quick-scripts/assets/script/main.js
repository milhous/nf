(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd793dJ3MvFAh6l8vYZ0HVCN', 'main', __filename);
// script/main.js

'use strict';

// 场景
var SceneType = cc.Enum({
    INDEX: 0,
    FORM: 1,
    JOIN: 2,
    CHOOSE: 3,
    PUZZLE: 4,
    SUCCEED: 5
});

var Scene = cc.Class({
    name: 'Scene',
    properties: {
        type: {
            default: SceneType.INDEX,
            type: SceneType
        },
        node: cc.Node
    }
});

cc.Class({
    extends: cc.Component,

    ctor: function ctor() {
        // 场景索引值
        this._sceneIndex = 0;
    },


    properties: {
        scenes: {
            default: [],
            type: Scene
        },
        btnPass: {
            default: null,
            type: cc.Node
        },
        btnSubmit: {
            default: null,
            type: cc.Node
        },
        btnJoin: {
            default: null,
            type: cc.Node
        },
        btnAgain: {
            default: null,
            type: cc.Node
        },
        btnGet: {
            default: null,
            type: cc.Node
        },
        puzzle: {
            default: null,
            type: cc.Node
        },
        video: {
            default: null,
            type: cc.VideoPlayer
        }
    },

    onLoad: function onLoad() {
        var _this = this;

        // 开启碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // 初始化组件
        this.puzzle = this.puzzle.getComponent('puzzle');

        // 定义事件
        this.btnSubmit.on(cc.Node.EventType.TOUCH_END, this.handleSubmit, this);

        this.btnJoin.on(cc.Node.EventType.TOUCH_END, this.handleJoin, this);

        this.btnAgain.on(cc.Node.EventType.TOUCH_END, this.handleAgain, this);

        this.btnGet.on(cc.Node.EventType.TOUCH_END, this.handleGet, this);

        this.btnPass.on(cc.Node.EventType.TOUCH_END, this.handlePass, this);

        this.video.node.on('ready-to-play', this.handleReady, this);
        this.video.node.on('clicked', this.handleClick, this);

        this.node.on('nextScene', function (evt) {
            cc.log(evt.detail);

            _this.nextScene();
        });

        this.node.on('choosePuzzle', function (evt) {
            cc.log(evt.detail);

            _this.puzzle.updateBlock(evt.detail.index);

            _this.nextScene();
        });
    },
    start: function start() {},
    update: function update(dt) {},


    // 准备视频
    handleReady: function handleReady(evt) {
        var video = evt;
        video.play();

        document.addEventListener("WeixinJSBridgeReady", function () {
            video.play();
        });

        cc.log('evt', evt);
    },


    // 用户点击
    handleClick: function handleClick(evt) {
        var video = evt;

        video.play();
    },


    // 跳过视频
    handlePass: function handlePass(evt) {
        this.video.destroy();

        this.nextScene();
    },


    // 提交表单
    handleSubmit: function handleSubmit() {
        this.nextScene();
    },


    // 加入互动
    handleJoin: function handleJoin() {
        cc.log('加入互动');

        this.nextScene();
    },


    // 再次挑战
    handleAgain: function handleAgain() {
        cc.log('再次挑战');

        this.prevScene();
    },


    // 获取权益
    handleGet: function handleGet() {
        location.href = 'https://weapp.wemediacn.com/tnf/north/vipeak/to_auth_page?page_type=user_center';
    },


    // 跳转下一个场景
    nextScene: function nextScene() {
        var _this2 = this;

        this._sceneIndex++;

        this.scenes.map(function (obj) {
            obj.node.active = obj.type === _this2._sceneIndex;
        });
    },


    // 跳转上一个场景
    prevScene: function prevScene() {
        var _this3 = this;

        this._sceneIndex--;

        if (this._sceneIndex < 0) {
            this._sceneIndex = 0;
        }

        this.scenes.map(function (obj) {
            obj.node.active = obj.type === _this3._sceneIndex;
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
        //# sourceMappingURL=main.js.map
        