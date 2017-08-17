(function($) {
    $.fn.extend({
        "selectInfoTip": function(url) {
            var v = {
                t: this,
                v: [],
            }
            $.getJSON(url, function(data) {
                var loadWeb = {
                    //渲染车辆输入框的函数 
                    other: function() {
                        $.map(v.t, function(item, index) {
                            var infoIndex = $('.select-info-tip.tipshow-info').length; //0 1 2
                            $(item).addClass(data.addClass); // 空类名
                            $(item).after('<div class="select-info-tip tipshow-info" style="height:300px;"stor="' + infoIndex + '"></div>'); //input添加一个div标签 有索引为stor 0开始
                            $(item).next().append($(item)); //将input append到新添加的div中
                            v.v['info' + infoIndex] = data;
                        });
                    },
                    //控制下拉菜单显示隐藏的函数
                    onfocus: function() {
                        $(".select-info-cont").css('display', 'block');
                    },
                    onblur: function() {
                        $(".select-info-cont").css('display', 'none');
                    },
                    //创建 车辆信息列表
                    creaH: function(data) {
                        var ht = '';
                        ht += '<div class="select-info-cont" style="display:none">';
                        ht += '<div class="select-info-left"><div class="select-info-show"><input class="select-info-btn" type="checkbox"><span>仅显示本时间段可用车辆</span></div></div>';
                        ht += '<div class="select-info-right"></div>';
                        ht += '</div>';
                        console.log(typeof v.t);
                        console.log(v.t);
                        // console.log(typeof v.v);
                        // console.log(v.v);
                        v.t.after(ht);

                        //车辆列表
                        var htc = '';
                        htc += '<div class="select-list-cont">';
                        $.map(data.result, function(item, index) {
                            htc += '<div class="select-info-list" data-index="' + index + '">';
                            htc += '<span class="select-info-text" title="' + item.text + '">' + item.text + '</span>';
                            htc += '<span class="select-info-check" data-index="' + index + '">选用</span>';
                            htc += '</div>';
                        });
                        htc += '</div>';
                        v.t.next().find('.select-info-left').append(htc);
                    },
                    //点击车辆列表中的某个节点 切换车辆信息
                    onClick: function(config, other) {
                        if (config['info' + other.thisPar.attr('stor')]) {
                            var rightBox = other.thisPar.find('.select-info-right');
                            rightBox.children().remove();
                            if (other.btn) {
                                loadWeb.checked(config, other); //选用
                                // console.log(other.thisInputValue);
                                loadWeb.onblur();
                                console.log('选用按钮被点击了！');
                                // e.stopPropagation();
                                return other.thisInputValue;
                            } else {
                                console.log('选用按钮没有被点击了！')
                                var htr = '';
                                var jb = config['info' + other.thisPar.attr('stor')].result[other.this_.attr('data-index')];
                                other.this_.parents('.select-info-cont').find('.select-info-list').removeClass('active');
                                other.this_.addClass('active');
                                htr += '<div class="head-info">';
                                htr += '<div><span class="tip-text">' + jb.plate + '</span><span class="tip-state">(' + jb.state + ')</span></div>';
                                htr += '<div><span class="vehicle-other">座位数：</span><span>' + jb.seat + '</span> <span class="vehicle-stop vehicle-other">停车点：</span><span>' + jb.parking + '</span></div>';
                                htr += '<div></div>';
                                htr += '</div>';
                                htr += '<div class="vehicle-usage">';
                                htr += '<div class="vehicle-usageed">预约用车情况：</div>';
                                htr += '<div class="vehicle-list-item">';
                                $.map(jb.info, function(item, index) {
                                    htr += '<div class="vehicle-list">';
                                    htr += '<div><span class="vehicle-user">' + item.user + '</span>预约车辆</div>';
                                    htr += '<div><span>' + item.start + '</span> ~ <span>' + item.end + '</span></div>';
                                    htr += '</div>';
                                });
                                htr += '</div>';
                                htr += '</div>';
                                htr += '';
                                rightBox.append(htr);
                            }
                            // $("div.select-info-tip.tipshow-info *").not(".selectInfoTip,.select-info-cont").click(function() {
                            //     f.onblur();
                            // })
                        }

                    },
                    //选定某个车辆事件
                    checked: function(config, other) {
                        // console.log(other.thisValue);
                        // console.log(other.thisInputValue);
                        other.thisInputValue = other.thisValue;
                        // console.log(other.thisInputValue);
                    },
                    //勾选本时段选择框 切换可用车辆信息
                    onInputCan: function(data) {
                        if ($(".select-info-btn").prop("checked") == true) {
                            //匹配本时间段可用车辆
                            var checkedTimeState = "2017/8/16 8:30";
                            var checkedTimeEnd = "2017/8/17 12:00";
                            var allTime = [];
                            var newAllTime = [];
                            var newDataResult = {
                                "addClass": "",
                                "disabled": false,
                                "defaultVal": "",
                                "result": []
                            };
                            var a1 = new Date(checkedTimeState).getTime();
                            var a2 = new Date(checkedTimeEnd).getTime();
                            for (var i = 0; i < data.result.length; i++) {
                                var c = true;
                                $.map(data.result[i].info, function(item) {
                                    console.log(item); //每个用户对象
                                    allTime.push(item);
                                    //现获取时间的毫秒值
                                    b1 = (new Date(item.start.replace(new RegExp("-", "gm"), "/"))).getTime();
                                    b2 = (new Date(item.end.replace(new RegExp("-", "gm"), "/"))).getTime();
                                    //每辆车只要有一个用户预约了该车辆的时段和本时段冲突 就不能在本时段预约该车辆了。
                                    if (((b1 <= a1) && (a1 <= b2) && (a2 >= b2)) || ((b1 <= a2) && (a2 <= b2) && (a1 <= b1)) || ((a1 <= b1) && (a2 >= b2)) || ((a1 > b1) && (a2 < b2))) {
                                        //如果与本时段冲突的车辆 就不push到新数据数组中
                                        return c = false;
                                    }
                                })
                                if (c == true) {
                                    // console.log(data.result[i] instanceof newDataResult.result);
                                    console.log(JSON.stringify(newDataResult.result).indexOf(JSON.stringify(data.result[i])) == -1);
                                    //如果为true的话 就是这个对象在数组里没有存在
                                    if (JSON.stringify(newDataResult.result).indexOf(JSON.stringify(data.result[i])) == -1) {
                                        newDataResult.result.push(data.result[i]);
                                    }
                                }

                            }
                            console.log(newDataResult.result);

                            loadWeb.getCarlist(newDataResult.result);

                        } else {
                            loadWeb.getCarlist(data.result);
                        }
                    },
                    //生成车辆列表的方法
                    getCarlist: function(result) {
                        $('.select-list-cont').html("");
                        //车辆列表
                        var htc = '';
                        $.map(result, function(item, index) {
                            htc += '<div class="select-info-list" data-index="' + index + '">';
                            htc += '<span class="select-info-text" title="' + item.text + '">' + item.text + '</span>';
                            htc += '<span class="select-info-check" data-index="' + index + '">选用</span>';
                            htc += '</div>';
                        });
                        v.t.next().find('.select-info-left').find('.select-list-cont').html(htc);
                    }

                };
                //利用事件冒泡机制实行 事件委托
                $(window.document).on('click', '.select-info-list', function(e) {
                    var this_ = $(this);
                    var thisPar = this_.parents('.select-info-tip.tipshow-info');
                    loadWeb.onClick(v.v, { thisPar: thisPar, this_: this_, btn: false });
                    e.stopPropagation();
                });
                $(window.document).on('click', '.select-info-check', function(e) {
                    var this_ = $(this);
                    var thisPar = this_.parents('.select-info-tip.tipshow-info');
                    var thisInputValue = thisPar.find('input:first-child').attr('value');
                    // console.log(thisInputValue);
                    var thisValue = this_.prev('.select-info-text').attr('title');
                    thisInputValue = loadWeb.onClick(v.v, { thisPar: thisPar, thisInputValue: thisInputValue, thisValue: thisValue, this_: this_, btn: true });
                    // console.log(thisInputValue);
                    thisPar.find('input:first-child').attr('value', thisInputValue);
                    e.stopPropagation();
                });
                $(window.document).on('focus', '.selectInfoTip', function(e) {
                    loadWeb.onfocus()
                    console.log($(this))
                    e.stopPropagation();
                });


                $(window.document).on('click', function(e) {
                    if (e.target != $('.selectInfoTip')[0] && $(e.target).parents('.select-info-cont')[0] != $('.select-info-cont')[0]) {
                        $('.select-info-cont').css('display', 'none');
                    }
                });
                $(window.document).on('click', ".select-info-btn", function(e) {
                    loadWeb.onInputCan(data);
                });
                loadWeb.other();
                loadWeb.creaH(data);

            })
        }
    })
})(jQuery)