
module.exports={
	run:function(){
		require('room.taskFunctions').run()
		var Myrooms=['E9N8']
		for(var r of Myrooms){
			var room=Game.rooms[r]
			require('decision.room').run(room)
			require('room.taskDealer').run(room)
		}
	}
}