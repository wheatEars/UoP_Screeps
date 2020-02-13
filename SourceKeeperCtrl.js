module.exports={
	run:function(roomname){
		var SourceKeeper=require('SourceKeeper')
		for(var flagName in Game.flags){
			        var flag = Game.flags[flagName]
			        if(flag.color == COLOR_YELLOW && (flag.secondaryColor == COLOR_YELLOW||flag.secondaryColor == COLOR_WHITE)&&flag.room.name==roomname){
			        	
			            main(flag)
			        }
			    }
		function main(flag){
		    const creep0 = Game.creeps[flag.name + '_0']
		    const creep1 = Game.creeps[flag.name + '_1']
		    const dyingTick = 50;//其中一个寿命不足50就生产另一个，常数可以调整，也可以不用常数
		    var needToSpawnName = null;
		    if(!creep0 && !creep1){
		        needToSpawnName = flag.name + '_1'
		    }
		    if(creep0){
		        SourceKeeper.run(creep0,flag)
		        if(!creep1 & creep0.ticksToLive <= dyingTick){
		            needToSpawnName = flag.name + '_1';
		        }
		    }
		    if(creep1){
		        SourceKeeper.run(creep1,flag)
		        if(!creep0 & creep1.ticksToLive <= dyingTick){
		            needToSpawnName = flag.name + '_0';
		        }
		    }
		    if(needToSpawnName){
		        var spawn = getAvaliableSpawn(flag.room.name)
		        if(spawn){
		        	var body;
		        	if(flag.secondaryColor==COLOR_WHITE){
		        		if(!flag.memory.source){
		        			source = flag.pos.findInRange(FIND_MINERALS,1)[0]
            				flag.memory.source = source.id;
            			}
			        	if(Game.getObjectById(flag.memory.source).mineralAmount>=0&&flag.room.controller.level>=6){
			        		body=[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
			    		}
			    	}
		    		else{
			            switch(flag.room.controller.level){
			            	case 1: body=[WORK,MOVE];
			            			break;
			            	case 2: body=[WORK,WORK,MOVE];
			            			break;
			            	case 3: body=[WORK,WORK,WORK,WORK,MOVE];
			            			break;
			            	case 4: body=[WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
			            			break;
			            	case 5: body=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
			            			break;
			            	case 6: body=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
			            			break;
			            	case 7: body=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
			            			break;
			            	case 8: body=[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE];
			            			break;
			            }
		    		}
		            spawn.spawnCreep(body,needToSpawnName,{memory: {roomname:roomname}})
		        }
		    }
		}
		function getAvaliableSpawn(roomName){
		    for (var spawnName in Game.spawns){
		        var spawn = Game.spawns[spawnName]
		        if(spawn.room.name == roomName && spawn.spawning == null){
		            return spawn
		        }
		    }
		     for (var spawnName in Game.spawns){
		        var spawn = Game.spawns[spawnName]
		        if(spawn.room.name == roomName){
		            return spawn
		        }
		    }
		}
	}
}