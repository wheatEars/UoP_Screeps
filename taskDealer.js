module.exports={
	run:function(room){

		//房间最少数量
		const numberController1=[//work,carry,center
			[2,2,0],
			[2,2,0],
			[3,4,0],
			[3,4,0],
			[3,4,0],
			[3,4,1],
			[3,3,1],
			[1,2,1]
		]

		//任务堆积最大数量
		const numberController2=[//work,carry,center
			[3,3,0],
			[3,3,0],
			[3,4,0],
			[3,4,0],
			[2,4,0],
			[3,3,10],
			[2,3,10],
			[2,2,10]
		]

		//为了对应任务里的筛选器设置的顺序数组,用于检测部件
		const bodyPartList=[WORK,ATTACK,RANGED_ATTACK,HEAL,CLAIM,TOUGH,CARRY,MOVE]

		//统计当前房间出生的creep
		var creeps=new Array()

		for(var m in Game.creeps){

			creep=Game.creeps[m]

			//这里每个creep出生时都有房间号的memory
			if(creep.memory.roomname==room.name){

				creeps.push(creep)
			}

		}

		//任务分配开始
		for(var m in room.memory.tasks){

			//遍历任务
			var task=room.memory.tasks[m]

			if(!task.isDoing){
				//是否空闲

				var beenDeal = false//这里可能出现抢单情况所以加个变量约束,先到先得 

				var availableCreepNumber = 0//统计可用数量,为数量控制做准备

				for(var creep of creeps){

					if(creep.memory.role == task.type || task.needNoVisa!=undefined){
					//匹配对应角色,紧急情况可以needVisa=false来调动所有力量

						for(var index=0;index<8;index++){

							if(creep.getActiveBodyparts(bodyPartList[index]) >= task.needBodyParts[index]){	//检查bodypart是否符合标准

								if(index == 7){	//检查完毕

									availableCreepNumber++	//可用数量增加

									if(creep.taskList.length < 2 && !beenDeal){	//如果空闲且没被抢,接受任务

										if(room.dealTask(task,creep)){	//康康能不能成功

											beenDeal=true	//这个单被接了

										}

										else{

											console.log('Err can not deal the task')

										}

									}

								}

							}

							else{

								break	//检测到不合格部分

							}

						}

					}

				}
				var leastCreepNum//对应角色,等级的最少creep数量

				var maxTaskNum//对应角色,等级的最多task堆积数量

				var level=room.controller.level

				switch(task.type){

					case TASK_WORK:leastCreepNum=numberController1[level][0]

									 maxTaskNum=numberController2[level][0]

					case TASK_CARRRY:leastCreepNum=numberController1[level][1]

									 maxTaskNum=numberController2[level][1]

					case TASK_CENTER:leastCreepNum=numberController1[level][2]

									 maxTaskNum=numberController2[level][2]

				}

				if(availableCreepNumber < leastCreepNum || room.getTaskByType(task.type) > maxTaskNum){	//数量不够

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

					//根据任务筛选器生成符合配置的creep
					var body=[]

					for(var i=0;i<8;i++){

						for(var j=0;j<task.needBodyParts[i];j++){

							body.push(bodyPartList[i])

						}

					}

					var newName = ''+task.type+ Game.time

					var availableSpawn=getAvaliableSpawn(room.name)

					availableSpawn.spawnCreep(body,newName,{memory:{role:task.type,roomname:i,taskList:[]}})//这里就是记录的房间号

				}

			}

		}

		//过载警告
		var centerOverLoad=room.getTaskByType(TASK_CENTER)

		if(centerOverLoad>7){

			console.log(room.name+' center creep OVERLOADING ! ! ! ')

			console.log('NOW HAVE '+centerOverLoad+' CENTER TASKS ! ! !')

		}

	}

}