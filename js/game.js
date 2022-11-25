const Game = {
    canvas: undefined,
    ctx: undefined,
    scoreBoard: undefined,
    scoreCheese: undefined,
    fps: 60,
    keys: {
        TOP_KEY: 87,
        SPACE: 32,
        JUMP: 80,
    },

    init: function () {
        this.canvas = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.start()
    },

    start: function () {
        this.reset()
        this.scoreBoard.init(this.ctx)
        this.scoreCheese.init(this.ctx)

        // Bucle de renderizado
        this.interval = setInterval(() => {
            this.clear()
            this.score += 0.01
            this.scoreCheese = this.player.userBullets
            // Mecanismo para generar acciones cada X frames
            this.frameCounter++;

            // Generar obstaculo cada 50 frames
            if (this.frameCounter % this.randomNumber(50, 130) === 0)
                this.generateObstacle()

            if (this.frameCounter % 300 === 0)
                this.generateObstacleDestroy()

            if (this.frameCounter % 133 === 0)
                this.generateCheese()

            if (this.eatCheese())
                this.increasePlayer()

            if (this.isCollisionDestroyBullet())
                this.destroy()

            // if (this.isCollision())
            //     this.gameOver()

            if (this.isCollisionDestroy())
                this.gameOver()

            this.drawAll()
            this.moveAll()

            this.clearObstacles()
            this.clearObstaclesDestroy()
            this.clearCheese()
            // this.removeObstacle()


        }, 1000 / this.fps)
    },

    reset: function () {
        this.background = new Background(this.canvas.width, this.canvas.height, this.ctx)
        this.player = new Player(this.canvas.width, this.canvas.height, this.keys, this.ctx)
        this.scoreBoard = ScoreBoard
        this.scoreCheese = ScoreCheese
        this.frameCounter = 0
        this.score = 0
        this.player.userBullets = 0
        this.obstacles = []
        this.obstaclesDestroy = []
        this.cheese = []
        this.bullet = []


    },

    clear: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    moveAll: function () {
        this.background.move()
        this.player.move()

        this.obstacles.forEach(obstacle => {
            obstacle.move()
        })

        this.obstaclesDestroy.forEach(obstacleDestroy => {
            obstacleDestroy.move()
        })

        this.cheese.forEach(cheese => {
            cheese.move()
        })
    },

    drawAll: function () {
        this.background.draw()
        this.player.draw(this.frameCounter)

        this.obstacles.forEach(obstacle => {
            obstacle.draw()
        })

        this.obstaclesDestroy.forEach(obstacleDestroy => {
            obstacleDestroy.draw(this.frameCounter)
        })

        this.cheese.forEach(cheese => {
            cheese.draw()
        })

        this.drawScore(this.score)
        this.drawCheeseCounter(this.scoreCheese)
    },

    generateObstacle: function () {
        this.obstacles.push(new Obstacle(this.canvas.width, this.player.h, this.player.y0, this.ctx))
    },
    generateObstacleDestroy: function () {
        this.obstaclesDestroy.push(new ObstacleDestroy(this.canvas.width, this.player.h, this.player.y0, this.ctx))
    },

    generateCheese: function () {
        this.cheese.push(new Cheese(this.canvas.width, this.player.h, this.player.y0, this.ctx))
    },



    clearObstacles: function () {
        this.obstacles = this.obstacles.filter((obstacle) => obstacle.x + obstacle.w >= 0)
    },

    clearObstaclesDestroy: function () {
        this.obstaclesDestroy = this.obstaclesDestroy.filter((obstacleDestroy) => obstacleDestroy.x + obstacleDestroy.w >= 0)
    },

    clearCheese: function () {
        this.cheese = this.cheese.filter((cheese) => cheese.x + cheese.w >= 0)
    },

    // removeObstacle: function () {
    //     this.obstaclesDestroy = this.obstaclesDestroy.filter((obstacleDestroy) => obstacleDestroy.x === this.bullet && obstacleDestroy.y === this.bullet)
    // },


    isCollision() {
        return this.obstacles.some((obstacle) => {
            return (
                this.player.x + this.player.w >= obstacle.x &&
                this.player.x <= obstacle.x + obstacle.w &&
                this.player.y + this.player.h - 1 >= obstacle.y &&
                this.player.y <= obstacle.y + obstacle.h
            )
        })
    },

    isCollisionDestroy() {
        return this.obstaclesDestroy.some((obstacleDestroy) => {
            return (
                this.player.x + this.player.w - 40 >= obstacleDestroy.x &&
                this.player.x <= obstacleDestroy.x + obstacleDestroy.w &&
                this.player.y + this.player.h - 40 >= obstacleDestroy.y &&
                this.player.y <= obstacleDestroy.y + obstacleDestroy.h
            )
        })
    },

    isCollisionDestroyBullet() {
        return this.obstaclesDestroy.some((obstacleDestroy) => {

            let esto = (
                this.bullet.x + this.bullet.w - 10 >= obstacleDestroy.x &&
                this.bullet.x <= obstacleDestroy.x + obstacleDestroy.w &&
                this.bullet.y + this.bullet.h - 10 >= obstacleDestroy.y &&
                this.bullet.y <= obstacleDestroy.y + obstacleDestroy.h

            )
            if (esto = true) {

                console.log("obstaculo", obstacleDestroy)

                this.obstacleDestroy = this.obstaclesDestroy.filter((obstacleDestroy) => obstacleDestroy.x == this.bullet.x)



            }
        })
    },

    destroy() {

        if (this.bullet.h + this.bullet.w === this.obstacleDestroy.h + this.ObstacleDestroy.w)

            this.obstaclesDestroy.filter((obstacleDestroy) => obstacleDestroy.x + obstacleDestroy.w === this.bullet)

    },

    eatCheese() {

        return this.cheese.some((cheese) => {

            const esto = (
                this.player.x + this.player.w >= cheese.x &&
                this.player.x <= cheese.x + cheese.w &&
                this.player.y + this.player.h - 1 >= cheese.y &&
                this.player.y <= cheese.y + cheese.h
            )
            if (esto == true) {

                console.log("ESTE ES EL PUTO QUESO ", cheese)
                this.cheese = this.cheese.filter((cheese) => cheese.x + cheese.w == this.player.x)
                this.player.userBullets += 2



            } return esto


        })
    },


    increasePlayer() {

        if (this.player.w >= 70 && this.player.w < 130) {

            this.player.w *= 1.20
        }

        // console.log(this.player.w)

    },


    stop() {
        clearInterval(this.interval)
    },



    gameOver() {
        this.stop()

        if (confirm("Te has chocado amigo, (quiéres jugar de nuevo?"))
            this.start()
    },



    drawScore(score) {
        ScoreBoard.update(score)
    },

    drawCheeseCounter(cheeseCounter) {
        ScoreCheese.update(cheeseCounter)
    },


    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}