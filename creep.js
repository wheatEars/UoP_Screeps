module.exports={
	bury:function(){
		for(var cn in Memory.creeps){
			if(!Game.creeps[cn]){
				// if(Memory.creeps[cn].role!=undefined){
				// 	taskGiveBack(cn);
				// }
				delete Memory.creeps[cn]
			}
		}
	},
	run:function(){
		this.bury()
		var behave=require('creep.behave')
		for(var creep in Game.creeps){
			behave.run(Game.creeps[creep])
		}
	}
}