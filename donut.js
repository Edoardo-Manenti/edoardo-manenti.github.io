function setup(){
    let PI = 3.1415;
    let WIDTH = 80;
    let HIEGHT = 40;
    let R1 = 2;
    let R2 = 1;
    let theta_spacing = 0.07;
    let phi_spacing = 0.02;
    let k1 = 30;
    let k2 = 5;

    var pre;
    var tmr1 = undefined;
    pre = document.getElementById("donutText");

    var A = PI/2;
    var B = 0;

    var renderframe = function(){
        var output=[];
        var zbuffer=[];
        A += 0.07;
        B += 0.03;
        var cA=Math.cos(A), sA=Math.sin(A);
        var cB=Math.cos(B), sB=Math.sin(B);
        for(var k=0; k < WIDTH*HIEGHT; k++){
            output[k] = k%WIDTH == WIDTH-1 ? "\n" : " ";
            zbuffer[k] = 0;
        }

        for(var theta=0; theta<2*PI; theta+=theta_spacing) {
            var cT=Math.cos(theta), sT=Math.sin(theta);
            for(var phi=0; phi<2*PI; phi+=phi_spacing){
                var cP=Math.cos(phi), sP=Math.sin(phi);
                var h = R1 + R2*cT;
                var D = 1/(sP*h*sA + sT*cA + k2);
                var t = sP*h*cA - sT*sA;

                var x=0|(WIDTH/2 + k1*D*(cP*h*cB - t*sB)),
                    y=0|(HIEGHT/2 + k1/2*D*(cP*h*sB + t*cB)),
                    o=x+WIDTH*y,
                    N=0|(8*((sT*sA - sP*cT*cA)*cB - sP*cT*sA - sT*cA - cP*cT*sB));
                if(y<HIEGHT && y>=0 && x>=0 && x<WIDTH-1 && D>zbuffer[o])
                {
                    zbuffer[o]=D;
                    output[o]=" .,-~:;=!*#$@"[N>0 ? N:0];
                }
                
            }
        }
        pre.innerHTML = output.join("");
    };
    
    window.start = function() {
        if(tmr1 === undefined) {
            tmr1 = setInterval(renderframe, 50);
        } else {
            clearInterval(tmr1);
            tmr1 = undefined;
        }
    };

    renderframe();
}
