(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd793dJ3MvFAh6l8vYZ0HVCN', 'main', __filename);
// script/main.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        // 动画时间
        this._duration = .3;
        // 场景索引值
        this._sceneIndex = 0;
        // 用户ID
        this._id = null;
        // 视频
        this._video = null;
        // 是否播放
        this._isPlay = false;
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
            type: cc.Sprite
        },
        inputUsername: {
            default: null,
            type: cc.EditBox
        },
        inputMoblie: {
            default: null,
            type: cc.EditBox
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

        this.node.on('nextScene', function (evt) {
            cc.log(evt.detail);

            _this.puzzleSucceed();
        });

        this.node.on('choosePuzzle', function (evt) {
            cc.log(evt.detail);

            _this.puzzle.updateBlock(evt.detail.index);

            _this.nextScene();
        });

        this.initVideo();
    },
    start: function start() {},
    update: function update(dt) {
        if (this._isPlay && this._video) {
            this.getVideoFrame();
        }
    },


    // 初始化视频
    initVideo: function initVideo() {
        var _this2 = this;

        var video = document.getElementById('video');

        this._video = video;

        this.video.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (!_this2._isPlay) {
                video.play();
            }
        }, this);

        video.addEventListener('play', function () {
            _this2._isPlay = true;
        }, false);

        video.addEventListener('ended', function () {
            _this2._isPlay = false;

            _this2.aniBtn('btnPass');
        }, false);

        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function () {
                video.play();
            }, false);
        } else {
            document.addEventListener('WeixinJSBridgeReady', function () {
                WeixinJSBridge.invoke('getNetworkType', {}, function () {
                    video.play();
                });
            }, false);
        }
    },


    // 获取视频图片帧
    getVideoFrame: function getVideoFrame() {
        var _this3 = this;

        var width = video.width;
        var height = video.height;

        var canvas = document.createElement('canvas');
        canvas.width = Number(width);
        canvas.height = Number(height);

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        var img = new Image();
        img.src = canvas.toDataURL('image/jpeg');
        img.onload = function () {
            var texture = new cc.Texture2D();
            texture.initWithElement(img);
            texture.handleLoadedTexture();

            var spriteFrame = new cc.SpriteFrame(texture);

            _this3.video.spriteFrame = spriteFrame;
        };
    },


    // 跳过视频
    handlePass: function handlePass(evt) {
        this._isPlay = false;
        this._video.pause();

        this.nextScene();
    },


    // 提交表单
    handleSubmit: function handleSubmit() {
        var _this4 = this;

        var req = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
        var username = this.inputUsername.string;
        var mobile = this.inputMoblie.string;

        if (username === '') {
            alert('请输入您的姓名');

            return;
        }

        if (mobile === '') {
            alert('请输入您的手机号码');

            return;
        } else if (!req.test(Number(mobile))) {
            alert('请输入有效的手机号码');

            return;
        }

        this.sendRequest({
            path: 'recode_user.php',
            method: 'POST',
            data: {
                name: username,
                phone: mobile
            }
        }).then(function (data) {
            _this4._id = data.id;

            _this4.nextScene();
        }, function (error) {
            alert(error);
        });
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


    // 拼图成功
    puzzleSucceed: function puzzleSucceed() {
        var _this5 = this;

        this.sendRequest({
            path: 'recode_game.php',
            method: 'POST',
            data: {
                id: this._id,
                status: 1
            }
        }).then(function (value) {
            _this5.nextScene();
        }, function (error) {
            alert(error);
        });
    },


    // 跳转下一个场景
    nextScene: function nextScene() {
        var _this6 = this;

        this._sceneIndex++;

        this.scenes.map(function (obj) {
            obj.node.active = obj.type === _this6._sceneIndex;
        });
    },


    // 跳转上一个场景
    prevScene: function prevScene() {
        var _this7 = this;

        this._sceneIndex--;

        if (this._sceneIndex < 0) {
            this._sceneIndex = 0;
        }

        this.scenes.map(function (obj) {
            obj.node.active = obj.type === _this7._sceneIndex;
        });
    },


    // 按钮动画
    aniBtn: function aniBtn(btn) {
        var action = cc.repeatForever(cc.sequence(cc.scaleTo(this._duration, 1.1, 1.1), cc.scaleTo(this._duration, 1, 1)));

        this[btn].runAction(action);
    },
    sendRequest: function sendRequest(_ref) {
        var _ref$path = _ref.path,
            path = _ref$path === undefined ? '' : _ref$path,
            _ref$method = _ref.method,
            method = _ref$method === undefined ? 'GET' : _ref$method,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? {} : _ref$data,
            _ref$extraUrl = _ref.extraUrl,
            extraUrl = _ref$extraUrl === undefined ? 'http://h5.yuncii.com/nf/interface/' : _ref$extraUrl;

        return new Promise(function (resolve, reject) {
            var xhr = cc.loader.getXMLHttpRequest();
            var requestURL = extraUrl + path;
            var params = null;

            if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                params = Object.keys(data).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }).join('&');
            }

            xhr.timeout = 5000;

            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }

            switch (method) {
                case 'GET':
                    if (params !== null) {
                        requestURL += params;
                    }

                    xhr.open(method, requestURL, true);

                    break;
                case 'POST':
                    xhr.open(method, requestURL, true);

                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                    break;
            }

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    cc.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);

                    return resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.onerror = function () {
                reject(xhr.statusText);
            };

            xhr.send(params);
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
        