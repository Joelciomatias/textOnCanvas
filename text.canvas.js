
/**
* TextOnCanvas 
*
* @category  canvas lib
* @author    Joelcio Matias
* @license   
*/

"use strict";

window._textCanvas = typeof _textCanvas !== "undefined" ? _textCanvas : {};

window._textCanvas = (function(target,options,callback) {
    
    return {
        
        init: function(target,options,callback) {
            
            var self = this;            
            var messages = []
            var canvasOffLeft=null;
            var canvasOffTop=null;
            var posX=null;
            var posY=null;
            
            var element = document.getElementById(target) || document.getElementsByClassName(target)[0] || document.getElementsByName(target)[0];
            
            var text_css = {
                border: 'none',
                visibility: 'visible',
                margin: 0,
                padding: 0,
                position: 'absolute',
                'z-index':9999,
                top: 0,
                xAjustClick:0,
                yAjustClick:0,
                xAjust:0,
                yAjust:0,
                left: 0,
                background: 'none',
                color: 'black',
                'font-size': '24px',
                'font-family': 'serif',
                padding: '2px',
                height: '24px',
                width: '20px',
                overflow: 'hidden',
                outline: 'none',
                'box-shadow': 'none',
                '-moz-box-shadow': 'none',
                '-webkit-box-shadow': 'none',
                'resize': 'none'
            };
            
            var settings = $.extend(text_css, options);
            
            this.mouseAbs = (e) => {  
                return [e.pageX, e.pageY];
            };
            
            element.ondblclick = (ev) => {              
                this.newTextArea(ev);
            }
            
            $('.'+target).dblclick(function(e) {
                canvasOffLeft = $(this).offset().left;
                canvasOffTop = $(this).offset().top;
                posX = e.pageX - ($(this).offset().left);
                posY = e.pageY - ($(this).offset().top);
            });
            
            this.draw = (text,ev,callback) => {
                let splited = text.value.split('\n');
                console.log(splited);
                var textAreaMinWidth = parseInt(settings.width.replace(/[^0-9\.]+/g,''));
                textAreaMinWidth -= textAreaMinWidth/4;
                var finalx = $("#newTextAreaC").offset().left - canvasOffLeft;
                var finaly = ($('#newTextAreaC').offset().top - canvasOffTop) + ($('#newTextAreaC').height() * .65);
                
                //ajustes para não sair para fora do canvas
                finalx = finalx < 0 ? 0 : finalx;
                finalx = (finalx + $('#newTextAreaC').width()) > element.width ?
                ((element.width - $('#newTextAreaC').width())+textAreaMinWidth) : finalx;
                finaly = finaly < 0 ? 0 : finaly;
                finaly = finaly > element.height ? element.height : finaly;
                
                finalx += settings.xAjust;
                finaly += settings.yAjust;
                
                var ctx = element.getContext('2d');
                ctx.font = text_css["font-size"]+' '+text_css["font-family"];
                ctx.fillStyle = text_css.color;
                console.log(ctx.measureText(text.value));
                var lineheigth = parseInt(settings.height.replace(/[^0-9\.]+/g,''));
                
                console.log(text);
                if(splited.length > 1) {
                    let line = lineheigth*(-1);
                    for (let i = 0; i < splited.length; i++) {
                        ctx.fillText(splited[i],finalx,finaly+line);   
                        line += lineheigth;
                    }
                } else {
                    ctx.fillText(splited[0],finalx,finaly);   
                }
                
                if(typeof(callback) == 'function') callback(text);
            }
            
            this.resizeTextArea = (e,textArea) => {
                
                var span = document.getElementById('helperSpan');
                if(span == null){
                    span = document.createElement('span');
                    span.id = 'helperSpan';
                }
                var innerHTML = textArea.value+'...';
                var innerHTML = innerHTML.replace(/\n/g, '<br />');
                
                if(e.keyCode == 13) {
                    innerHTML += '<br />...';
                }
                span.innerHTML = innerHTML;
                span.style.display = 'none';
                span.style["font-color"] = 'black';
                span.style["word-wrap"] = 'break-word';
                span.style["white-space"] = 'normal';
                span.style["font-family"] = textArea.style["font-family"] == "" ? 'monospace' : textArea.style["font-family"];
                span.style["font-size"] = textArea.style["font-size"]
                span.style["line-height"] = textArea.style["line-height"] == "" ? 'normal' : textArea.style["line-height"];
                span.style["min-height"] = '12px';    
                var body = document.getElementsByTagName('body')[0];
                body.parentNode.insertBefore(span, body.nextSibling);
                
                //TODO, TIRAR DO JQUERY
                textArea.style.height = $(span).height() + 6 +'px';
                textArea.style.width = $(span).width() + 10 + 'px';
                
            }
            
            this.newTextArea = (clickEvent) => {
                //removeEmpty();
                self.removeTextArea(0);
                
                var textArea = document.createElement('textarea');
                textArea = self.setStyle(textArea,settings);
                textArea.id = 'newTextAreaC'
                var position = self.mouseAbs(clickEvent)
                textArea.style.left = ((position[0] - $(textArea).width())+settings.xAjustClick)+ 'px';
                textArea.style.top = ((position[1] - $(textArea).height())+settings.yAjustClick)+ 'px';
                
                element.parentNode.insertBefore(textArea, element.nextSibling);
                
                textArea.onpaste = (e)=> {
                    //TODO ARRUMAR O COLA DE TEXTO
                    self.resizeTextArea(e,textArea);
                };
                textArea.onkeydown = (e)=> {
                    self.resizeTextArea(e,textArea);
                };
                textArea.onfocus = () =>{
                    textArea.style.border = '1px dotted #cccccc';
                };
                textArea.onblur = (e)=> {
                    self.draw(textArea,clickEvent,function(textArea){
                        
                        if(textArea.value.length > 0 ) {console.log('Escreveu: '+textArea.value);}
                        
                    });
                    textArea.style.border = 'none';
                    textArea.style.display = 'none';
                };
                
                textArea.focus();
                messages.push(textArea);
                
            }
            
            this.setStyle = (elem, styleSettings) => {
                for (var property in styleSettings){
                    elem.style[property] = styleSettings[property];
                }
                return elem;
            }
            
            this.removeTextArea = (index) => {    
                var elem = messages[index]
                if(elem && elem.parentNode){
                    
                    if ($(elem).length > 0) {
                        $(elem).remove();
                    }
                }
                messages.splice(index, 1); 
            };
            
            this.removeEmpty = () => {
                messages.forEach(function(message,index){
                    if(message.value == ''){
                        self.removeTextArea(index);
                    } else if(message.value.length > 0) {
                        //draw(currentTextArea,lastClickEvent);
                    }
                });
            }
            
            this.handleEsc = (e) => {
                if(e.keyCode == 27) {
                    self.removeTextArea(messages.length-1);
                }
            };
            
            document.onkeydown = (e) => {
                self.handleEsc(e);
            };
        }
    }
}());