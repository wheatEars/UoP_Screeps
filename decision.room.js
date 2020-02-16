
module.exports={
	run:function(room){
		switch(room.controller.level){
			case 1:this.lv1(room)
					break
			case 2:this.lv2(room)
		}
	},



	dropedEnergy:function(room){
		return room.find(FIND_DROPPED_RESOURCES,{
			filter:(s)=>{
				return s.resourceType=='energy'
			}
		})
	},



	//一级房
	lv1:function(room){
		var carry=[0,0,0,0,0,0,2,2]
		var work=[1,0,0,0,0,0,1,1]
		var resources=this.dropedEnergy(room)
		//填spawn
		if(room.energyAvailable<room.energyCapacityAvailable){
			var spawn=room.spawns[0]
			var s=spawn.store.getFreeCapacity('energy')-room.getAmountByTo(spawn.id,'energy')
			if(s>0){
				for(var a of resources){
					var e=a.amount-room.getAmountByFrom(a.id,'energy')
					s=spawn.store.getFreeCapacity('energy')-room.getAmountByTo(spawn.id,'energy')
					if(e>=s){
						for(var i=0;i<Math.floor(s/100);i++){
							room.creatTask(TASK_CARRY,100,"energy",a.id,spawn.id,carry,true)
						}
						if(s%100!=0){
							room.creatTask(TASK_CARRY,s%100,"energy",a.id,spawn.id,carry,true)
						}
					}
				}
			}
		}
		//升级
		var p=300-room.getAmountByTo(room.controller.id,'energy')
		if(p>0){
			for(var a of resources){
				var e=a.amount-room.getAmountByFrom(a.id,'energy')
				p=300-room.getAmountByTo(room.controller.id,'energy')
				if(e>p){
					for(var i=0;i<Math.floor(p/50);i++){
						room.creatTask(TASK_WORK,50,"energy",a.id,room.controller.id,work,true)
					}
				}
			}
		}
	},



	//二级房
	lv2:function(room){
		//装填
		var carry=[0,0,0,0,0,0,2,2]
		var work=[1,0,0,0,0,0,1,2]
		var upgrade=[2,0,0,0,0,0,1,3]
		var resources=this.dropedEnergy(room)
		if(room.energyAvailable<room.energyCapacityAvailable){
			var spawn=room.spawns[0]
			var s=spawn.store.getFreeCapacity('energy')-room.getAmountByTo(spawn.id,'energy')
			if(s>0){
				var resources=this.dropedEnergy(room)
				for(var a of resources){
					var e=a.amount-room.getAmountByFrom(a.id,'energy')
					s=spawn.store.getFreeCapacity('energy')-room.getAmountByTo(spawn.id,'energy')
					if(e>=s){
						for(var i=0;i<Math.floor(s/100);i++){
							room.creatTask(TASK_CARRY,100,"energy",a.id,spawn.id,carry,true)
						}
						if(s%100!=0){
							room.creatTask(TASK_CARRY,s%100,"energy",a.id,spawn.id,carry,true)
						}
					}
				}
			}
			var extensions=room.extensions
			for(var ex of extensions){
				var z=ex.store.getFreeCapacity('energy')-room.getAmountByTo(ex.id,'energy')
				if(z>0){
					var resources=this.dropedEnergy(room)
					for(var a of resources){
						var e=a.amount-room.getAmountByFrom(a.id,'energy')
						z=ex.store.getFreeCapacity('energy')-room.getAmountByTo(ex.id,'energy')
						if(e>z){
							for(var i=0;i<Math.floor(z/50);i++){
								room.creatTask(TASK_CARRY,50,"energy",a.id,ex.id,carry,true)
							}
							if(z%50!=0){
								room.creatTask(TASK_CARRY,z%50,"energy",a.id,ex.id,carry,true)
							}
						}
					}
				}
			}
		}
		//建造
		if(Game.time%10==0){
			sites=room.find(FIND_CONSTRUCTION_SITES)
			if(sites.length>0){
				for(var site of sites){
					var amount=site.progressTotal/4
					var m=site.processtotal-room.getAmountByTo(site.id,'energy')
					if(m>0){
						var resources=this.dropedEnergy(room)
						for(var a of resources){
							var e=a.amount-room.getAmountByFrom(a.id,'energy')
							if(e>amount&&m>0){
								for(var i=0;i<Math.floor(m/amount);i++){
									room.creatTask(TASK_WORK,amount,"energy",a.id,site.id,work,true)
								}
								if(m%amount>0){
									room.creatTask(TASK_WORK,m%amount,"energy",a.id,site.id,work,true)
								}
							}
						}
					}
				}
			}
		}
		//升级
		var p=300-room.getAmountByTo(room.controller.id)
		if(p>0){
			for(var a of resources){
				var e=a.amount-room.getAmountByFrom(a.id)
				p=300-room.getAmountByTo(room.controller.id,'energy')
				if(e>p){
					for(var i=0;i<Math.floor(p/50);i++){
						room.creatTask(TASK_WORK,50,"energy",a.id,room.controller.id,upgrade,true)
					}
				}
			}
		}
	},



	lv3:function(room){

	}
}