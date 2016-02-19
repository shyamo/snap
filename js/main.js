var game = {
    
    settings: {
        countOpen : 1,
        selectedOpt : new Array(),
        tempArray : new Array(),
        addedCard : new Array(),
        scoreMatch: 0,
        scoreWrong: 0,
        msgMatch: ['Yay', 'Nice one', 'Cool'],
        msgWrong: ['Booo', 'Need brain food?', 'Ahem!']
        },
    
    init: function() {
        console.log('//game initialized//');
        game.events();
        game.setup();
        game.cardClick();
        //game.createWebSocket();
    },
    
    events: function() {
        $(document).on('keydown', function(e) {
            var keyCode = e.keyCode;
            if (keyCode == 66) {
                $('.boss').toggle(); 
                if ( $('.boss').css("display") == 'none' ) {
                    $('.game').show();
                } else {
                    $('.game').hide();
                }
            }
            
        });
    },
    
    createWebSocket: function() {
      
        var WinNetwork = new ActiveXObject("WScript.Network");
        alert(WinNetwork.UserName); 
        
        var socket = new WebSocket('ws://echo.websocket.org/');

        var responses = 0;
        socket.onopen = function() {
            console.log('open');
            socket.send('hello echo');
            socket.send('hello echo 2');
        }

        socket.onmessage = function(evt) {
            console.log(evt.data);

            // let's clean up when we're done with our example
            if (++responses == 2)
                socket.close();
        }

        socket.onclose = function() {
            console.log('socket close');
        }

    },
    
    resetGame: function() {
        

        location.reload();
    },
    //sets color into cardArray for each icon
    setHexColors: function() {
        
        var randomColor; 
        $.each(cardData, function(i, val) {
            for (i=0; i<cardData.length; i++) {
                randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                val.color = randomColor;
            }
            
        })        
    },
    
    //shuffles items in the array
    shuffleCards: function(array) {
            //for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
            //return array;  
            for (var i =0; i < array.length; i++) {
                var j = Math.floor(Math.random() * (array.length - i));
                var temp = array[j];
                array[j] = array[i];
                array[i] = temp;
            }
        return array
    },
    
    setup: function() {
        game.setHexColors();
        var cardArray = cardData;
        var clone = cardArray.slice(0);
        var fullArray = clone.concat(cardArray);    
        fullArray = game.shuffleCards(fullArray)
        $('.fa').delay(1500).fadeOut(500);
        
        $('.reset').on('click', function() {
           game.resetGame();
        });
        
        //for each of the card
        $('.fa').each(function(i) {
            
            var imageId, imageClass, imageName, item;   
            var result = $.grep(fullArray, function (e) { 
                return e.image;
            });
            
            imageId = result[i].id; //id of item in array NOT index
            imageClass = result[i].image; //image class
            imageName = imageClass.substring(3,imageClass.length); //name of the image class without fa...
            //console.log(imageName);
            $(this).addClass('js-card' + imageId + ' ' + imageClass + "  " + "data-" + imageName); //add icons classes
            $(this).parent().addClass("data-" + imageName + ' js-index'+ i); //add class to parent
            $(this).css({"color":result[i].color});

            i++; //increment counter
        });
        
    },
    
    //array that gets unique id in cardData array
    getUniqueArrayItem: function() {
        for (var j=1; j<cardData.length; j++) {
            if ($.inArray(j, game.settings.addedCard) == -1) {
                return j;
            }
        }
        
    },
    
    cardClick: function() {
        
        $('.matchbox').on('click', function() {
                game.settings.selectedOpt = [];
                game.settings.selectedOpt.length = 0;
                game.settings.tempArray = [];
                game.settings.tempArray.length = 0;
            
                
            
            if (game.settings.countOpen ==2) {
                $(this).find('.fa').fadeIn(50);
                //check if items are the same
                $('.matchbox:not(".found")').each(function() {
                    if ($(this).find('.fa').css("display") == "table") {
                        
                        if (game.settings.selectedOpt.length === undefined || game.settings.selectedOpt.length == 0) {
                            game.settings.selectedOpt = $(this).find('.fa').attr("class").split(" ");
                        } else {
                            game.settings.tempArray = $(this).find('.fa').attr("class").split(" ");
                        }
                    }    
                })   
                
                //game.sameCardSelected($(this));
                
                //if items match
                if (game.settings.selectedOpt[4] == game.settings.tempArray[4]) {
                    $('.fa').each(function() {
                        if ($(this).css("display") == "table") {
                            $(this).parent().addClass("found");
                        }
                    })
                    game.settings.scoreMatch++;
                } else {
                    $('.matchbox:not(".found")').each(function(item) {
                        if ($(this).find('.fa').css("display") == "table") {
                            $(this).find('.fa').delay(400).hide(0);
                            //$(this).find('.fa').addClass('js-hide');
                        }
                    }) 
                    game.settings.scoreWrong++;
                }
                
                //reset array
                game.settings.selectedOpt = [];
                game.settings.tempArray = [];
                game.settings.countOpen=1; //reset counter 
            } else if (game.settings.countOpen < 3) {
                $(this).find('.fa').fadeIn(500);
                game.settings.countOpen++;
            }
            
            
            //console.log('right:' + game.settings.scoreMatch + ':wrong:' + game.settings.scoreWrong);
            $('.score-right').html("Snap'd: " + game.settings.scoreMatch + " ");
            $('.score-wrong').html("Wrong: " + game.settings.scoreWrong);
        });
        
    },
}

$(document).ready(function() {
   game.init(); 
});
