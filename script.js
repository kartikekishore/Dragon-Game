    
    //Kary's Dragon Game
    //Dragon 5 Images to look like animation
    //clouds<---left going x--;
    //land<--
    //score increase with counter
    //Background Music
    //background Music can be toggled.
    //Wee sound on jump.
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		var width = 700;
		var height = 320;


	    var JumpAudio = new Audio('jump.mp3');
		JumpAudio.volume=0.1;
		function playJumpAudio(){
	        JumpAudio.play();
		}
        var EndAudio = new Audio('end.wav');
		EndAudio.volume=0.1;
		function playEndAudio(){
	        EndAudio.play();
		}

	    
		function drawObject(object){
			//Find current index of image to be used.
			var currentImageIndex = counter%object.images.length;
			//Access image from array of images
			var currentImage = object.images[currentImageIndex];
			//Draw of canvas
			try{
				ctx.drawImage(currentImage,object.x-(object.width/2),object.y-(object.height/2),object.width,object.height);
 } catch(er){}
			if(1===object.repeatX){
				ctx.drawImage(currentImage,object.width + object.x-(object.width/2),object.y-(object.height/2),object.width,object.height);
			}
		}

		var dragonImages = [];
		
		var dragonImageUrls = ["https://i.imgur.com/dyPMw7K.png","https://i.imgur.com/cO9ZZMC.png","https://i.imgur.com/AJUkc9s.png","https://i.imgur.com/6xIWhPr.png"];
		 //,"https://i.imgur.com/SCqOXcT.png"];
		 
		for( var i=0; i<dragonImageUrls.length ; i++ ){
			var image = new Image();
			image.src = dragonImageUrls[i];
			dragonImages.push(image);
		}

		var dragon = {};
		dragon.images = dragonImages ;
		dragon.width = 50;
		dragon.height = 50;
		dragon.x=100;
		dragon.y=280;
		dragon.speedX = 0;
		dragon.speedY = 0;
		var gravity = 2.08;

		dragon.move = function(){
			//
			console.log(this.speedY);
			this.speedY = this.speedY + gravity;
			this.y = this.y + this.speedY;
			if(this.y > 280){
				this.y = 280;
				this.speedY =0;
			}
		}

		var clouds = [];
		var cloudImage = new Image();
		cloudImage.src = "https://i.imgur.com/H84RIEb.png";

		function getCloud(){

			var cloud = {};
			cloud.images = [cloudImage] ;
			cloud.width = 50;
			cloud.height = 30;
			cloud.x=width;
			cloud.y=30+Math.random()*75;
			cloud.isActive = true;
			cloud.speedX = -4 -( Math.random()*4);
			cloud.speedY = 0;
			
			cloud.move = function(){
				this.x = this.x + this.speedX;
				if(this.x < -100 ){
					this.isActive = false;
				}
			}

			return cloud;		
		}

		var hurdles = [];
		var hurdleImage = new Image();
		hurdleImage.src = "https://i.imgur.com/9pEv72P.png";

		var score = 0;
		function getHurdle(){

			var hurdle = {};
			hurdle.images = [hurdleImage] ;
			hurdle.width = 30;
			hurdle.height = 70;
			hurdle.x=width;
			hurdle.y=height - hurdle.height/2 - 15;
			hurdle.isActive = true; 
			hurdle.speedX = -9;
			hurdle.speedY = 0;
			
			hurdle.move = function(){
				this.x = this.x + this.speedX;
				if(this.x < -100 ){
					this.isActive = false;
				}
			}

			return hurdle;		
		}


		var landImage = new Image();
		landImage.src = "https://i.imgur.com/gL6wPcx.png"; 
		var land = {};
		land.width = 1200;
		land.height = 12;
		land.images = [landImage];
		land.x= land.width/2;
		land.y= height -25;
		land.speedX = -10;
		land.speedY = 0;
		land.repeatX = 1;
		land.move = function(){
			this.x = this.x + this.speedX;
			if( this.x < -this.width/2 ){
				this.x += this.width ;
			}
		}
        var endingvar=0;
		var counter = 0;	var isMusicPlaying = false;
		function update()
		{
			counter++;
			score++;
			if(counter%30==0){
				// Create new cloud and store it in array named clouds
				var cloud = getCloud();
				clouds.push(cloud);
			} 

			if(counter%100==0){
				// Create new hurdle and store it in array named hurdles
				var hurdle = getHurdle();
				hurdles.push(hurdle);
			} 

			//Clear all backgroud to white
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, width, height);

			ctx.font = "30px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Score: " + parseInt(score/10) , width-180, 50);

			dragon.move();
			drawObject(dragon);
		
			var cloudsFinal = [];
			for(var i = 0; i < clouds.length ; i++){
				var cloud = clouds[i];

				cloud.move();
				drawObject(cloud);

				if( cloud.isActive == true){
					cloudsFinal.push(cloud);
				}
			}
			clouds = cloudsFinal;

			var hurdlesFinal = [];
			for(var i = 0; i < hurdles.length ; i++){
				var hurdle = hurdles[i];

				hurdle.move();
				drawObject(hurdle);

				if( hurdle.isActive == true){
					hurdlesFinal.push(hurdle);
				}
			}
			hurdles = hurdlesFinal;


			land.move();
			drawObject(land);
		//collision 
			console.log("dragon x"+dragon.x);
			console.log("dragon y"+dragon.y);
			console.log("obstacle x"+hurdle.x);
			console.log("obstacle y"+hurdle.y);
				//collision from front i.e. while jumping and in the air
			if(hurdle.x-dragon.x>=0&&hurdle.x-dragon.x<=40&&dragon.y>240)
			{   playEndAudio();
				alert("Game Over:"+parseInt(score/10));
                endingvar=1;
                audio.pause();
                return process.abort();
			}
			//collision from back i.e. while landing
			if(hurdle.x<=107&&dragon.x-hurdle.x<=40&&dragon.y>240)
			{
                playEndAudio();
				alert("Game Over:"+parseInt(score/10));
                audio.pause();
                endingvar=1;
                return process.abort();
			}
			
	
		}

	
	
		document.addEventListener("keydown", function(event) 
		{
			if(event.keyCode == 32){
				if(dragon.y == 280){
					playJumpAudio();
					dragon.speedY = -20;				
				}
			}
			if(isMusicPlaying){
				var audio = new Audio('background_music.mp3');
			    audio.play();
			}
            if(!isMusicPlaying){
				var audio = new Audio('background_music.mp3');
			    audio.pause();
			}


		}
		
		);
		setInterval(update,50);

        //Main part ends...
     

        function MusicToggle() {
            
            var checkBox = document.getElementById("myCheck");
            if(isMusicPlaying==false)
            isMusicPlaying=true;
            else
            isMusicPlaying=false;
           
          } 