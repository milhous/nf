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

        this.node.on('nextScene', (evt) => {
            cc.log(evt.detail);

            this.nextScene();
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

        document.addEventListener("WeixinJSBridgeReady", function() {
            video.play();
        });

        cc.log('evt', evt);
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

    // 提交表单
    handleSubmit() {
        this.nextScene();
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
    }
});