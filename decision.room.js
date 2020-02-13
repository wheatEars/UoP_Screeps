
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
			var s=spawn.store.getFreeCapacity()-room.getAmountByTo(spawn.id,'energy')
			if(s>0){
				for(var a of resources){
					var e=a.amount-room.getAmountByFrom(a.id,'energy')
					if(e>Math.floor(s/100)){
						for(var i=0;i<Math.floor(s/100);i++){
							room.creatTask(TASK_CARRY,100,"energy",a.id,room.spawn[0].id,carry)
						}
						if(s%100!=0){
							room.creatTask(TASK_CARRY,s%100,"energy",a.id,room.spawn[0].id,carry)
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
				if(e>Math.floor(p/100)&&p>0){
					for(var i=0;i<Math.floor(p/50);i++){
						room.creatTask(TASK_WORK,50,"energy",a.id,room.controller.id,work)
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
		if(room.energyAvailable<room.energyCapacityAvailable){
			var spawn=room.spawns[0]
			var s=spawn.store.getFreeCapacity()-room.getAmountByTo(spawn.id,'energy')
			if(s>0){
				var resources=this.dropedEnergy(room)
				for(var a of resources){
					var e=a-room.getAmountByFrom(a.id,'energy')
					if(e>s){
						for(var i=0;i<Math.floor(s/100);i++){
							room.creatTask(TASK_CARRY,100,"energy",a.id,room.spawn[0].id,carry)
						}
						if(s%100!=0){
							room.creatTask(TASK_CARRY,s%100,"energy",a.id,room.spawn[0].id,carry)
						}
					}
				}
			}
			var extensions=room.extensions
			for(var ex of extensions){
				var z=ex.store.getFreeCapacity()-room.getAmountByTo(ex.id,'energy')
				if(z>0){
					var resources=this.dropedEnergy(room)
					for(var a of resources){
						var e=a.amount-room.getAmountByFrom(a.id,'energy')
						if(e>Math.floor(z/50)&&z>0){
							for(var i=0;i<Math.floor(z/50);i++){
								room.creatTask(TASK_CARRY,50,"energy",a.id,ex.id,carry)
							}
							if(z%100!=0){
								room.creatTask(TASK_CARRY,z%50,"energy",a.id,ex.id,carry)
							}
						}
					}
				}
			}
		}
		//建造
		if(Game.time%50==0){
			sites=room.find(FIND_CONSTRUCTION_SITES)
			if(sites.length>0){
				for(var site of sites){
					var m=site.processtotal-room.getAmountByTo(site.id,'energy')
					if(m>0){
						var resources=this.dropedEnergy(room)
						for(var a of resources){
							var e=a.amount-room.getAmountByFrom(a.id,'energy')
							if(e>Math.floor(m/2500)&&m>0){
								for(var i=0;i<Math.floor(m/2500);i++){
									room.creatTask(TASK_WORK,2500,"energy",a.id,site.id,work)
								}
								if(m%2500>0){
									room.creatTask(TASK_WORK,m%2500,"energy",a.id,site.id,work)
								}
							}
						}
					}
				}
			}
		}
		//升级
		var p=500-room.getAmountByTo(room.controller.id)
		if(p>0){
			for(var a of resources){
				var e=a.amount-room.getAmountByFrom(a.id)
				if(e>Math.floor(p/100)&&p>0){
					for(var i=0;i<Math.floor(p/50);i++){
						room.creatTask(TASK_WORK,50,"energy",a.id,room.controller.id,work)
					}
				}
			}
		}
	},



	lv3:function(room){

	}
}