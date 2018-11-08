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

    ctor() {
        // 动画时间
        this._duration = .6;
        // 当前索引值
        this._index = 1;
        // 是否可切换
        this._isSwiper = false;
        // 是否是点击
        this._isClick = false;
    },

    onLoad() {
        this.btnPrev.on(cc.Node.EventType.TOUCH_END, this.handlePrev, this);
        this.btnNext.on(cc.Node.EventType.TOUCH_END, this.handleNext, this);

        this.swiper.on(cc.Node.EventType.TOUCH_START, this.handleStart, this);
        this.swiper.on(cc.Node.EventType.TOUCH_MOVE, this.handleMove, this);
        this.swiper.on(cc.Node.EventType.TOUCH_END, this.handleEnd, this);
    },

    start() {
        this.list.map((item, index, arr) => {
            const x = item.x;
            const y = item.y;

            item.opacity = 0;

            const action = cc.sequence(
                cc.delayTime(this._duration * index),
                cc.place(cc.v2(x - 50, y)),
                cc.spawn(
                    cc.moveTo(this._duration, cc.v2(x, y)),
                    cc.fadeIn(this._duration)
                ),
                cc.place(cc.v2(x, y)),
                cc.callFunc(() => {
                    if (index === arr.length - 1) {
                        this._isSwiper = true;
                    }
                }, this)
            );

            item.runAction(action);

            item.on(cc.Node.EventType.TOUCH_END, (evt) => {
                this.handleChoose(evt, index);
            }, this);
        });
    },

    // 选择图片
    handleChoose(evt, index) {
        this.scheduleOnce(() => {
            if (!this._isSwiper || !this._isClick) {
                return;
            }

            const customEvent = new cc.Event.EventCustom('choosePuzzle', true);

            customEvent.setUserData({
                msg: '选择图片',
                index
            });

            this.node.dispatchEvent(customEvent);
        }, 0.1);
    },

    // 上一页
    handlePrev(evt) {
        if (this._index === 0 || !this._isSwiper) {
            return;
        }

        this._index--;

        this.swiperPuzzle();
    },

    // 下一页
    handleNext(evt) {
        if (this._index === this.list.length - 1 || !this._isSwiper) {
            return;
        }

        this._index++;

        this.swiperPuzzle();
    },

    // 切换拼图
    swiperPuzzle() {
        const index = this.list.length - (4 - this._index);
        const x = this.swiper.x;
        const y = this.swiper.y;
        const offsetX = this.swiper.width / 3;

        this._isSwiper = false;

        const action = cc.sequence(
            cc.place(cc.v2(x, y)),
            cc.moveTo(this._duration, cc.v2(offsetX * index, y)),
            cc.place(cc.v2(offsetX * index, y)),
            cc.callFunc(() => {
                this._isSwiper = true;
                this._isClick = true;
            }, this)
        );

        this.swiper.runAction(action);
    },

    // 触摸开始
    handleStart(evt) {
        this._isClick = false;
    },

    // 触摸移动
    handleMove(evt) {

    },

    // 触摸结束
    handleEnd(evt) {
        const startLoc = evt.getStartLocation();
        const endLoc = evt.getLocation();

        this._isClick = startLoc.equals(endLoc);

        if (!this._isClick) {
            const span = endLoc.sub(startLoc);

            //认定为水平方向滑动
            if (Math.abs(span.x) > Math.abs(span.y)) {
                if (span.x > 30) { //向右
                    this.handleNext(evt);
                } else if (span.x < -30) { //向左
                    this.handlePrev(evt);
                }
            }
        } else {
            const index = this.getIndexByPoint(endLoc);
        }
    },

    /*
     * 通过坐标获取对应索引值
     * @param (object) point 坐标点
     */
    getIndexByPoint(point) {
        let itemIndex = null;

        this.list.filter((item, index) => {
            const polygonCollider = item.getChildByName('collider').getComponent(cc.PolygonCollider);

            if (cc.Intersection.pointInPolygon(point, polygonCollider.world.points)) {
                itemIndex = index;
            }
        });

        return itemIndex;
    },
});