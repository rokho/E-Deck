ig.module(
	'game.entities.cool'
)
.requires(
	'impact.entity'
)
.defines(function() {
	EntityCool = ig.Entity.extend({

		animSheet: new ig.AnimationSheet( 'media/cool.png', 16, 16),
		//type: ig.Entity.TYPE.NONE,
		//checkAgainst: ig.Entity.TYPE.A,
		//active: true,
		zIndex: -1,
		//timer: null, 
		size: {x: 8, y: 16},
		offset: {x: 4, y: 0},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim('default', 1, [0]);
		},

		/*check: function(other){
			if(this.active) {
				console.log(other.hasCool);
				if(other.hasCool == 1)
				else if (other.hasCool == 0) {
					other.hasCool = 1;
					this.kill();
				}
				console.log('Player now has a Coolant Core');
				this.active=false;
			}
		}*/

		update: function() {
			this.parent();
			this.currentAnim = this.anims.default;
		}

	});
});