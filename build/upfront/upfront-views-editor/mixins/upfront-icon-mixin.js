!function(){define([],function(){return{get_icon_html:function(t,i){if(!t)return"";if(t.match(/^https?:\/\//)){var n={src:t,alt:"","class":"upfront-field-icon-img"};return"<img "+this.get_field_attr_html(n)+" />"}var r=["upfront-field-icon"];return i?(r.push(i),r.push(i+"-"+t)):r.push("upfront-field-icon-"+t),'<i class="'+r.join(" ")+'"></i>'}}})}();