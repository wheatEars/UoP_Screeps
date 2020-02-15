module.exports={
	run:function(creep){
		var total=creep.memory.doing.amount
		var from=Game.getObjectById(creep.memory.doing.from)
		var to=Game.getObjectById(creep.memory.doing.to)
		var type=creep.memory.doing.resourceType
		//处理无关资源
		if(creep.store.getUsedCapacity()>creep.store.getUsedCapacity(type)){
			if(creep.room.storage==null||creep.room.storage!=null&&creep.room.storage.getFreeCapacity()==0){
				for(var t of RESOURCES_ALL){
					creep.drop(t)
					creep.say("clearing")
				}
			}
			else{
				if(creep.memory.emer==null){
					creep.memory.emer=creep.pos.findPathTo(creep.room.storage)
				}
				else{
					for(var t of RESOURCES_ALL){
						if(creep.transfer(creep.room.storage,t)==ERR_NOT_IN_RANGE){
							creep.say("clearing")
							e=creep.moveByPath(creep.memory.emer);
		                    if(e==ERR_NOT_FOUND){
		                        creep.memory.emer=creep.pos.findPathTo(creep.room.storage)
		                        creep.moveByPath(creep.memory.emer)
		                    }
						}
					}
				}
			}
			return 0
		}
		//取资源
		if(creep.store.getUsedCapacity(type)<total&&total<=creep.store.getCapacity()||creep.store.getUsedCapacity(type)<creep.store.getCapacity()&&total>creep.store.getCapacity()){
			creep.say('取')
			if(total<=creep.store.getCapacity()){
			amount=total-creep.store.getCapacity(type)
			}
			if(total>creep.store.getCapacity()){
				amount=creep.store.getFreeCapacity()
			}
			if(creep.memory.path1==null){
				creep.memory.path1=creep.pos.findPathTo(from)
			}
			else{
				if(from==null){
					creep.room.cancelTask(creep.memory.doing.id)
					delete creep.memory.doing
					creep.say("你让我找啥")
					return 0
				}
				if(!from.store){
					if(creep.pickup(from,type,amount)==ERR_NOT_IN_RANGE){
						e=creep.moveByPath(creep.memory.path1);
	                    if(e==ERR_NOT_FOUND){
	                        creep.memory.path1=creep.pos.findPathTo(from)
	                        creep.moveByPath(creep.memory.path1)
	                    }
					}
				}
				else{
					if(creep.withdraw(from,type,amount)==ERR_NOT_IN_RANGE){
						e=creep.moveByPath(creep.memory.path1);
	                    if(e==ERR_NOT_FOUND){
	                        creep.memory.path1=creep.pos.findPathTo(from)
	                        creep.moveByPath(creep.memory.path1)
	                    }
					}
				}
			}
		}
		//放资源
		else{
			creep.say('放')
			if(creep.memory.path2==null){
				creep.memory.path2=creep.pos.findPathTo(to)
			}
			else{
				var t=creep.transfer(to,type)
				if(t==ERR_NOT_IN_RANGE){
					e=creep.moveByPath(creep.memory.path2);
                    if(e==ERR_NOT_FOUND){
                        creep.memory.path2=creep.pos.findPathTo(to)
                        creep.moveByPath(creep.memory.path2)
                    }
				}
				if(t==ERR_FULL){//目标满载
					creep.say("都满了你让我填啥")
					creep.room.cancelTask(creep.memory.doing.id)
					delete creep.memory.doing
				}
				if(t==OK){
					//保存任务进度
					creep.memory.doing.amount=total-creep.store.getUsedCapacity(type);
					//判断是否完成任务
					if(creep.memory.doing.amount<=0){
						creep.room.cancelTask(creep.memory.doing.id)
						delete creep.memory.doing
					}
				}				
			}
		}
	}
}