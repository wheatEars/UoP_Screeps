module.exports={
    run:function(){
        Room.prototype.cancelTask=function(taskId){
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].id==taskId){
                    console.log(this.name+" "+this.memory.tasks[i].type+" "+taskId+" removed")
                    this.memory.tasks.splice(i)
                    return 0
                }
            }
            console.log("Err task not founded")
        }
        Room.prototype.creatTask=function(taskType,taskAmount,taskResourceType,fromId,toId,needBodyPart,ifNeedVisa){
            var randomId=Game.time+this.memory.tasks.length
            this.memory.tasks.push({
                type:taskType,
                id:randomId.toString(32),
                amount:taskAmount,
                resourceType:taskResourceType,
                from:fromId,
                to:toId,
                needBodyParts:needBodyPart,//[WORK数,ATTACK数,RANGED_ATTACK数,HEAL数,CLAIM数,TOUGH数,CARRY数,MOVE数]
                needVisa:ifNeedVisa,
                isDoing:0
            })
        }
        Room.prototype.dealTask=function(task,creep){
            creep.memory.taskList.push(task);
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].id==task.id){
                    this.memory.tasks[i].isDoing=1
                    creep.say(creep.name+" got "+this.memory.tasks[i].type+this.memory.tasks[i].id)
                    return 1
                }
            }
            console.log("Task"+task.id+"not found")
        }
        global.taskGiveBack=function(creepname){
        	mem=Memory.creeps[creepname]
        	mem.taskList.push(mem.doing)
		    delete mem.doing
            var Room=Game.rooms[mem.roomname]
            for(var j in mem.taskList){
            	var task=mem.taskList[j]
		        for(var i in Room.memory.tasks){
		            if(Room.memory.tasks[i].id==task.id){
		                Room.memory.tasks[i]=task
		                console.log(Room.name+" "+task.type+" "+task.id+" given back")
		                return 0
		            }
		        }
		    }
		    mem.taskList=[]           
        }
        Room.prototype.getTaskById=function(ID){
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].id==ID){
                    return this.memory.tasks[i]
                }
            }
        }
        Room.prototype.getTaskByType=function(type){
        	var array=new Array()
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].type==type){
                    array.push(this.memory.tasks[i])
                }
            }
            return array
        }
        Room.prototype.getAmountByFrom=function(fromId,type){
            var amount=0
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].from==fromId&&this.memory.tasks[i].resourceType==type){
                    amount+=this.memory.tasks[i].amount
                }
            }
            return amount
        }
        Room.prototype.getAmountByTo=function(toId,type){
            var amount=0
            for(var i in this.memory.tasks){
                if(this.memory.tasks[i].to==toId&&this.memory.tasks[i].resourceType==type){
                    amount+=this.memory.tasks[i].amount
                }
            }
            return amount
        }
    }
}
