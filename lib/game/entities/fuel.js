ig.module(
	'game.entities.fuel'
)
.requires(
	'impact.entity'
)
.defines(function() {
	EntityFuel = ig.Entity.extend({

		animSheet: new ig.AnimationSheet( 'media/fuel.png', 16, 16),
		//type: ig.Entity.TYPE.NONE,
		//checkAgainst: ig.Entity.TYPE.A,
		//active: true,
		zIndex: -1,
		//timer: null, 
		size: {x: 10, y: 10},
		offset: {x: 3, y: 3},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim('default', 1, [0]);
		},

		/*check: function(other){
			if(this.active) {
				console.log(other.hasFuel);
				if(other.hasFuel == 1)
				else if (other.hasFuel == 0) {
					other.hasFuel = 1;
					this.kill();
				}
				console.log('Player now has a Fuel Core');
				this.active=false;
			}
		}*/

		update: function() {
			this.parent();
			this.currentAnim = this.anims.default;
		}

	});
});