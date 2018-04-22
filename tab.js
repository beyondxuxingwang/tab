; (function ($) {

    var Tab = function (tab) {
        //保存自身
        var _this = this;
        // 保存单个tab组件
        this.tab = tab;
        //默认配置参数，如果有人工配置参数传递过来，就把这个默认参数替换掉
        this.config = {
            //用来定义鼠标的触发类型，是click还是mouseover 
            "triggerType": "mouseover",
            // 用来定义内容切换效果是直接切换还是淡入淡出 默认直接切换
            "effect": "default",
            // 默认展示第几个tab ，默认1
            "invoke": 1,
            // 定义tab自动切换,默认不切换
            "auto": false
        };
        // 如果人工配置参数存在，就扩展替换掉默认的配置参数
        if (this.getConfig()) {
            // 使用jqextend 方法进行扩展
            $.extend(this.config, this.getConfig());
        }
        console.log(this.getConfig());
        // 保存tab标签列表，对应的内容列表
        // 我们在保存的tab栏
        this.tabItems = this.tab.find("ul.tab-nav li"); // 
        // 对应的现实区域
        this.contentItems = this.tab.find("div.content-wrap div.content-item")

        var config = this.config;

        // 绑定事件
        // 判断是默认的鼠标移入还是人工绑定的扩展事件
        if (config.triggerType === "click") {
            this.tabItems.on(config.triggerType, function () {
                _this.invoke($(this));

            });
            // 如果不是click 但是单词写错了默认执行mouseover事件
        } else if (config.triggType === "mouseover" || config.triggerType != "click") {
            this.tabItems.mouseover(function () {
                _this.invoke($(this));
            });
        }
        // 自动切换
        if (config.auto) {
            //定义一个全局的定时器
            this.timer = null;
            //定义一个计数器
            this.loop = 0;

            this.autoPlay();
            // 鼠标移入这个区域时，我们清除掉自动播放。当我们鼠标再次移除的时候，继续执行自动切换函数
            this.tab.hover(function(){
                window.clearInterval(_this.timer)
            },function () {
                this.autoPlay();
            })
        };
        // 设置默认显示第几个tab
        // invoke 大于1的情况下才执行这个操作
        if (config.invoke > 1) {
            this.invoke(this.tabItems.eq(config.invoke-1));  
        };



    };
    Tab.prototype = {
        //自动切换
        autoPlay: function () {
            var _this = this,
                tabItems = this.tabItems,
                tabLength = tabItems.size(),
                config = this.config;
            this.timer = window.setInterval(function(){
                _this.loop++;

                if (_this.loop >= tabLength) {
                    _this.loop = 0;
                };
                tabItems.eq(_this.loop).trigger(config.triggerType);
            },config.auto);

        },
        // 事件驱动函数
        invoke: function (currentTab) {
            var _this = this;
            /**
             * 要执行tab的选中状态，当前选中的加上actived 标记为白色底部
             * 切换对应的tab 内容，要根据配置参数的effect是default 还是fade
             *
            */
            // 1 tab选中状态 
            currentTab.addClass("actived").siblings().removeClass("actived");
            //2 获取索引值      
            var index = currentTab.index();
            // 获取效果是default 还是fade 的淡入淡出效果
            var effect = this.config.effect;
            var conItems = this.contentItems;

            if (effect === "default" || effect != "fade") {
                conItems.eq(index).addClass("current").siblings().removeClass('current');
            } else if (effect === "fade") {
                conItems.eq(index).fadeIn().siblings().fadeOut();
            };
            //  注意： 如果配置了启动切换，记得把当前的loop的值设置成当前tab的index
            // 如果设置了自动切换
            if(this.config.auto){
                this.loop = index;
            }



        },
        // 获取配置参数
        getConfig: function () {
            // 获取人工tab。 elem 节点上的data-config
            var config = this.tab.attr('data-config');
            // console.log(config);
            // 确认有配置参数的情况下，
            // 如果config 存在并且不为空的情况下
            if (config && config != "") {
                // 转译成对象返回出去
                return $.parseJSON(config);
            } else {
                return null;
            }


        }
    };
    //  类中有一个初始化的函数
    Tab.init=function (tabs) {
        var _this = this;
        tabs.each(function () {  
            new _this($(this));
        });
    }

    //  注册成jq 方法
    $.fn.extend({
        tab:function () {  
            this.each(function () {  
                new Tab($(this));
            });
            return this;// 返回之后我们就可以使用链式调用了
        }
    });
    window.Tab = Tab;
})(jQuery);

/*
1通过匿名函数自执行的方式来封装一个tab类
2第一定义一个Tab 自执行函数，prototype 写上
3最后我们把tab 注册当wind对象上，用来在这个匿名函数空间之外可以访问到
函数内部的变量等等

一个类默认的配置参数 和 人工设置参数扩展 




**/