!function(e){Upfront.mainData.isRTL&&e.widget("ui.slider",e.ui.slider,{_handleEvents:{keydown:function(i){var t,a,s,n,o=e(i.target).data("ui-slider-handle-index");switch(i.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(i.target).addClass("ui-state-active"),t=this._start(i,o),t===!1))return}switch(n=this.options.step,a=s=this.options.values&&this.options.values.length?this.values(o):this.value(),i.keyCode){case e.ui.keyCode.HOME:s=this._valueMin();break;case e.ui.keyCode.END:s=this._valueMax();break;case e.ui.keyCode.PAGE_UP:s=this._trimAlignValue(a+(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.PAGE_DOWN:s=this._trimAlignValue(a-(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.UP:if(a===this._valueMax())return;s=this._trimAlignValue(a+n);break;case e.ui.keyCode.RIGHT:if(a===this._valueMax())return;s=this._trimAlignValue(a+-n);break;case e.ui.keyCode.DOWN:if(a===this._valueMin())return;s=this._trimAlignValue(a-n);break;case e.ui.keyCode.LEFT:if(a===this._valueMin())return;s=this._trimAlignValue(a- -n)}this._slide(i,o,s)},keyup:function(i){var t=e(i.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(i,t),this._change(i,t),e(i.target).removeClass("ui-state-active"))}},_normValueFromMouse:function(e){var i,t,a,s,n;return"horizontal"===this.orientation?(i=this.elementSize.width,t=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(i=this.elementSize.height,t=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),a=t/i,a>1&&(a=1),a<0&&(a=0),a=1-a,s=this._valueMax()-this._valueMin(),n=this._valueMin()+a*s,this._trimAlignValue(n)},_refreshValue:function(){var i,t,a,s,n,o=this.options.range,l=this.options,r=this,u=!this._animateOff&&l.animate,h={};if(this.options.values&&this.options.values.length)this.handles.each(function(a){t=(r.values(a)-r._valueMin())/(r._valueMax()-r._valueMin())*100,h["horizontal"===r.orientation?"left":"bottom"]=t+"%",e(this).stop(1,1)[u?"animate":"css"](h,l.animate),r.options.range===!0&&("horizontal"===r.orientation?(0===a&&r.range.stop(1,1)[u?"animate":"css"]({left:t+"%"},l.animate),1===a&&r.range[u?"animate":"css"]({width:t-i+"%"},{queue:!1,duration:l.animate})):(0===a&&r.range.stop(1,1)[u?"animate":"css"]({bottom:t+"%"},l.animate),1===a&&r.range[u?"animate":"css"]({height:t-i+"%"},{queue:!1,duration:l.animate}))),i=t});else{a=this.value(),s=this._valueMin(),n=this._valueMax(),t=n!==s?(a-s)/(n-s)*100:0;var c=t;"horizontal"===this.orientation&&(c=100-t),h["horizontal"===this.orientation?"left":"bottom"]=c+"%",this.handle.stop(1,1)[u?"animate":"css"](h,l.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[u?"animate":"css"]({width:t+"%"},l.animate),"max"===o&&"horizontal"===this.orientation&&this.range[u?"animate":"css"]({width:100-t+"%"},{queue:!1,duration:l.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[u?"animate":"css"]({height:t+"%"},l.animate),"max"===o&&"vertical"===this.orientation&&this.range[u?"animate":"css"]({height:100-t+"%"},{queue:!1,duration:l.animate})}}}),e.cssHooks.backgroundColor={set:function(i,t){return t.indexOf("ufc")===-1?void(i.style.backgroundColor=t):(i.style.backgroundColor=Upfront.Util.colors.get_color(t),e(i).data("ufc",t),void e(i).data("ufc_rule","backgroundColor"))}},e.cssHooks.color={set:function(i,t){return t.indexOf("ufc")===-1?void(i.style.color=t):(i.style.color=Upfront.Util.colors.get_color(t),e(i).data("ufc",t),void e(i).data("ufc_rule","color"))}}}(jQuery);