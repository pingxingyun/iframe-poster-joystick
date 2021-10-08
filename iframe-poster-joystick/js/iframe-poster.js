// serverAddr = "192.168.0.50:8181";
serverAddr = "222.128.6.137:8181";
var config = {
    server: "http://" + serverAddr + "/", // server
    webclient: "http://" + serverAddr + "/webclient", // client
    // webclient: "http://192.168.0.122:8080/", // debug client
    // testAppId: "745609250029436928",
    testAppId: "879414254636105728"
}


$(document).ready(function() {
    // 进入应用应用列表中获取的第一个应用。
   /* $("#enter").on("click", function(e) {*/
        if (!config.server) {
            alert("请设置 config.server");
            return;
        }
        if (config.testAppId) {
            enterApp(config.testAppId);
        } else {
            $.get(config.server + "getAppliList", function(res) {
                if (res && res.code === 1000) {
                    console.log("load list success", res.result.list);
                    if (res.result.list && res.result.list.length > 0) {
                        enterApp(res.result.list[0].appliId);
                    } else {
                        console.log("empty list. please use create server ip.");
                    }
                } else {
                    console.warn("load list failed", res);
                }
            });
        }
/*    })*/
    // 关闭应用
/*    $("#close").on("click", function(){
		$("#iframe").attr("src", "");
    });*/
    function enterApp(appliId) {
		console.log("enter appli:", config.server + "getEnterAppliInfo?appliId=" + appliId);
		$.get(config.server + "getEnterAppliInfo?appliId=" + appliId, function(res){
			console.log("enter appli res:", res, joinParam(res.result));
			if (res && res.code == 1000) {
                // res.result.playerMode = 1;
				// res.result.userType = 1;
				// res.result.nickname = "Test";
				// res.result.roomCode = 0;

                res.result.debugTask = true;
                res.result.debugWebServer = serverAddr;
                res.result.mobileForceLandscape = 0;
                res.result.mobileVirtualJoystick = 0;
				$("#iframe").attr("src", config.webclient + "?" + joinParam(res.result));
			}
		})
    }
    // iframe websocket test
	(function() {
        var iframeSize = {
            appSize: {width: 0, height: 0},
            container: {marginTop: 0, marginLeft: 0, width: 0, height: 0},
            scale: {scaleX: 1, scaleY: 1},
            viewPort: {width: 0, height: 0},
        };
        var timeout= null,touched= false, touchStartTime= 0,longPressed= false;
        var timeoutRight= null,touchedRight= false, touchStartTimeRight= 0, longPressedRight= false;
        var screenOrientation = 'portrait',mobilePixelUnit = 1920 / 100;
        var leftJoyStickKeys= [];
        var viewPort= iframeSize.viewPort;
        var vector = null,vectorRight = null;
        var container= iframeSize.container;
        var joystickElement =  {
            root: $('.joystick-left')[0],
            width: $('.joystick-left')[0].clientWidth,
            height: $('.joystick-left')[0].clientHeight,
        };
        var joysickTouchesPosition = {
            x: joystickElement.width / 2,
            y: joystickElement.height / 2,
        };
        var joystickElementRight =  {
            root: $('.joystick-right')[0],
            width: $('.joystick-right')[0].clientWidth,
            height: $('.joystick-right')[0].clientHeight,
        };
        var joysickTouchesPositionRight = {
            x: joystickElementRight.width / 2,
            y: joystickElementRight.height / 2,
        };
        var lastAppPosition = {
            x: 0,
            y: 0,
        }
        var poster = new lark.iframePoster($("#iframe").get(0), {
            onMessage: onMessage,
            listenKeyboard: true,
        })
        function onBridgeReady() {
            // tell client bridge ready.
            poster.wxJsBridgeReady();
        }
        function onMessage(e) {
            if (e.data.type == lark.EventTypes.LK_WEB_CLIENT_LOAD_SUCCESS) {
                poster.sendToIframe(lark.EventTypes.LK_IFRAME_POSTER_UI_ALERT, "false");
             /*   console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
                // listen wx js bridge ready.
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }*/
            }else if(e.data.type == lark.EventTypes.LK_UI_RESIZE) {
                iframeSize = e.data.data;
            } else if (e.data.type == lark.EventTypes.LK_USER_CAPTURE_FRAME) {
                console.log('收到截图');
                var w = window.open('about:blank','image from canvas');
                w.document.write("<img src='" + e.data.data + "' alt='from canvas'/>");
            } else if (e.data.type == lark.EventTypes.LK_VIDEO_LOADED) {
                console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
                // listen wx js bridge ready.
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            } else if(e.data.type == lark.EventTypes.LK_GOT_REMOTE_STREAM){
                console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
                // listen wx js bridge ready.
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }else if (e.data.type == lark.EventTypes.LK_RTC_EVENT_PEERCONNECTION_STATE) {
                // got connection update state.
            }else{
                console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
            }
        }
        resize();
        window.addEventListener('resize',  resize());
        function resize() {
            // let offset = ScaleMode.OFFSET;
            let offset = 0;
            // 浏览器窗口宽
            let screenW = viewport().width;
            // 浏览器窗口高
            let screenH = viewport().height - offset;
            container = deepCopy(container);
            this.viewPort= {
                width: screenW, height: screenH
            }
            let isMobile = navigator.userAgent.toLowerCase().indexOf('mobile') !== -1
            if (isMobile) {
                if ('undefined' !== window.orientation && window.orientation === 0 ) {
                    screenW = viewport().height;
                    screenH = viewport().width - offset;
                    this.setScreenOrientation = 'landscape';

                } else {
                    this.setScreenOrientation = 'portrait';
                }
            }
            this.joystickElement =  {
                root: $('.joystick-left')[0],
                width: $('.joystick-left')[0].clientWidth,
                height: $('.joystick-left')[0].clientHeight,
            };
            this.joysickTouchesPosition = {
                x: this.joystickElement.width / 2,
                y: this.joystickElement.height / 2,
            };
            this.joystickElementRight =  {
                root: $('.joystick-right')[0],
                width: $('.joystick-right')[0].clientWidth,
                height: $('.joystick-right')[0].clientHeight,
            };
            this.joysickTouchesPositionRight = {
                x: this.joystickElementRight.width / 2,
                y: this.joystickElementRight.height / 2,
            };

            $('.joy-container').css({
                width: this.viewPort.width + "px",
                top: this.viewPort.height + 'px',
            })
            mobilePixelUnit  = screenW / 100
            if (isMobile) {
                // resize rem.
                document.documentElement.style.fontSize = screenW / 100 + 'px';
            } else {
                // document.documentElement.style.fontSize = screenW / 200 + 'px';
                document.documentElement.style.fontSize = '9px';
            }
        }
        // *********************左侧方向圆盘开始***************************************************
        $('.joystick-left').on('selectstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $('.joystick-left').on('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            touched = true;
            touchStartTime = Date.now();
            onJoyStickStart(e)
            repeatPress();
        })
        $('.joystick-left').on('touchmove', function(e) {
            e.preventDefault();
            e.stopPropagation();
            onJoyStickMove(e)
        })
        $('.joystick-left').on('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            touched = false;
            longPressed = false;
            if (timeout) {
                window.clearTimeout(timeout);
            }
            touchStartTime = 0;
            onJoyStickEnd(e)
        })
        function onJoyStickEnd(e) {
            joysickTouchesPosition = {
                x: this.joystickElement.width / 2,
                y: this.joystickElement.height / 2,
            }
            vector = null;
            joysickTouchesPositionFn()
            for (let key of leftJoyStickKeys) {
                poster.sendKeyUp(key);
            }
            leftJoyStickKeys = [];
        }
        function onJoyStickMove(e) {
            let p = { x: 0, y: 0 };
            // 通过旋转横屏时注意触摸的坐标系变换
            if (screenOrientation === 'landscape') {
                p.x = e.targetTouches[0].clientY - leftJoystickPosition().top;
                p.y = leftJoystickPosition().left - e.targetTouches[0].clientX;
            } else {
                p = singlePointRelativePosition(e.targetTouches[0], e.target);
            }
            if (p) {
                joysickTouchesPosition = p;
                let vectorc = getLimitRelativeVector(p.x, p.y);
                setLimitTouchPosition(vectorc);
                vector = vectorc;
                joysickTouchesPositionFn()
            }
        }
        function onJoyStickMoveRight(e) {
            let p = { x: 0, y: 0 };
            // 通过旋转横屏时注意触摸的坐标系变换
            if (screenOrientation === 'landscape') {
                p.x = e.targetTouches[0].clientY - leftJoystickPosition().top;
                p.y = leftJoystickPosition().left - e.targetTouches[0].clientX;
            } else {
                p = singlePointRelativePosition(e.targetTouches[0], e.target);
            }
            if (p) {
                joysickTouchesPositionRight = p;
                let vectorc = getLimitRelativeVectorRight(p.x, p.y);
                setLimitTouchPositionRight(vectorc);
                vectorRight = vectorc;
                joysickTouchesPositionRightFn()
            }
        }
        function repeatPress() {
            if (touched) {
                // check long press
                if (!longPressed && touchStartTime != 0 && Date.now() - touchStartTime > 1000) {
                    longPressed = true;
                }
                timeout = window.setTimeout(() => {
                    onJoyStickRepeat()
                    repeatPress();
                }, 100);
            }
        }
        function leftJoysStickKeyChannge(newKeys) {
            let oldKeys = leftJoyStickKeys;
            // key start press
            if (oldKeys.length === 0) {
                for (let key of newKeys) {
                    poster.sendKeyDown(key,false);
                }
                leftJoyStickKeys = newKeys;
                return;
            }
            var oldKeyChannged = [];
            for (let i = 0; i < oldKeys.length; i++) {
                oldKeyChannged.push(true);
            }

            for (let i = 0; i < oldKeys.length; i ++) {
                for (let j = 0; j < newKeys.length; j ++) {
                    if (oldKeys[i] == newKeys[j]) {
                        oldKeyChannged[i] = false;
                    }
                }
            }

            for (let i = 0; i < oldKeys.length; i ++) {
                if (oldKeyChannged[i]) {
                    poster.sendKeyUp(oldKeys[i]);
                }
            }

            let newKeyChannged = [];
            for (let i = 0; i < newKeys.length; i ++) {
                newKeyChannged.push(true);
            }

            for (let i = 0; i < newKeys.length; i ++) {
                for (let j = 0; j < oldKeys.length; j ++) {
                    if (newKeys[i] == oldKeys[j]) {
                        newKeyChannged[i] = false;
                    }
                }
            }

            for (let i = 0; i < newKeys.length; i ++) {
                if (newKeyChannged[i]) {
                    poster.sendKeyDown(newKeys[i],false);
                } else {
                    poster.sendKeyDown(newKeys[i],true);
                }
            }

            leftJoyStickKeys = newKeys;
        }
        function onJoyStickRepeat(key) {
            if (vector == null) {
                return;
            }
            var RADIUS = this.joystickElement.width / 2;
            if (vector.r < RADIUS / 4) {
                return;
            }
            // 象限区域
            var areia = getAreia(vector);
            // 角度区域
            var deg = getDegAreia(vector);
            if (deg == 1 && (areia == 1 || areia == 4))  {
                // Log.info("d");
                leftJoysStickKeyChannge(["KeyD"]);
            } else if (deg == 2 && areia == 1) {
                // Log.info("d + w");
                leftJoysStickKeyChannge(["KeyD", "KeyW"]);
            } else if (deg == 3 && (areia == 1 || areia == 2)) {
                // Log.info("w");
                leftJoysStickKeyChannge(["KeyW"]);
            } else if (deg == 2 && areia == 2) {
                // Log.info("w + a");
                leftJoysStickKeyChannge(["KeyW", "KeyA"]);
            } else if (deg == 1 && (areia == 2 || areia == 3)) {
                // Log.info("a");
                leftJoysStickKeyChannge(["KeyA"]);
            } else if (deg == 2 && areia == 3) {
                // Log.info("a + s");
                leftJoysStickKeyChannge(["KeyA", "KeyS"]);
            } else if (deg == 3 && (areia == 3 || areia == 4)) {
                // Log.info("s");
                leftJoysStickKeyChannge(["KeyS"]);
            } else if (deg == 2 && areia == 4) {
                // Log.info("s + d");
                leftJoysStickKeyChannge(["KeyS", "KeyD"]);
            }
        }
        function joysickTouchesPositionFn() {
            $('.center').css({
                left: joysickTouchesPosition.x + "px",
                top:  joysickTouchesPosition.y + "px",
            })
        }
        function onJoyStickStart(e) {
            // console.log(e)
            let p = { x: 0, y: 0 };
            // 通过旋转横屏时注意触摸的坐标系变换
            if (screenOrientation === 'landscape') {
                p.x = e.targetTouches[0].clientY - leftJoystickPosition().top;
                p.y = leftJoystickPosition().left - e.targetTouches[0].clientX;
            } else {
                p = singlePointRelativePosition(e.targetTouches[0], e.target);
            }
            if (p) {
                if(e.targetTouches[0].target.className.split(' ').indexOf('joystick-right')!==-1){
                    joysickTouchesPositionRight = p;
                    let vectorc = getLimitRelativeVectorRight(p.x, p.y);
                    setLimitTouchPositionRight(vectorc);
                    vectorRight = vectorc;
                } else {
                    joysickTouchesPosition = p;
                    let vectorc = getLimitRelativeVector(p.x, p.y);
                    setLimitTouchPosition(vectorc);
                    vector = vectorc;
                }
            }
        }
        function leftJoystickPosition() {
            if (screenOrientation === 'landscape') {
                return {
                    top: getMobliePixelWidth(48, mobilePixelUnit),
                    left: getMobliePixelWidth(255 + 48, mobilePixelUnit),
                };
            } else {
                return {
                    left: getMobliePixelWidth(48, mobilePixelUnit),
                    top: viewPort.height - getMobliePixelWidth(255 + 48, mobilePixelUnit),
                };
            }
        }
        /**
         * 获取手机端相对像素
         * ue图宽度 1340
         */
        function getMobliePixelWidth(px/*: number*/, mobilePixelUnit/*: number*/) {
            const ueWidth = 1340;
            return px / ueWidth * 100 * mobilePixelUnit;
        }
        /**
         * 获取相对移动的向量.
         * @param x 本地坐标x
         * @param y 本地坐标y
         * @return vector 方向：相对圆心的位置，大小：相对圆心距离，不超过半径
         */
        function getLimitRelativeVector(x, y) {
            const RADIUS = this.joystickElement.width / 2;
            // local x,y
            let rx   = x - RADIUS;
            let ry   = y - RADIUS;
            let absR = Math.sqrt(rx * rx + ry * ry);
            let r    = Math.min(absR, RADIUS);

            let dx   = rx / Math.abs(rx);
            let dy   = ry / Math.abs(ry);
            return {
                // 相对位移坐标
                rx: rx,
                ry: ry,
                r: r,
                // 本地绝对坐标
                ax: x,
                ay: y,
                // 方向坐标
                dx: dx,
                dy: dy
            };
        }
        function getLimitRelativeVectorRight(x, y) {
            const RADIUS = this.joystickElementRight.width / 2;
            // local x,y
            let rx   = x - RADIUS;
            let ry   = y - RADIUS;
            let absR = Math.sqrt(rx * rx + ry * ry);
            let r    = Math.min(absR, RADIUS);

            let dx   = rx / Math.abs(rx);
            let dy   = ry / Math.abs(ry);
            return {
                // 相对位移坐标
                rx: rx,
                ry: ry,
                r: r,
                // 本地绝对坐标
                ax: x,
                ay: y,
                // 方向坐标
                dx: dx,
                dy: dy
            };
        }
        /**
         * 根据相对移动的向量设置圆心位置。不会超过整个摇杆背景。
         */
        function setLimitTouchPosition(vector) {
            let res = {
                x: 0,
                y: 0,
            };
            const RADIUS = this.joystickElement.width / 2;
            let rx = vector.rx;
            let ry = vector.ry;
            if (vector.r >= RADIUS) {
                let deg = Math.atan(ry / rx);
                let isNegative = vector.dx;
                res.x = RADIUS + isNegative * vector.r * Math.cos(deg);
                res.y = RADIUS + isNegative * vector.r * Math.sin(deg);
            } else {
                res.x = vector.ax;
                res.y = vector.ay;
            }
            joysickTouchesPosition = res;
        }
        function setLimitTouchPositionRight(vectors) {
            let res = {
                x: 0,
                y: 0,
            };
            const RADIUS = this.joystickElementRight.width / 2;
            let rx = vectors.rx;
            let ry = vectors.ry;
            if (vectors.r >= RADIUS) {
                let deg = Math.atan(ry / rx);
                let isNegative = vectors.dx;
                res.x = RADIUS + isNegative * vectors.r * Math.cos(deg);
                res.y = RADIUS + isNegative * vectors.r * Math.sin(deg);
            } else {
                res.x = vectors.ax;
                res.y = vectors.ay;
            }
            joysickTouchesPositionRight = res;
        }
        // *********************左侧方向圆盘end***************************************************
        // *********************右侧方向圆盘start***************************************************
        $('.joystick-right').on('touchstart',handleMouseEvent)
        $('.joystick-right').on('touchmove',handleMouseEvent)
        $('.joystick-right').on('touchend',handleMouseEvent)
        // mugging mouse event
        function handleMouseEvent(e) {
            e.preventDefault();
            e.stopPropagation();

            var clientPosition = getMousePositon(e, e.target);
            var videoPoistion = {
                x: clientPosition.x - iframeSize.container.marginLeft,
                y: clientPosition.y - iframeSize.container.marginTop,
            };
            var appX = Math.round(videoPoistion.x * iframeSize.scale.scaleX);
            var appY = Math.round(videoPoistion.y * iframeSize.scale.scaleY);

            var mouseKey = "left";
            // switch (e.which) {
            //     case 1:
            //         mouseKey = 'left';
            //         break;
            //     case 2:
            //         mouseKey = 'right';
            //         break;
            //     case 3:
            //         mouseKey = 'mid';
            //         break;
            // }
            switch (e.type) {
                case 'touchstart':
                    touchStartTimeRight = Date.now();
                    touchedRight = true;
                    onJoyStickStart(e)
                    repeatPressRight(e);
                    poster.sendMouseDown(mouseKey, appX, appY);
                    break;
                case 'touchend':
                    touchedRight = false;
                    longPressedRight = false;
                    if (timeoutRight) {
                        window.clearTimeout(timeoutRight);
                    }
                    touchStartTimeRight = 0;
                    onJoyStickRightEnd(e)
                    poster.sendMouseUp(mouseKey, appX, appY);
                    break;
                case 'touchmove':
                    onJoyStickMoveRight(e)
                    poster.sendMouseMove(appX, appY,
                        lastAppPosition.x == 0 ? 0 : appX - lastAppPosition.x,
                        lastAppPosition.y == 0 ? 0 : appY - lastAppPosition.y);

                    lastAppPosition = {
                        x: appX,
                        y: appY,
                    }
                    break;
                default:
                    // skip other event. not emit
                    return;
            }
        }
        function onJoyStickRightEnd(e) {
            joysickTouchesPositionRight = {
                x: this.joystickElementRight.width / 2,
                y: this.joystickElementRight.height / 2,
            }
            vectorRight = null;
            joysickTouchesPositionRightFn()
        }
        function repeatPressRight(e) {
            if (touchedRight) {
                // check long press
                if (!longPressedRight && touchStartTimeRight != 0 && Date.now() - touchStartTimeRight > 1000) {
                    longPressedRight = true;
                }
                timeoutRight = window.setTimeout(() => {
                    onJoyStickRepeatRight(e)
                    repeatPressRight(e);
                }, 5);
            }
        }
        function onJoyStickRepeatRight(e) {
            if (vectorRight == null) {
                return;
            }
            var RADIUS = this.joystickElementRight.width / 2;
            if (vectorRight.r < RADIUS / 4) {
                return;
            }
            // 象限区域
            var areia = getAreia(vectorRight);
            // 角度区域
            var deg = getDegAreia(vectorRight);
            var clientPosition = getMousePositon(e, e.target);
            var videoPoistion = {
                x: clientPosition.x - iframeSize.container.marginLeft,
                y: clientPosition.y - iframeSize.container.marginTop,
            };
            var appX = Math.round(videoPoistion.x * iframeSize.scale.scaleX);
            var appY = Math.round(videoPoistion.y * iframeSize.scale.scaleY);
            lastAppPosition = {
                x: appX,
                y: appY,
            }
            if (deg == 1 && (areia == 1 || areia == 4))  {
                poster.sendMouseMove(appX, appY,30,0)
                // console.log("d");
            } else if (deg == 2 && areia == 1) {
                poster.sendMouseMove(appX, appY,30,30)
                // console.log("d + w");
            } else if (deg == 3 && (areia == 1 || areia == 2)) {
                poster.sendMouseMove(appX, appY,0,30)
                // console.log("w");
            } else if (deg == 2 && areia == 2) {
                poster.sendMouseMove(appX, appY,-30,30)
                // console.log("w + a");
            } else if (deg == 1 && (areia == 2 || areia == 3)) {
                poster.sendMouseMove(appX, appY,-30,0)
                // console.log("a");
            } else if (deg == 2 && areia == 3) {
                poster.sendMouseMove(appX, appY,-30,-30)
                // console.log("a + s");
            } else if (deg == 3 && (areia == 3 || areia == 4)) {
                poster.sendMouseMove(appX, appY,0,-30)
                // console.log("s");
            } else if (deg == 2 && areia == 4) {
                poster.sendMouseMove(appX, appY,50,-50)
                // console.log("s + d");
            }

        }
        function joysickTouchesPositionRightFn() {
            $('.center-right').css({
                left: joysickTouchesPositionRight.x + "px",
                top:  joysickTouchesPositionRight.y + "px",
            })
        }
        //*********************右侧方向圆盘end***************************************************
        // *********************other handle***************************************************
        $(".test-key").on("mousedown", function() {
            var key = $(this).attr('data');
            poster.sendKeyDown(key, false);
        });
        $(".test-key").on("mouseup", function() {
            var key = $(this).attr('data');
            poster.sendKeyUp(key);
        });
        $("#mouse-wheel-up").on('click', function() {
            poster.sendWheelUp(500, 500);
        });
        $("#mouse-wheel-down").on('click', function() {
            poster.sendWheelDown(500, 500);
        });
        $("#mouse-move").on('click', function() {
            poster.sendMouseMove(500, 500, 10, 10);
        });
        $("#mouse-left").on('mousedown', function() {
            poster.sendMouseDown('left', 500, 500);
        });
        $("#mouse-left").on('mouseup', function() {
            poster.sendMouseUp('left', 500, 500);
        });
        $("#mouse-right").on('mousedown', function() {
            poster.sendMouseDown('right', 500, 500);
        });
        $("#mouse-right").on('mouseup', function() {
            poster.sendMouseUp('right', 500, 500);
        });
        $("#mouse-mid").on('mousedown', function() {
            poster.sendMouseDown('mid', 500, 500);
        });
        $("#mouse-mid").on('mouseup', function() {
            poster.sendMouseUp('mid', 500, 500);
        });
        $(".test-scale-mode").on("click", function() {
            // mode 缩放模式值为： fit/cover/contain/fill_stretch
            var mod = $(this).attr('data');
            poster.setScaleMode(mod);
        });
        $(".test-mouse-mode").on("click", function() {
            // mode "true"/"false" 鼠标模式 true 为锁定模式，false 为自动判断模式
            var mod = $(this).attr('data');
            poster.setMouseMode(mod);
        });
        // 控制底部控制栏显示与隐藏
        $(".test-control-bar").on("click", function() {
            // show "true"/"false" 是否显示控制球
            var mod = $(this).attr('data');
            poster.setShowControlBall(mod);
        });
        // 控制玩家列表显示与隐藏
        $(".test-playerlist").on("click", function() {
            // show "true"/"false" 是否显示玩家列表
            var mod = $(this).attr('data');
            poster.setShowPlayerList(mod);
        });
        // 控制玩家列表分享按钮的显示与隐藏
        $(".test-shareurl").on("click", function() {
            // show "true"/"false" 是否显示分享连接
            var mod = $(this).attr('data');
            poster.setShowPlayerListShareUrl(mod);
        });
        // 控制手机端控制球显示与隐藏
        $(".test-mobile-control-ball").on("click", function() {
            // show "true"/"false" 手机端是否显示控制球
            var mod = $(this).attr('data');
            poster.setShowMobileControlBall(mod);
        });
        // 控制手机端摇杆显示与隐藏
        $(".test-mobile-joystick").on("click", function() {
            // show "true"/"false" 手机端是否显示摇杆
            var mod = $(this).attr('data');
            poster.setShowMobileJoystick(mod);
        });
        // 控制手机端虚拟键盘显示与隐藏
        $(".test-mobile-virtualkeyboard").on("click", function() {
            // "true"/"false" 是否显示虚拟键盘
            var mod = $(this).attr('data');
            poster.setShowMobileKeyboard(mod);
        });
        // 控制手机端虚拟鼠标显示与隐藏
        $(".test-mobile-virtualmouse").on("click", function() {
            // show "true"/"false" 是否显示菜单栏
            var mod = $(this).attr('data');
            poster.setShowMobileVritualMouse(mod);
        });
        // 控制手机端菜单显示与隐藏
        $(".test-mobile-menu").on("click", function() {
            // force "true"/"false" 是否强制横屏
            var mod = $(this).attr('data');
            poster.setShowMobileMenu(mod);
        });
        // 控制手机端是否强制横屏
        $(".test-mobile-forcelandscape").on("click", function() {
            // "true"/"false" 是否强制横屏
            var mod = $(this).attr('data');
            poster.setMobileForcelandscape(mod);
        });
        // 控制手机端是否显示触摸点
        $(".test-mobile-touchpoint").on("click", function() {
            var mod = $(this).attr('data');
            // "true"/"false" 是否显示触摸点
            poster.setMobileTouchPoint(mod);
        });
        // 是否启用警告框
        $(".test-alert").on("click", function() {
            var mod = $(this).attr('data');
            poster.setAlertEnable(mod);
        });
        // 是否启用确认框
        $(".test-confirm").on("click", function() {
            var mod = $(this).attr('data');
            poster.setConfirmEnable(mod);
        });
        // 设置 toast level
        $(".test-toast-level").on("click", function() {
            var mod = $(this).attr('data');
            poster.setToastLevel(mod);
        });
        // 通知客户端微信加载完成
        $(".test-wx-jsready").on("click", function() {
            poster.wxJsBridgeReady();
        });
        // 请求播放视频，当视频组件播放失败需要用户触发
        // 但禁用客户端内部alert 时调用
        $(".test-request-playvideo").on("click", function() {
            poster.requestPlayVideo();
        });
        // 请求截一张图
        // 截图成功后将通过 LK_USER_CAPTURE_FRAME 返回图片
        $(".test-capture-frame").on("click", function() {
            poster.requestCaptureFrame();
        })

        // *********************utils***************************************************
        /**
         * 获取某元素距离文档的距离
         * @param element 元素对象
         * @returns 高度
         */
         function getElementTop(element) {
            let actualTop = element.offsetTop;
            let current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        }
        /**
         * 获取元素距离文档左侧的距离
         * @param element 元素对象
         * @returns 左侧距离
         */
        function getElementLeft(element) {
            let actualLeft = element.offsetLeft;
            let current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        }
        /**
         * 获取鼠标相对元素的坐标
         * @param {*} e 鼠标回调事件
         * @param element dom 元素
         */
         function getMousePositon(e, element) {
            const offset  = getOffsetViewport(element);
            const clientX = e.changedTouches[0].clientX - offset.offsetX;
            const clientY = e.changedTouches[0].clientY - offset.offsetY;
            return {
                x: clientX,
                y: clientY,
            };
        }
        /**
         * 获取元素相对文档位置
         * @param element 元素对象
         * @returns { offsetX:X, offsetY:Y }
         */
        function getOffsetViewport(element) {
            // x
            const x = getElementLeft(element);
            // y
            const y = getElementTop(element);

            const offsetX = x - window.pageXOffset;

            const offsetY = y - window.pageYOffset;

            return {
                offsetX: offsetX,
                offsetY: offsetY
            };
        }
        /**
         * 深度拷贝对象,创建新对象
         * @param source 输入对象
         */
         function deepCopy(source) {
            const result = {};
            for (const key in source) {
                if (key) {
                    result[key] = source[key];
                }
            }
            return result;
        }
        /**
         * 获取浏览器窗口大小
         * @returns { width: 窗口宽, height: 窗口高 }
         */
        function viewport()/*: ViewPort*/ {
            if (document.compatMode === 'BackCompat') {
                return {
                    width: document.body.clientWidth,
                    height: document.body.clientHeight
                };
            } else {
                return {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                };
            }
        }

        window.removeEventListener('resize', resize())
	})();
    /**
     * 获取元素相对文档位置
     * @param element 元素对象
     * @returns { offsetX:X, offsetY:Y }
     */
    function offsetViewport(element/*: HTMLElement*/)/*: OffsetView*/ {
        // x
        const x = elementLeft(element);
        // y
        const y = elementTop(element);

        const offsetX = x - window.pageXOffset;

        const offsetY = y - window.pageYOffset;

        return {
            offsetX: offsetX,
            offsetY: offsetY
        };
    }

    /**
     * 获取某元素距离文档的距离
     * @param element 元素对象
     * @returns 高度
     */
     function elementTop(element/*: HTMLElement*/)/*: number*/ {
        let actualTop = element.offsetTop;
        let current = element.offsetParent/* as HTMLElement*/;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent/* as HTMLElement*/;
        }
        return actualTop;
    }
    /**
     * 获取元素距离文档左侧的距离
     * @param element 元素对象
     * @returns 左侧距离
     */
    function elementLeft(element/*: HTMLElement*/)/*: number*/ {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent/* as HTMLElement*/;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent/* as HTMLElement*/;
        }
        return actualLeft;
    }
    // /**
    //  * 获取 单触摸点/鼠标点击 相对元素的坐标
    //  */
    function singlePointRelativePosition(e/*: Touch|MouseEvent*/, element/*: HTMLElement*/)/*: Point*/ {
        const offset  = offsetViewport(element);
        return {
            x: e.clientX - offset.offsetX,
            y: e.clientY - offset.offsetY
        };
    }
    // 获取象限
    /**
     *          ^ -1
     *          |
     *      2   |   1
     * -1 ------|------> 1
     *          |
     *      3   |    4
     *          | 1
     */
    function getAreia(vector) {
        if (vector.dx == 1 && vector.dy == -1) {
            return 1;
        } else if (vector.dx == -1 && vector.dy == -1) {
            return 2;
        } else if (vector.dx == -1 && vector.dy == 1) {
            return 3;
        } else if (vector.dx == 1 && vector.dy == 1) {
            return 4;
        }
    }
    // 获取角度区域
    function getDegAreia(vector) {
        let deg = Math.atan(vector.ry / vector.rx) * 180 / Math.PI;
        let absDeg = Math.abs(deg);
        if (absDeg <= 22.5) {
            // Log.info("deg h", deg, vector.dx, vector.dy);
            return 1;
        } else if (absDeg > 22.5 && absDeg <= 67.5) {
            // Log.info("deg center", deg, vector.dx, vector.dy);
            return 2;
        } else {
            // Log.info("deg up", deg, vector.dx, vector.dy);
            return 3;
        }
    }
    function joinParam(params){
	    var res = '';
	    for (const i in params) {
	        if (i) {
	            res += i + '=' + params[i] + '&';
	        }
	    }
	    return res;
    };
});
