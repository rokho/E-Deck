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
		isFueled: false,
		isCooled: false,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim('default', 1, [0]);
		},

		update: function() {
			this.parent();
			this.currentAnim = this.anims.default;
			if(isFueled) {
				//do something (interacting with mission control)
			}
			if(isCooled) {
				//do something (interacting with mission control)
			}
		}

	});
});