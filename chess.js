var chess = new Vue({
    el: '#chessboard',
    data:{
        index: 1,                            //顺序，黑棋为奇数，白棋为偶数
        chessboard: [                       //存放棋盘的数组，1为白，-1为黑，0为没有棋子 ,2为提示可以下棋
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,1,-1,0,0,0,
            0,0,0,-1,1,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ],
        whiteNum: 2,        //白棋数量
        blackNum: 2,        //黑棋数量
        squareNum: 4,       //棋子数量

        playFlag: true,        //记录上一回合是否落子 

        playSquare: {},                     //记录下可以落子的位置
        chessboardShow: []                   //棋盘二维数组   
    },    
    beforeMount:function () {
        //将棋盘变为二维数组，方便遍历展示
        var arr01 = [];
        for(var i=0 ;i<8; i++){
            var arr02 = [];
            for(var j=0; j<8; j++){
                arr02.push(this.chessboard[i*8+j])
            }
            arr01.push(arr02)
        }
        this.chessboardShow = arr01;

        for(var i=0; i<this.chessboard.length; i++){
            //遍历是否判断可以落子的位置
            if(this.chessboard[i] === 0){
                this.canPlay(i)
            }
        }
    },
    methods: {
        restart: function(){
            this.chessboard = [                       
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,
                0,0,0,1,-1,0,0,0,
                0,0,0,-1,1,0,0,0,
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0
            ];
            for(var i=0; i<this.chessboard.length; i++){
                //遍历是否判断可以落子的位置
                if(this.chessboard[i] === 0){
                    this.canPlay(i)
                }
            }
            this.whiteNum = 2;      
            this.blackNum = 2;        

            this.playFlag = true;        
        },
        playing: function(row,col){
            //落子
            if(this.chessboardShow[row][col] != 2){
                //该位置是否可以落子，不可以返回
                return
            }
            //可以落子
            var square = row*8+col;
            this.chessboard.splice(square,1,this.index%2==0?1:-1);
            this.turn(square);
            if(this.squareNum === 64){
                return
            }
            this.index ++;
        },
        canPlay: function(square){
            //判断是否可以落子
            var flag = false;
            var index = this.index%2 === 0 ? 1 : -1;
            this.playSquare[square] = [];
            var top = parseInt(square/8),bottom = 7-parseInt(square/8),left = square%8,right = 7-square%8;  //格子距离棋盘上下左右的距离
            //左上
            //左上方是否有对方棋子，如果有。继续
            if(this.chessboard[square-9] === 0 - index){
                //继续往左上方遍历，是否有自己的棋子
                var arr = [];       //存储遍历过程中的棋子
                for(var i=1; i<=(top<left?top:left); i++){
                    if(square-i*9 < 0)break   //如果超出棋盘，则结束遍历
                    if(this.chessboard[square-i*9] === 0 || this.chessboard[square-i*9] === 2)break       //如果遇到空白棋盘或可落子区域，返回
                    arr.push(square-i*9);
                    if(this.chessboard[square-i*9] === index){ 
                        flag = true;
                        this.chessboard.splice(square,1,2);     //如果有自己的棋子，这该位置可以落子
            
                        arr.pop();      //去除最后一个自己的棋子
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                    
                }
            }
            //上
            if(this.chessboard[square-8] === 0 - index){
                var arr = [];
                for(var i=1; i<=top; i++){
                    if(square-i*8<0)break
                    if(this.chessboard[square-i*8] === 0 || this.chessboard[square-i*8] === 2)break
                    arr.push(square-i*8);
                    if(this.chessboard[square-i*8] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //右上
            if(this.chessboard[square-7] === 0 - index){
                var arr = [];
                for(var i=1; i<=(top<right?top:right); i++){
                    if(square-i*7<0)break
                    if(this.chessboard[square-i*7] === 0 || this.chessboard[square-i*7] === 2)break
                    arr.push(square-i*7);
                    if(this.chessboard[square-i*7] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //右
            if(this.chessboard[square+1] === 0 - index){
                var arr = [];
                for(var i=1; i<=right; i++){
                    if(square+i>64)break
                    if(this.chessboard[square+i] === 0 ||this.chessboard[square+i] === 2)break
                    arr.push(square+i);
                    if(this.chessboard[square+i] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //右下
            if(this.chessboard[square+9] === 0 - index){
                var arr = [];
                for(var i=1; i<=(bottom<right?bottom:right); i++){
                    if(square+i*9>64)break
                    if(this.chessboard[square+i*9] === 0 || this.chessboard[square+i*9] === 2)break
                    arr.push(square+i*9);
                    if(this.chessboard[square+i*9] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //下
            if(this.chessboard[square+8] === 0 - index){
                var arr = [];
                for(var i=1; i<=bottom; i++){
                    if(square+i*8<0)break
                    if(this.chessboard[square+i*8] === 0 || this.chessboard[square+i*8] === 2)break
                    arr.push(square+i*8);
                    if(this.chessboard[square+i*8] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //左下
            if(this.chessboard[square+7] === 0 - index){
                var arr = [];
                for(var i=1; i<=(bottom<left?bottom:left); i++){
                    if(square+i*7>64)break
                    if(this.chessboard[square+i*7] === 0 || this.chessboard[square+i*7] === 0)break
                    arr.push(square+i*7);
                    if(this.chessboard[square+i*7] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            //左
            if(this.chessboard[square-1] === 0 - index){
                var arr = [];
                for(var i=1; i<=left; i++){
                    if(square-i<0)break
                    if(this.chessboard[square-i] === 0 || this.chessboard[square-i] === 2)break
                    arr.push(square-i);
                    if(this.chessboard[square-i] === index){
                        flag = true;
                        this.chessboard.splice(square,1,2);

                        arr.pop();
                        this.playSquare[square] = this.playSquare[square].concat(arr);
                        break
                    }
                }
            }
            return flag;
        },
        //翻棋
        turn: function(index){
            var adverse = this.playSquare[index];       //可以翻的对方的棋子下标
            for(var i=0; i<adverse.length; i++){
                this.chessboard.splice(adverse[i],1,this.index%2===0?1:-1)
            }
            this.playSquare = {}
        },
        win: function(){
            if(this.whiteNum > this.blackNum){
                alert('游戏结束，白方胜利')
            }
            if(this.whiteNum < this.blackNum){
                alert('游戏结束，黑方胜利')
            }
            if(this.whiteNum === this.blackNum){
                alert('游戏结束，平局')
            }
        }
    },
    watch: {
        chessboard: function(){         //监听棋盘数组的变化，实时变为二维数组
            var arr01 = [];
            for(var i=0 ;i<8; i++){
                var arr02 = [];
                for(var j=0; j<8; j++){
                    arr02.push(this.chessboard[i*8+j])
                }
                arr01.push(arr02)
            }
            this.chessboardShow = [];
            this.chessboardShow = arr01;
            this.whiteNum = this.chessboard.filter(function(item){
                return item === 1;
            }).length;
            this.blackNum = this.chessboard.filter(function(item){
                return item === -1;
            }).length;
        },
        index: function(){          //监听index的变化，让轮到另一人时，判断新的可落子的位置
            var pass = false;       //是否还可以落子，可以true，不可以false
            for(var i=0; i<this.chessboard.length; i++){
                if(this.chessboard[i] === 2){    
                    this.chessboard[i] = 0;     //把之前可以落子的位置标志清除
                }
                if(this.chessboard[i] === 0){
                    if(this.canPlay(i)){
                        pass = true;        //有可落子的位置，说明可以落子
                        this.playFlag = true;       //上一轮不能落子，本轮可以落子，重置标志
                    }
                }
            }
            if(!pass){
                if(!this.playFlag){
                    var _this = this
                    setTimeout(function(){
                        _this.win()      //如果上一轮和本轮都不能落子，游戏结束
                    },1000)
                }else{
                    this.playFlag = false;
                    this.index ++       //如果没有可以落子的位置，pass，另一人落子
                }
            }
        },
        squareNum: function(val){
            if(val === 64){
                var _this = this
                setTimeout(function(){
                    _this.win();
                },1000)
            }
        }
    },
    computed: {
        squareNum: function(){
            return this.whiteNum+this.blackNum;
        }
    }
})