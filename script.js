    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    
    var clear = document.getElementById('clear').onclick = clearImg;
    
    var loaded = null;
    var sampleSrc = 'https://unsplash.it/750/450/?random';
    
    var canvas = document.getElementsByClassName('canvasTarget')[0];
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.crossOrigin="anonymous";
    
    window.addEventListener('load', DrawPlaceholder(img));
    
    // show x & y axis
    canvas.onmousemove = function(ev){
        var sp1 = document.getElementById('corX');
        var sp2 = document.getElementById('corY');
        sp1.innerHTML = 'cordenada X: '+ev.pageX;
        sp2.innerHTML = 'cordenada Y: '+ev.pageY;
    }
    function DrawPlaceholder(img) {
        img.onload = function() {
            DrawOverlay(img);
        };
        img.src = loaded || sampleSrc;
    }
    function handleImage(e) {
        var reader = new FileReader();
        var img = "";
        var src = "";
        reader.onload = function(event) {
            img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }
            img.src = event.target.result;
            
            src = event.target.result;
            loaded = src;
            canvas.classList.add("show");
            DrawOverlay(img);   
        }
        reader.readAsDataURL(e.target.files[0]); 
        init();
    }
    function DrawOverlay(img) {
        ctx.drawImage(img,0,0);
        ctx.fillStyle = 'rgba(32, 144, 255, 0.0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }   
    function download() {
        var url = canvas.toDataURL('png').replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
        window.open(url);
    }
    
    function clearImg(){
        var img = new Image();
        img.crossOrigin="anonymous";
        img.onload = function() {
            DrawOverlay(img);
        };
        img.src = loaded || sampleSrc;
    }
    function init(){
        //init text on canvas
        var p = new _textCanvas.init('canvasTarget',{
            color: '#000000',
            'font-size': '22px'
        });
        /*defaul config
        var p = new _textCanvas.init('canvas',{});
        */   
    }
    init();
