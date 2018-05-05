//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

import stage = egret.lifecycle.stage;

declare function playsound(sound, loop);

class Main extends egret.DisplayObjectContainer {


    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;
    private mygroup: egret.Sprite;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
                // console.log('hello,world')
            }
        });

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };


        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.

        this.mygroup = new egret.Sprite();
        //this.mygroup.alpha = 0;
        this.addChild(this.mygroup);

        let chanl: egret.SoundChannel;

        RES.getResAsync("wenzi_json", this.startAnimation, this);
        // RES.getResAsync("description_json", this.startAnimation, this);
        let music_sprite = this.createBitmapByName("music_png");
        let sprite = new egret.Sprite();
        sprite.addChild(music_sprite);
        sprite.anchorOffsetX = 33;
        sprite.anchorOffsetY = 33;
        sprite.x = this.stage.stageWidth - 40;
        sprite.y = 40;
        sprite.touchEnabled = true;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            return;
            // this.isSound = !this.isSound;
            // if (this.isSound == false) {
            //     sprite.rotation = 0;
            //     // this.gameSound.close();
            //     if (chanl) {
            //         chanl.volume = 0;
            //     }
            //
            // } else {
            //     // this.gameSound.play();
            //     if (this.gameSound == null) {
            //         let nullSound: egret.Sound = RES.getRes("demo_mp3");
            //         playsound(nullSound, false);
            //
            //         //this.gameSound = RES.getRes("demo_mp3");
            //         // this.gameSound.play(0, -1);
            //         //chanl = this.gameSound.play(0, -1);
            //     }
            //     // chanl.volume = 1;
            //
            // }
        }, this);
        this.addEventListener(egret.Event.ENTER_FRAME, () => {
            if (this.isSound) {
                sprite.rotation++;
            } else {

            }
        }, this);
        //
        this.addChild(sprite);
        // this.gameSound = RES.getRes("demo_mp3");
        // this.gameSound.play(0, -1);
        //chanl = this.gameSound.play(0, -1);
        let nullSound: egret.Sound = RES.getRes("demo_mp3");
        // nullSound.play();
        playsound(nullSound, false);
    }

    isSound: boolean = true;
    gameSound: egret.Sound;


    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public gamecount: number = 0;

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[][]) {
        let parser = new egret.HtmlTextParser();

        let demodata: string[] = result[this.gamecount];
        let textflowArr = demodata.map(text => parser.parse(text));


        let textfield = this.textfield;
        let count = 0;

        let b_y: number = 300;
        //
        let change = () => {
            count++;


            if (count >= textflowArr.length) {
                //换个片源
                count = 1;
                this.gamecount++;
                demodata = result[this.gamecount];
                if (demodata == null) {
                    console.log("播放完毕了")
                    return;
                }
                textflowArr = demodata.map(text => parser.parse(text));
                this.mygroup.removeChildren();
                b_y = 300;
            }


            let textFlow = textflowArr[count];


            let colornum: number = parseInt(demodata[0]);
            this.mygroup.graphics.clear();
            this.mygroup.graphics.beginFill(colornum);
            this.mygroup.graphics.drawRect(0, 0, 1000, 1240);
            this.mygroup.graphics.endFill();

            // 切换描述内容
            // Switch to described content
            textfield = new egret.TextField();
            this.mygroup.addChild(textfield);
            // console.log("textFlow:", textFlow);
            textfield.textFlow = textFlow;
            textfield.fontFamily = "微软雅黑";
            textfield.width = this.stage.stageWidth;
            textfield.textAlign = egret.HorizontalAlign.CENTER;
            textfield.y = b_y;
            //最后y的坐标
            let f_y: number = b_y;
            b_y += textfield.height + 20;
            // textfield.fontFamily = "宋体";
            // textfield.size = 50;
            textfield.alpha = 0;
            textfield.y += 20;
            let tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1, y: f_y}, 400);
            tw.wait(2000);
            //tw.to({"alpha": 0}, 200);
            tw.call(change, this);
        };

        change();
    }
}


