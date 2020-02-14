module.exports={
	repair:function(creep,target){
		if(creep.memory.path2==undefined){
			creep.memory.path2=creep.pos.findPathTo(target)
		}
		var a=creep.repair(target)
		if(a==ERR_NOT_IN_RANGE){
			var e=creep.moveByPath(creep.memory.path2,{ignore:false})
			if(e==ERR_NOT_FOUND){
				creep.memory.path2==creep.pos.findPathTo(target)
				creep.moveByPath(creep.memory.path2,{ignore:false})
			}
		}
	},
	build:function(creep,target){
		if(creep.memory.path2==undefined){
			creep.memory.path2=creep.pos.findPathTo(target)
		}
		var a=creep.build(target)
		if(a==ERR_NOT_IN_RANGE){
			var e=creep.moveByPath(creep.memory.path2,{ignore:false})
			if(e==ERR_NOT_FOUND){
				creep.memory.path2==creep.pos.findPathTo(target)
				creep.moveByPath(creep.memory.path2,{ignore:false})
			}
		}
	},
	upgrade:function(creep,target){
		if(creep.memory.path2==undefined){
			creep.memory.path2=creep.pos.findPathTo(target)
		}
		var a=creep.upgradeController(target)
		if(a==ERR_NOT_IN_RANGE){
			var e=creep.moveByPath(creep.memory.path2,{ignore:false})
			if(e==ERR_NOT_FOUND){
				creep.memory.path2==creep.pos.findPathTo(target)
				creep.moveByPath(creep.memory.path2,{ignore:false})
			}
		}
	},
	loading:function(creep,from){
		var total=creep.memory.doing.amount
		if(creep.memory.path1==undefined){
			creep.memory.path1=creep.pos.findPathTo(from)
		}
		else{
			var a
			if(!from.store){
				let t=creep.pickup(from,'energy')
				if(t==ERR_NOT_IN_RANGE){
					e=creep.moveByPath(creep.memory.path1);
                    if(e==ERR_NOT_FOUND){
                        creep.memory.path1=creep.pos.findPathTo(from)
                        creep.moveByPath(creep.memory.path1)
                    }
				}
				if(t==OK){
					a=OK
				}
			}
			else{
				let l=creep.pickup(from,'energy')
				if(l==ERR_NOT_IN_RANGE){
					e=creep.moveByPath(creep.memory.path1);
                    if(e==ERR_NOT_FOUND){
                        creep.memory.path1=creep.pos.findPathTo(from)
                        creep.moveByPath(creep.memory.path1)
                    }
				}
				if(l==OK){
					a=OK
				}
			}
			if(a==OK){
				if(total<=creep.getActiveBodyparts(CARRY)*50){
				creep.memory.amount=total-creep.store.getCapacity('energy')
				}
				if(total>creep.getActiveBodyparts(CARRY)*50){
					creep.memory.amount=creep.store.getFreeCapacity()
				}
			}
		}
	},
	targetType:function(target){
		if(target.processtotal===undefined){
			if(target.structureType==STRUCTURE_CONTROLLER){
				return 'c'
			}
			else{
				return 'o'
			}
		}
		else{
			return 's'
		}
	},
	run:function(creep){
		var total=creep.memory.doing.amount
		const target=Game.getObjectById(creep.memory.doing.to)
		const from=Game.getObjectById(creep.memory.doing.from)
		
		if(creep.memory.amount===undefined){
			creep.memory.amount=creep.store.getUsedCapacity('energy')
		}
		if(creep.store.getUsedCapacity('energy')==0){
			creep.memory.doing.amount=total-creep.memory.amount
			creep.memory.amount=0
			//判断是否完成任务
			if(creep.memory.doing.amount<=0){
				creep.room.cancelTask(creep.memory.doing.id)
				delete creep.memory.doing
				return
			}
			this.loading(creep,from)

		}
		else{
			switch(this.targetType(target)){
				case 'c':this.upgrade(creep,target)
						break
				case 'o':this.repair(creep,target)
						break
				case 's':this.build(creep,target)
						break
			}
		}
	}
}