// 场景
const SceneType = cc.Enum({
    INDEX: 0,
    FORM: 1,
    JOIN: 2,
    CHOOSE: 3,
    PUZZLE: 4,
    SUCCEED: 5,
    LIST: 6
});

const Scene = cc.Class({
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

    ctor() {
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
        // 中奖名单
        this._list = null;
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
        },
        listName: {
            default: [],
            type: [cc.Label]
        },
        listTel: {
            default: [],
            type: [cc.Label]
        }
    },

    onLoad() {
        // 开启碰撞
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // 初始化组件
        this.puzzle = this.puzzle.getComponent('puzzle');

        // 定义事件
        this.btnSubmit.on(cc.Node.EventType.TOUCH_END, this.handleSubmit, this);

        this.btnJoin.on(cc.Node.EventType.TOUCH_END, this.handleJoin, this);

        this.btnAgain.on(cc.Node.EventType.TOUCH_END, this.handleAgain, this);

        this.btnGet.on(cc.Node.EventType.TOUCH_END, this.handleGet, this);

        this.btnPass.on(cc.Node.EventType.TOUCH_END, this.handlePass, this);

        this.node.on('nextScene', (evt) => {
            cc.log(evt.detail);

            this.puzzleSucceed();
        });

        this.node.on('choosePuzzle', (evt) => {
            cc.log(evt.detail);

            this.puzzle.updateBlock(evt.detail.index);

            this.nextScene();
        });

        this.initVideo();

        // 获取中奖名单
        cc.loader.load('list.json', (err, json) => {
            this._list = json;

            cc.log(err, json);
        });
    },

    start() {},

    update(dt) {
        if (this._isPlay && this._video) {
            this.getVideoFrame();
        }
    },

    // 初始化视频
    initVideo() {
        const video = document.getElementById('video');

        this._video = video;

        this.video.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (!this._isPlay) {
                video.play();
            }
        }, this);

        video.addEventListener('play', () => {
            this._isPlay = true;
        }, false);

        video.addEventListener('ended', () => {
            this._isPlay = false;

            this.aniBtn('btnPass');
        }, false);

        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, () => {
                video.play();
            }, false);
        } else {
            document.addEventListener('WeixinJSBridgeReady', () => {
                WeixinJSBridge.invoke('getNetworkType', {}, () => {
                    video.play();
                });
            }, false);
        }
    },

    // 获取视频图片帧
    getVideoFrame() {
        const width = video.width;
        const height = video.height;

        const canvas = document.createElement('canvas');
        canvas.width = Number(width);
        canvas.height = Number(height);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.src = canvas.toDataURL('image/jpeg');
        img.onload = () => {
            const texture = new cc.Texture2D();
            texture.initWithElement(img);
            texture.handleLoadedTexture();

            const spriteFrame = new cc.SpriteFrame(texture);

            this.video.spriteFrame = spriteFrame;
        }
    },

    // 跳过视频
    handlePass(evt) {
        this._isPlay = false;
        this._video.pause();

        if (this._list !== null && Object.keys(this._list).length > 0) {
            this.renderList();

            this.toScene(6);
        } else {
            this.nextScene();
        }
    },

    // 提交表单
    handleSubmit() {
        const req = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
        const username = this.inputUsername.string;
        const mobile = this.inputMoblie.string;

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
        }).then((data) => {
            this._id = data.id;

            this.nextScene();
        }, (error) => {
            alert(error);
        });
    },

    // 加入互动
    handleJoin() {
        cc.log('加入互动');

        this.nextScene();
    },

    // 再次挑战
    handleAgain() {
        cc.log('再次挑战');

        this.prevScene();
    },

    // 获取权益
    handleGet() {
        location.href = 'https://weapp.wemediacn.com/tnf/north/vipeak/to_auth_page?page_type=user_center';
    },

    // 拼图成功
    puzzleSucceed() {
        this.sendRequest({
            path: 'recode_game.php',
            method: 'POST',
            data: {
                id: this._id,
                status: 1
            }
        }).then((value) => {
            this.nextScene();
        }, (error) => {
            alert(error);
        });
    },

    // 渲染中间名单
    renderList() {
        Object.keys(this._list).map((name, index) => {
            this.listName[index].string = name;
            this.listTel[index].string = this._list[name];
        });
    },

    // 跳转下一个场景
    nextScene() {
        this._sceneIndex++;

        this.scenes.map((obj) => {
            obj.node.active = obj.type === this._sceneIndex;
        });
    },

    // 跳转指定场景
    toScene(index) {
        this._sceneIndex = index;

        this.scenes.map((obj) => {
            obj.node.active = obj.type === this._sceneIndex;
        });
    },

    // 跳转上一个场景
    prevScene() {
        this._sceneIndex--;

        if (this._sceneIndex < 0) {
            this._sceneIndex = 0;
        }

        this.scenes.map((obj) => {
            obj.node.active = obj.type === this._sceneIndex;
        });
    },

    // 按钮动画
    aniBtn(btn) {
        const action = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(this._duration, 1.1, 1.1),
                cc.scaleTo(this._duration, 1, 1)
            )
        );

        this[btn].runAction(action);
    },

    sendRequest({
        path = '',
        method = 'GET',
        data = {},
        extraUrl = 'http://h5.yuncii.com/nf/interface/'
    }) {
        return new Promise((resolve, reject) => {
            const xhr = cc.loader.getXMLHttpRequest();
            let requestURL = extraUrl + path;
            let params = null;

            if (typeof data === 'object') {
                params = Object.keys(data).map(function(key) {
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

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    cc.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);

                    return resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(xhr.statusText);
                }
            };

            xhr.onerror = () => {
                reject(xhr.statusText);
            };

            xhr.send(params);
        });
    }
});