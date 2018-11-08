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

    ctor() {
        // 块编号
        this._id = [0, 1, 2, 3, 4, 5];

        // 是否移动
        this._isMove = true;

        // 起始块
        this._startBlock = null;
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.handleMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleEnd, this);
    },

    start() {},

    update(dt) {},

    // 选中拼图
    handleStart(evt) {
        if (!this._isMove) {
            return;
        }

        this._startBlock = null;

        const touchLoc = evt.touch.getLocation();

        const block = this.getBlockByPoint(touchLoc);

        if (block) {
            this._startBlock = block;
        }
    },

    // 移动拼图
    handleMove(evt) {},

    // 放置拼图
    handleEnd(evt) {
        if (!this._isMove) {
            return;
        }
        
        const touchLoc = evt.touch.getLocation();

        const block = this.getBlockByPoint(touchLoc);

        if (this._startBlock && block) {
            const startPoint = this._startBlock.getPosition();
            const endPoint = block.getPosition();
            const startIndex = this._startBlock.puzzleIndex;
            const endIndex = block.puzzleIndex;

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
    getBlockByPoint(point) {
        const result = this.blocks.filter((block) => {
            const polygonCollider = block.getChildByName('collider').getComponent(cc.PolygonCollider);

            return cc.Intersection.pointInPolygon(point, polygonCollider.world.points);
        });

        return result[0];
    },

    /*
     * 更新块
     * @param (number) themeIndex 主题索引值
     */
    updateBlock(themeIndex) {
        const arr = this.getRandomOrder();
        let theme = this.getThemeSpriteFrame(themeIndex);

        this.blocks.map((block, index) => {
            const puzzleId = arr[index];
            const spriteFrame = theme[puzzleId];
            const sprite = block.getComponent(cc.Sprite);

            block.puzzleId = puzzleId;
            block.puzzleIndex = index;

            sprite.spriteFrame = spriteFrame;
        });

        this.sortPuzzleId();
    },

    // 获取随机顺序
    getRandomOrder() {
        const id = Array.from(this._id);
        const arr = [];

        while (id.length > 0) {
            const index = Math.floor(Math.random() * id.length);
            const item = id.splice(index, 1);

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
    getThemeSpriteFrame(index) {
        let sp = null;

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
    checkPuzzleId() {
        const arr = [];

        this.blocks.map((block, index) => {
            arr.push(block.puzzleId);
        });

        if (arr.toString() === this._id.toString()) {
            this._isMove = false;

            const action = cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    const customEvent = new cc.Event.EventCustom('nextScene', true);
                    customEvent.setUserData({
                        msg: '成功'
                    });

                    this.node.dispatchEvent(customEvent);
                }, this)
            );

            this.node.runAction(action);
        }
    },

    // 排序
    sortPuzzleId() {
        this.blocks.sort((a, b) => {
            return a.puzzleIndex - b.puzzleIndex;
        });
    }
});