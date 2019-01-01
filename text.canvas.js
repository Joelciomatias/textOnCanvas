/**
* TextOver lib.
*
* @category  
* @author    Joelcio Matias
* @license   
*/
window._textCanvas = typeof _textCanvas !== "undefined" ? _textCanvas : {};

window._textCanvas = (function(target,options,callback) {
    
    return {
        
        init: function(target,options,callback) {
            
            var self = this;            
            var messages = []
            var lastClickEvent;
            var currentTextArea;
            
            var element = document.getElementById(target) || document.getElementsByClassName(target)[0] 
            || document.getElementsByName(target)[0];
            
            var text_css = {
                border: 'none',
                visibility: 'visible',
                margin: 0,
                padding: 0,
                position: 'absolute',
                top: 0,
                xAjust:8.5,
                yAjust:41.5,
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
            //TODO, TIRAR DO JQUERY
            var settings = $.extend(text_css, options);
            
            var mouseAbs = function(e) {  
                return [e.pageX, e.pageY];
            };
            
            element.onclick = function(ev) {
                self.newTextArea(ev);
            }
            
            function draw(text,ev,callback) {
                var ctx = element.getContext('2d');
                ctx.font = text_css["font-size"]+' '+text_css["font-family"];
                ctx.fillStyle = text_css.color;     
                var rect = canvas.getBoundingClientRect();
                ctx.fillText(text.value,
                    (ev.clientX - rect.left) + settings.xAjust,
                    (ev.clientY - rect.top) + settings.yAjust
                    );
                ctx.restore();
                if(typeof(callback) == 'function') callback(text);
            }

            var resizeTextArea = function(e,textArea,ev){
                
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
                body = document.getElementsByTagName('body')[0];
                body.parentNode.insertBefore(span, body.nextSibling);

                //TODO, TIRAR DO JQUERY
                textArea.style.height = $(span).height() + 6 +'px';
                textArea.style.width = $(span).width() + 10 + 'px';
                
            }
            
            this.newTextArea = function(ev) {
                removeEmpty();
                lastClickEvent = ev;
                var textArea = document.createElement('textarea');
                textArea = setStyle(textArea,settings);
                position = mouseAbs(ev)
                textArea.style.left = position[0]+'px';
                textArea.style.top = position[1]+'px';
                element.parentNode.insertBefore(textArea, element.nextSibling);
                textArea.onpaste = function(e) {
                    //TODO ARRUMAR O COLA DE TEXTO
                    resizeTextArea(e,textArea);
                };
                textArea.onkeydown = function(e) {
                    resizeTextArea(e,textArea,ev);
                };
                textArea.onfocus = function() {
                    textArea.style.border = '1px dotted #cccccc';
                };
                textArea.onblur = function() {
                    draw(currentTextArea,lastClickEvent,function(textArea){
                        removeTextArea(0);
                        
                    });
                    textArea.style.border = 'none';
                    textArea.style.display = 'none';
                };
                textArea.focus();
                currentTextArea = textArea;
                messages.push(textArea);
                
            }
            
            var setStyle =  function(elem, styleSettings){
                for (var property in styleSettings){
                    elem.style[property] = styleSettings[property];
                }
                return elem;
            }
            
            var removeTextArea = function(index) {    
                var elem = messages[index]
                if(elem.parentNode){
                    elem.parentNode.removeChild(elem);
                }
                messages.splice(index, 1); 
            };
            
            var removeEmpty = function() {
                messages.forEach(function(message,index){
                    if(message.value == ''){
                        removeTextArea(index);
                    } else if(message.value.length > 0) {
                        draw(currentTextArea,lastClickEvent);
                    }
                });
            }
            
            var handleEsc = function(e) {
                if(e.keyCode == 27) {
                    removeTextArea(messages.length-1);
                }
            };
            
            document.keydown = function(e){
                handleEsc(e);
            };
        }
    }
}());