ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'game.levels.demo',
    'game.levels.minerva'
)
.defines(function(){

MyGame = ig.Game.extend({

    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),
    //over all progress through the game
    voyageCounter : 50,
    
    //the current time in the event
    eventTime : 0,

    //the primary victory condition of the event.
    eventVictory : 0,
    
    //if the voyage counter = 100
    gameVictory: 0, 
    
    //if the voyage counter = 0
    gameFailure: 0,

    timeAllocated : 100,
    
    reward : 50,
    
    penalty : -50,


    init: function() {

        // Bind keys.
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.W, 'up');
        ig.input.bind(ig.KEY.S, 'down');
        ig.input.bind(ig.KEY.A, 'left');
        ig.input.bind(ig.KEY.D, 'right');
        ig.input.bind(ig.KEY.E, 'act');
        ig.input.bind(ig.KEY.SPACE, 'act');

        // Load level.
        this.loadLevel(LevelMinerva);
    },


    //this camera is fixed with the level centered
    draw: function() {
        this.parent();
        this.screen.x = 16; //MAGIC NUMBERS
        this.screen.y = 40; //AUUUUGH
        
        var player = this.getEntitiesByType( EntityPlayer )[0];
        
        //var mission = this.getEntitiesByType( EntityMission ) [0];
        
        this.font.draw( 'Has Fuel: ' + player.hasFuel + ' | Has Coolant: ' + player.hasCool
            + ' | Steps: ' + player.steps,
            6, 6, ig.Font.ALIGN.LEFT );

        if(player.prevSteps < player.steps){
            //checkingEv(); //itterates event time, and such
            if(gameVictory > 0){
                console.log("YOU WIN!!!!");
            }else if(gameFailure > 0){
                console.log("YOU LOSE!!! GOOD DAY SIR!");
            }
        }
    },

    checkingEv : function() {
           
            if(eventTime > timeAllocated){
                if(eventVictory > 0){
                    console.log("Sucess!");
                    voyageCounter += reward;
                    if(voyageCounter > 100){
                        gameVictory = 1;
                    }
                }else{
                    console.log("Failure!");
                    voyageCounter += penalty;
                    if(voyageCounter <= 0){
                        gameFailure = 1;
                    }
                }
            }else{
               // console.log("Continue the Mission... " + eventTime + " / " + timeAllocated);
                eventTime ++; 
            }
        }

    //this camera follows the player
    /*draw: function() {
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if(player) {
            this.screen.x = player.pos.x - ig.system.width/2;
            this.screen.y = player.pos.y - ig.system.height/2;
        }
        this.parent();
    }*/
});

ig.main( '#canvas', MyGame, 60, 288, 304, 3 );

});
