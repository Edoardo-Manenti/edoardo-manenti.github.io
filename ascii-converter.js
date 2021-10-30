var width_l = 80;
var canvas;
var ctx;
var pre;
var img;
var luminanceStr = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function setupAsciiConverter() {
    var defaultImgPath = "woody.png";
    var divWrapper = document.getElementById("ascii-conv-img-wrapper");
    canvas = document.getElementById("img-to-convert");
    ctx = canvas.getContext('2d');
    img = new Image();
    img.src = defaultImgPath;
    canvas.width = divWrapper.offsetWidth;
    canvas.height = divWrapper.offsetHeight;
    
    img.onload = () => {
        var width_img = img.width;
        var height_img = img.height; 
        var hRatio = canvas.offsetWidth / width_img;
        var vRatio = canvas.offsetHeight / height_img;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x  =  (canvas.offsetWidth - width_img*ratio) / 2;
        var centerShift_y = ( canvas.offsetHeight - height_img*ratio) / 2;
        ctx.drawImage(img, 0, 0, width_img, height_img,
                            centerShift_x, centerShift_y,
                            width_img*ratio, height_img*ratio);
    }

    pre = document.getElementById("ascii-pre");
    var magic_num = 1.75;
    var font_size = divWrapper.offsetWidth*magic_num/80;
    font_size = font_size > 13 ? 13 : font_size;
    pre.setAttribute("style", "font-size: " + font_size + "px");

}

//Formula to calculate brightess level given the RGB values of the pixel
function calculate_brightness(pxArray, w, h) {
    var brArray = []; // array of brightenss values
    for(var i=0; i < 4*w*h; i++) {
        brArray[i/4] = 0.2126*pxArray[i] + 0.7152*pxArray[i+1] 
                        + 0.0722*pxArray[i+2]; // values in range [0..255]
    }
    return brArray;
}

function print_img(outputArr, width_l) {
    var pre = document.getElementById("ascii-pre");
    for(var i=1; i<= outputArr.length/width_l; i++){
        outputArr.splice(width_l*i,0, "\n");
    }
    pre.innerHTML = outputArr.join(""); 
}

function renderImage() {
    var w = canvas.width; //width of the img drawn on the canvas
    var h = canvas.height;
    var imgData = ctx.getImageData(0,0,w,h).data;
    var brArray = calculate_brightness(imgData, w, h);
    var block = w/width_l;
    var height_l = h/block;
    var output = []; //char output array
    for(var k=0; k < width_l*height_l; k++){
        output[k] = k%width_l == width_l-1 ? "\n" : " ";
    } //prepare output array with newline characters
    for(var x=0; x<width_l; x++) {
        for(var y=0; y<height_l; y++) {
            var s_i = block*(y*w + x); // calculate the value of the first pixel of the block
            var b_s = 0; // total brightness sum of the block (needed to calculate the avg brightness)
            for(var i=0; i < block*block; i++) {
                var index = s_i + (i/block)*w + i%block; // index of the pixel of the block
                b_s += brArray[index];
            }
            var avgBrightness = b_s/(block*block); //compute avg bruightness value
            output[y*width_l + x] = luminanceStr[Math.floor(luminanceStr.length
                                                            *(avgBrightness/255))];
        }
    }
    print_img(output);
}
