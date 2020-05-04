var M = 50;
var N = 50;
var F = [[]];           // bit field 0000 relatively to (UP, DOWN, LEFT, RIGHT) directions

var nc = [];
var dir = [];

var x0 = -1;
var y0 = -1;

// drawing params
var cellsize = 0;
var topm = 0;            // height of top point of whole maze
var leftm = 0;           // width of left point of whole maze
// drawing params

function init()
{
    clear();
    
    setStart();
    rec_gen(x0, y0);
    
    var cnv = document.getElementById("c0");
    var ctx = cnv.getContext("2d");
    cnv.width = 0.97*window.innerWidth;
    cnv.height = 0.97*window.innerHeight;
    
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    drawMaze(cnv, ctx);
}

function clear()
{
    F = [[]];
    for (var i = 0; i < M; i++) {
        F[i] = [];
        for (var j = 0; j < N; j++) {
            F[i][j] = 0;
        }
    }
    
    x0 = -1;
    y0 = -1;    
}

function setStart()
{
    x0 = randInt(M);
    y0 = randInt(N);
}

function rec_gen(x, y)
{
    var res = adj_cells(x, y);
    if (res == 0) return;   
    
    var ncopy = nc;
    var dcopy = dir;   

    while (ncopy.length > 0) {
        var newindex = randInt(ncopy.length);
        
        var newx = ncopy[newindex][0];
        var newy = ncopy[newindex][1];
        var D = dcopy[newindex]; 
        
        ncopy.splice(newindex, 1);
        dcopy.splice(newindex, 1);
        
        if (F[newx][newy] != 0) continue;
        
        var invD = (D+2)%4;
        F[newx][newy] |= (1<<invD); 
        F[x][y] |= (1<<D);
        
        rec_gen(newx, newy);
    }    
}

// all available neighbours
function adj_cells(i, j)
{
    nc = [];
    dir = [];
        
    if (i + 1 < M) {
        nc.push([i+1, j]);
        dir.push(0);
    }
    if (j + 1 < N) {
        nc.push([i, j+1]);
        dir.push(1);
    }
    if (i - 1 >= 0) {
        nc.push([i-1, j]);
        dir.push(2);
    }
    if (j - 1 >= 0) {
        nc.push([i, j-1]);
        dir.push(3);
    }
        
    return nc.length;
}

function drawMaze(cnv, ctx) 
{
    calcTransform(cnv);
    ctx.beginPath();
    
    for (var i = 0; i < M; i++) {
        for (var j = 0; j < N; j++) {
            if (!(F[i][j] & (1<<0))) {     // right
                ctx.moveTo(leftm + cellsize*(i+1), topm + cellsize*j);
                ctx.lineTo(leftm + cellsize*(i+1), topm + cellsize*(j+1));                
            }
            if (!(F[i][j] & (1<<1))) {     // down
                ctx.moveTo(leftm + cellsize*i, topm + cellsize*(j+1));
                ctx.lineTo(leftm + cellsize*(i+1), topm + cellsize*(j+1));                   
            }
            if (!(F[i][j] & (1<<2))) {     // left
                ctx.moveTo(leftm + cellsize*i, topm + cellsize*j);
                ctx.lineTo(leftm + cellsize*i, topm + cellsize*(j+1));                  
            }
            if (!(F[i][j] & (1<<3))) {     // up
                ctx.moveTo(leftm + cellsize*i, topm + cellsize*j);
                ctx.lineTo(leftm + cellsize*(i+1), topm + cellsize*j);                   
            }
        }
    }
    ctx.stroke();
}

function calcTransform(c)
{
    var w = c.width;
    var h = c.height;
    var part = 0.95;
    
    if (w/h > M/N) cellsize = part*h/N;
    else cellsize = part*w/M;
        
    topm = 0.5*(h - cellsize*N);
    leftm = 0.5*(w - cellsize*M);
}

function randInt(max)
{
    return Math.floor(Math.random() * max); 
}




















