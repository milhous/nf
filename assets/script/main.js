// 场景
const SceneType = cc.Enum({
    INDEX: 0,
    FORM: 1,
    JOIN: 2,
    CHOOSE: 3,
    PUZZLE: 4,
    SUCCEED: 5
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

        this.video.node.on('ready-to-play', this.handleReady, this);
        this.video.node.on('clicked', this.handleClick, this);
        this.video.node.on('completed', this.handleCompleted, this);

        this.node.on('nextScene', (evt) => {
            cc.log(evt.detail);

            this.puzzleSucceed();
        });

        this.node.on('choosePuzzle', (evt) => {
            cc.log(evt.detail);

            this.puzzle.updateBlock(evt.detail.index);

            this.nextScene();
        });
    },

    start() {},

    update(dt) {},

    // 准备视频
    handleReady(evt) {
        const video = evt;

        video.play();

        document.addEventListener('WeixinJSBridgeReady', function() {
            document.querySelector('.cocosVideo').play();
        });
    },

    // 用户点击
    handleClick(evt) {
        const video = evt;

        video.play();
    },

    // 跳过视频
    handlePass(evt) {
        this.video.destroy();

        this.nextScene();
    },

    // 播放完成
    handleCompleted(evt) {
        this.aniBtn('btnPass');
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

    // 跳转下一个场景
    nextScene() {
        this._sceneIndex++;

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