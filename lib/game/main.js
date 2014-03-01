ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'game.levels.demo',
    'game.levels.septimus'
)
.defines(function(){

MyGame = ig.Game.extend({

    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),


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
        this.loadLevel(LevelSeptimus);
    },

    //this camera is broken
    /*draw: function() {

        this.parent();

        // Give instructions.
        var x = ig.system.width/2;
        var y = ig.system.height - this.font.height - 2;
        this.font.draw( 'Use the ARROW KEYS to move around.', x, y, ig.Font.ALIGN.CENTER );
    }*/

    //this camera is fixed with the level centered
    draw: function() {
        this.parent();
        this.screen.x = 16; //MAGIC NUMBERS
        this.screen.y = 40; //AUUUUGH
        var player = this.getEntitiesByType( EntityPlayer )[0];

        this.font.draw( 'Has Fuel: ' + player.hasFuel + ' | Has Coolant: ' + player.hasCool
            + ' | Steps: ' + player.steps,
            6, 6, ig.Font.ALIGN.LEFT );
  

       
        var mission = this.getEntitiesByType( EntityMission ) [0];

        if(player.prevSteps < player.steps){

            if(mission.gameVictory){
                console.log("YOU WIN!!!!");
            }else if(mission.gameFailure){
                console.log("YOU LOSE!!! GOOD DAY SIR!");
            }
        }
    },

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
