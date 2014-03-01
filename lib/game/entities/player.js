//this code is adapted from code from:
// https://github.com/Joncom/impact-grid-movement/commit/15c770fe4cc1200a32fe88d21e3441abfcffb9be#diff-0bb377290a5cb6a6a0ad967e4a5fb754R16

ig.module('game.entities.player')
.requires('impact.entity')
.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: { x: 16, y: 16 },
        speed: 50,
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,

        moveIntention: null,
        lastMove: null,
        destination: null,
        dNAME: null,
        hasCool: false,
        hasFuel: false,
        steps: 0,
        prevSteps: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Give the player the appearance that he has.
            this.addAnim('default', 1, [0]);
            this.addAnim('dUP', 1, [0]);
            this.addAnim('UP', 0.07, [0, 1, 2, 3]);
            this.addAnim('dDOWN', 1, [4]);
            this.addAnim('DOWN', 0.07, [4, 5, 6, 7]);
            this.addAnim('dLEFT', 1, [8]);
            this.addAnim('LEFT', 0.07, [8, 9, 10, 11]);
            this.addAnim('dRIGHT', 1, [12]);
            this.addAnim('RIGHT', 0.07, [12, 13, 14, 15]);

            // Set speed as the max velocity.
            this.maxVel.x = this.maxVel.y = this.speed;
        },

        update: function() {

            // It's important that this call occur before the movement code below,
            // because otherwise you would sometimes see the entity move past his
            // destination slightly just before snapping back into place.
            this.parent();

            // Set movement intention based on input.
            this.moveIntention = null; // clear old move input
            //this.currentAnim = this.anims.default;
            if(ig.input.state('act')){
                this.coreInteract();
            }
            if(ig.input.state('right')) {
            	this.moveIntention = moveType.RIGHT;
            	this.currentAnim = this.anims.RIGHT;
            }
            else if(ig.input.state('left')) {
            	this.moveIntention = moveType.LEFT;
            	this.currentAnim = this.anims.LEFT;

            }
            else if(ig.input.state('up')) {
            	this.moveIntention = moveType.UP;
            	this.currentAnim = this.anims.UP;
            }
            else if(ig.input.state('down')) {
            	this.moveIntention = moveType.DOWN;
            	this.currentAnim = this.anims.DOWN;
            }

            // Stop the moving entity if at the destination.
            if(this.isMoving() && this.justReachedDestination() && !this.moveIntention) {
                this.stopMoving();
                this.currentAnim = this.anims.default;
            }
            // Stop the moving entity when it hits a wall.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    !this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention)) {
                this.stopMoving();
            	this.currentAnim = this.anims.default;
            }
            // Destination reached, but set new destination and keep going.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention === this.lastMove) {
                this.continueMovingFromDestination();
            }
            // Destination reached, but changing direction and continuing.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention !== this.lastMove) {
                this.changeDirectionAndContinueMoving(this.moveIntention);
            }
            // Destination not yet reached, so keep going.
            else if(this.isMoving() && !this.justReachedDestination()) {
                this.continueMovingToDestination();
            }
            // Not moving, but wanting to, so start!
            else if(!this.isMoving() && this.moveIntention &&
                    this.canMoveDirectionFromCurrentTile(this.moveIntention)) {
                this.startMoving(this.moveIntention);
            	this.currentAnim = this.anims.moveIntention; //this doesn't work. fix it.
            }

        },

        getCurrentTile: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileX = this.pos.x / tilesize;
            var tileY = this.pos.y / tilesize;
            return { x: tileX, y: tileY };
        },

        getTileAdjacentToTile: function(tileX, tileY, direction) {
            if(direction === moveType.UP) tileY += -1;
            else if(direction === moveType.DOWN) tileY += 1;
            else if(direction === moveType.LEFT) tileX += -1;
            else if(direction === moveType.RIGHT) tileX += 1;
            return { x: tileX, y: tileY };
        },

        startMoving: function(direction) {
            // Get current tile position.
            var currTile = this.getCurrentTile();
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
            // Remember this move for later.
            this.lastMove = direction;
            this.dNAME = 'd'+direction;
            this.currentAnim = this.anims.dNAME;
        },

        continueMovingToDestination: function() {
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        continueMovingFromDestination: function() {
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, this.lastMove);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
            //increment steps taken
            this.prevSteps = this.steps;
            this.steps += 1;
        },

        changeDirectionAndContinueMoving: function(newDirection) {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
            // Remember this move for later.
            this.lastMove = newDirection;
            //increment steps taken
            this.prevSteps = this.steps;
            this.steps += 1;
        },

        stopMoving: function() {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // We are already at the destination.
            this.destination = null;
            // Stop.
            this.vel.x = this.vel.y = 0;
            //increment steps taken
            this.prevSteps = this.steps;
            this.steps += 1;
        },

        snapToTile: function(x, y) {
            var tilesize = ig.game.collisionMap.tilesize;
            this.pos.x = x * tilesize;
            this.pos.y = y * tilesize;
        },

        justReachedDestination: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var destinationX = this.destination.x * tilesize;
            var destinationY = this.destination.y * tilesize;
            var result = (
                (this.pos.x >= destinationX && this.last.x < destinationX) ||
                (this.pos.x <= destinationX && this.last.x > destinationX) ||
                (this.pos.y >= destinationY && this.last.y < destinationY) ||
                (this.pos.y <= destinationY && this.last.y > destinationY)
            );
            return result;
        },

        isMoving: function() {
            return this.destination !== null;
        },

        canMoveDirectionFromTile: function(tileX, tileY, direction) {
            var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
            return ig.game.collisionMap.data[newPos.y][newPos.x] === 0;
        },

        canMoveDirectionFromCurrentTile: function(direction) {
            var currTile = this.getCurrentTile();
            return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
        },

        // Sets the velocity of the entity so that it will move toward the tile.
        setVelocityByTile: function(tileX, tileY, velocity) {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileCenterX = tileX * tilesize + tilesize/2;
            var tileCenterY = tileY * tilesize + tilesize/2;
            var entityCenterX = this.pos.x + this.size.x / 2;
            var entityCenterY = this.pos.y + this.size.y / 2;
            this.vel.x = this.vel.y = 0;
            if(entityCenterX > tileCenterX) this.vel.x = -velocity;
            else if(entityCenterX < tileCenterX) this.vel.x = velocity;
            else if(entityCenterY > tileCenterY) this.vel.y = -velocity;
            else if(entityCenterY < tileCenterY) this.vel.y = velocity;
            //increment steps taken
            //this.steps += 1;
        },

        
        //streamlined this so that instead of checking to see if it doesn't have 
        //cells explicitly it does both check first and then if they both fail does
        //nothing. The player also no longer drops the cell on the ground. It is gone
        //forever.
        coreInteract: function() {
            //this.parent();
           if (this.hasFuel) {
                this.hasFuel = false;
                console.log("Player dropped fuel core.");
                //ig.game.spawnEntity(EntityFuel, this.pos.x, this.pos.y);
                //ig.game.sortEntities();
            } else if (this.hasCool) {
                this.hasCool = false;
                console.log("Player dropped coolant core.");
                //ig.game.spawnEntity(EntityCool, this.pos.x, this.pos.y);
                //ig.game.sortEntities();
            }else {
                console.log("Player does not have a core.")
            }    
        },

    });

    var moveType = {
        'UP': 1,
        'DOWN': 2,
        'LEFT': 4,
        'RIGHT': 8
    };

});