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

    //this is the time allocated by the event
    timeAllocated : 100,
    
    //reward for suceeding in an event.
    reward : 50,
    
    //penalty for failing to complete an event.
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

        if(player.hasMoved){
            console.log("player has moved");
            this.checkingEv(); //itterates event time, and such
            if(this.gameVictory > 0){
                console.log("YOU WIN!!!!");
            }else if(this.gameFailure > 0){
                console.log("YOU LOSE!!! GOOD DAY SIR!");
            }
            player.hasMoved = false;
        }
    },

    checkingEv : function() {
           

            if(this.eventTime > this.timeAllocated){
                if(this.eventVictory > 0){
                    console.log("Success!");
                    this.voyageCounter += this.reward;
                    if(this.voyageCounter > 100){
                        this.gameVictory = 1;
                    }
                }else{
                    console.log("Failure!");
                    this.voyageCounter += this.penalty;
                    if(this.voyageCounter <= 0){
                        this.gameFailure = 1;
                    }
                }
            }else{
               // console.log("Continue the Mission... " + eventTime + " / " + timeAllocated);
                this.eventTime ++; 
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
