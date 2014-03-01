ig.module( 'game.entities.system' )
.requires( 'impact.entity' )
.defines(function() {
	EntitySystem = ig.Entity.extend({

		animSheet: new ig.AnimationSheet( 'media/system.png', 16, 16),
		//type: ig.Entity.TYPE.B,
		//checkAgainst: ig.Entity.TYPE.A,
		zIndex: -1, 
		size: {x: 16, y: 16},
		offset: {x: 0, y: 0},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim('default', 1, [0]);
		},

		/*check: function(other) {
			this.parent();
			if(other.hasFuel || other.hasCool) {
				console.log('Player already has a Core');
			}
			else if (!other.hasFuel) {
				other.hasFuel = true;
				this.kill();
				console.log('Player has picked up a Fuel Core');
			}
		},*/

		update: function() {
			this.parent();
			this.currentAnim = this.anims.default;
		}

	});
});